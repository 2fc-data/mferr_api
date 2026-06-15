import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Address } from '../database/models/address.model';
import { UserAddress } from '../database/models/user_address.model';
import { AddressType } from '../database/models/address_type.model';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuditService } from '../audit/audit.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address)
    private addressModel: typeof Address,
    @InjectModel(UserAddress)
    private userAddressModel: typeof UserAddress,
    private auditService: AuditService,
    private sequelize: Sequelize,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    userId?: number,
    performingUserId?: number,
  ): Promise<Address> {
    const transaction = await this.sequelize.transaction();
    try {
      // Destructure to separate Address model fields from UserAddress join table fields
      const { address_type_id, is_primary, user_id, ...addressData } =
        createAddressDto;

      const address = await this.addressModel.create(addressData as any, {
        transaction,
      });

      const targetUserId = userId || user_id || createAddressDto.user_id;
      if (targetUserId) {
        await this.userAddressModel.create(
          {
            user_id: Number(targetUserId),
            address_id: address.id,
            address_type_id: address_type_id || createAddressDto.address_type_id || 1,
            is_primary: is_primary ?? createAddressDto.is_primary ?? true,
          },
          { transaction },
        );
      }

      await transaction.commit();

      // Record Audit for Creation (linked to User if available)
      if (targetUserId) {
        const addressLabels: Record<string, string> = {
          postcode: 'CEP',
          city: 'Cidade',
          state: 'UF',
          district: 'Bairro',
          street: 'Logradouro',
          number: 'Número',
          complement: 'Complemento',
          address_type_id: 'ID do Tipo de Endereço',
        };

        const initialData: any = {};
        const isVazio = (v: any) =>
          v === null ||
          v === undefined ||
          v === '' ||
          String(v).trim() === '' ||
          String(v).trim() === 'null';

        Object.keys(addressLabels).forEach((key) => {
          let val;
          if (key === 'address_type_id') {
            val = address_type_id;
          } else {
            val = (address as any)[key];
          }
          initialData[addressLabels[key]] = {
            old: 'vazio',
            new: isVazio(val) ? 'vazio' : val,
          };
        });

        // Use performingUserId if available, otherwise default to a safe value or handle as system action
        // Since we added JwtAuthGuard to the controller, performingUserId should be available in normal flow.
        await this.auditService.createRawLog(
          'user',
          targetUserId,
          'UPDATE',
          { 'Endereço (Novo)': initialData },
          performingUserId || targetUserId, // Fallback to target user if performing user is unknown (e.g. self-registration)
        );
      }

      return address;
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  async findAll(): Promise<Address[]> {
    return this.addressModel.findAll({ include: ['users'] });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressModel.findByPk(id, {
      include: ['users'],
    });
    if (!address) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }
    return address;
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
    performingUserId?: number,
  ): Promise<Address> {
    const address = await this.findOne(id);
    const oldValues = address.get({ plain: true });

    // Destructure to separate Address model fields from other fields
    const { address_type_id, is_primary, user_id, ...addressData } =
      updateAddressDto as any;

    await address.update(addressData);

    // Update or Create join table metadata
    const targetUserId = user_id || (updateAddressDto as any).user_id;
    if (targetUserId || address_type_id || is_primary !== undefined) {
      const [ua, created] = await this.userAddressModel.findOrCreate({
        where: { address_id: id },
        defaults: {
          user_id: Number(targetUserId),
          address_id: id,
          address_type_id: address_type_id || 1,
          is_primary: is_primary ?? false,
        }
      });

      if (!created) {
        await ua.update({
          ...(targetUserId && { user_id: Number(targetUserId) }),
          ...(address_type_id && { address_type_id }),
          ...(is_primary !== undefined && { is_primary })
        });
      }
    }

    const newValues = address.get({ plain: true });

    // Find associated user for the audit log
    const userAddress = await this.userAddressModel.findOne({
      where: { address_id: id },
    });
    const targetEntityType = userAddress ? 'user' : 'address';
    const targetEntityId = userAddress ? userAddress.user_id : id;

    // Record audit with human-readable labels
    const addressLabels: Record<string, string> = {
      postcode: 'CEP',
      city: 'Cidade',
      state: 'UF',
      district: 'Bairro',
      street: 'Logradouro',
      number: 'Número',
      complement: 'Complemento',
      address_type_id: 'ID do Tipo de Endereço',
    };

    const isVazio = (v: any) =>
      v === null ||
      v === undefined ||
      v === '' ||
      String(v).trim() === '' ||
      String(v).trim() === 'null';
    const changes: any = {};
    let hasChanges = false;

    for (const key of Object.keys(addressLabels)) {
      const oldV = oldValues[key];
      const newV = newValues[key];

      if (isVazio(oldV) && isVazio(newV)) continue;

      if (String(oldV).trim() !== String(newV).trim()) {
        changes[`Endereço: ${addressLabels[key]}`] = {
          old: isVazio(oldV) ? 'vazio' : oldV,
          new: isVazio(newV) ? 'vazio' : newV,
        };
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await this.auditService.createRawLog(
        targetEntityType,
        targetEntityId,
        'UPDATE',
        changes,
        performingUserId || targetEntityId,
      );
    }

    return address;
  }

  async remove(id: number, performingUserId?: number): Promise<void> {
    const address = await this.findOne(id);
    const oldValues = address.get({ plain: true });

    await address.destroy();

    // Record audit for deletion
    await this.auditService.recordUpdate(
      'address',
      id,
      oldValues,
      null,
      performingUserId || 0,
    );
  }

  async findByUser(userId: number): Promise<Address[]> {
    try {
      const userAddresses = await this.userAddressModel.findAll({
        where: { user_id: userId },
        attributes: ['address_id', 'address_type_id', 'is_primary'],
        include: [{ model: AddressType, as: 'address_type' }]
      });

      if (!userAddresses || userAddresses.length === 0) {
        return [];
      }

      const addressIds = userAddresses.map((ua) => ua.address_id);

      const addresses = await this.addressModel.findAll({
        where: {
          id: addressIds,
        },
      });

      // Merge address_type and is_primary from the join table
      return addresses.map((addr) => {
        const ua = userAddresses.find((u) => u.address_id === addr.id);
        const plain = addr.get({ plain: true });
        return {
          ...plain,
          address_type: ua?.address_type || null,
          is_primary: ua?.is_primary || false,
        } as Address;
      });
    } catch (error) {
      console.error('Error in findByUser:', error);
      return [];
    }
  }
}
