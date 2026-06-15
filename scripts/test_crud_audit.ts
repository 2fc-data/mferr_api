import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AreasService } from '../src/areas/areas.service';
import { CityService } from '../src/city/city.service';
import { CourtsService } from '../src/courts/courts.service';
import { StagesService } from '../src/stages/stages.service';
import { StatusService } from '../src/status/status.service';
import { CausesService } from '../src/causes/causes.service';
import { UsersService } from '../src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const areasService = app.get(AreasService);
  const cityService = app.get(CityService);
  const courtsService = app.get(CourtsService);
  const stagesService = app.get(StagesService);
  const statusService = app.get(StatusService);
  const causesService = app.get(CausesService);
  const usersService = app.get(UsersService);

  console.log('--- Starting CRUD Audit (including Causes) ---');

  const suffix = Date.now();

  try {
    // 1. Dependency Setup
    console.log('Setting up dependencies...');
    const area = await areasService.create({ name: `Area ${suffix}`, description: 'Audit' });
    const city = await cityService.create({ name: `City ${suffix}`, uf: 'TS' });
    const court = await courtsService.create({ name: `COURT_${suffix}`, description: 'Audit', state: 'TS', is_federal: false });
    const stage = await stagesService.create({ name: `Stage ${suffix}`, description: 'Audit' });
    const status = await statusService.create({ name: `Status ${suffix}`, description: 'Audit', stage_id: stage.id });
    
    // Create a User (Client)
    const docSuffix = String(suffix).slice(-11);
    const user = await usersService.create({
      name: `User ${suffix}`,
      document: docSuffix,
      email: `crud_${suffix}@test.com`,
      username: `user_${suffix}`,
      password: 'password123',
      phone1: `(00) 9${String(suffix).slice(-8)}`,
      profile_ids: [4], // Client
      nationality: 'Brasileira',
      birth_state: 'TS',
      mother_name: 'Mother Test',
      birth_date: '1990-01-01'
    });

    if (!user) throw new Error('Failed to create user dependency');

    console.log('Dependencies ready.');

    // 2. Causes CRUD
    console.log('\n--- Testing Causes CRUD ---');
    const causeNumber = `TEST-${suffix}`;
    const newCause = await causesService.create({
      number: causeNumber,
      description: 'Cause created by CRUD audit',
      court_id: court.id,
      city_id: city.id,
      area_id: area.id,
      current_stage_id: stage.id,
      current_status_id: status.id,
      total_value: 1000.00,
      total_fees: 200.00,
      customer_amount: 800.00,
      percentage: 20.00,
      process_date: new Date().toISOString().split('T')[0],
      involved_users: [{ user_id: user.id, role_type_id: 1, party_side_id: 1 }]
    });
    console.log('CREATE: Success', newCause.id);

    const foundCause = await causesService.findOne(newCause.id);
    console.log('READ: Success', foundCause.number);

    const updatedCause = await causesService.update(newCause.id, {
      description: 'Cause updated by CRUD audit'
    });
    console.log('UPDATE: Success', updatedCause.description);

    // 3. Cleanup
    console.log('\nCleaning up...');
    // Use raw destroy for cleanup if needed, but remove should work
    await causesService.remove(newCause.id);
    console.log('Cause Deleted');
    
    await usersService.remove(user.id);
    await statusService.remove(status.id);
    await stagesService.remove(stage.id);
    await courtsService.remove(court.id);
    await cityService.remove(city.id);
    await areasService.remove(area.id);

    console.log('\nAudit Completed Successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('\nAudit Failed:', error.response?.data || error.message);
    if (error.response?.data?.message) {
        console.error('Detail:', error.response.data.message);
    }
    process.exit(1);
  }
}

bootstrap();
