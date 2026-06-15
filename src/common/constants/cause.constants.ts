import { Court } from '../../database/models/court.model';
import { Area } from '../../database/models/area.model';
import { Stage } from '../../database/models/stage.model';
import { Status } from '../../database/models/status.model';
import { Outcome } from '../../database/models/outcome.model';
import { Division } from '../../database/models/division.model';
import { City } from '../../database/models/city.model';
import { CauseUser } from '../../database/models/cause_user.model';
import { User } from '../../database/models/user.model';
import { CauseRoleType } from '../../database/models/cause_role_type.model';
import { PartySide } from '../../database/models/party_side.model';
import { CauseTask } from '../../database/models/cause_task.model';

/**
 * Shared constants for Cause-related data fetching and includes.
 */

export const CAUSE_INCLUDE = [
  { model: Court, as: 'court' },
  { model: Area, as: 'area' },
  { model: Stage, as: 'current_stage' },
  { model: Status, as: 'current_status' },
  { model: Outcome, as: 'outcome' },
  { model: Division, as: 'division' },
  { model: City, as: 'city' },
  {
    model: CauseUser,
    as: 'cause_users',
    include: [
      { model: User, as: 'user' },
      { model: CauseRoleType, as: 'role_type' },
      { model: PartySide, as: 'party_side' },
    ],
  },
  { model: CauseTask, as: 'cause_tasks' },
];

/**
 * Helper to map raw cause records to a flattened structure with virtual fields like client_names.
 */
export function mapCauseRecord(cause: any) {
  const json = typeof cause.toJSON === 'function' ? cause.toJSON() : cause;
  
  const client_names = json.cause_users
    ?.filter((cu: any) => cu.role_type?.slug === 'client')
    .map((cu: any) => cu.user?.name)
    .filter(Boolean)
    .join(', ');

  const collaborator_ids = json.cause_users
    ?.filter((cu: any) => cu.role_type?.slug === 'lawyer')
    .map((cu: any) => Number(cu.user_id)) || [];

  const client_ids = json.cause_users
    ?.filter((cu: any) => cu.role_type?.slug === 'client')
    .map((cu: any) => Number(cu.user_id)) || [];

  return {
    ...json,
    client_names: client_names || 'Não Atribuído',
    collaborator_ids,
    client_ids,
  };
}
