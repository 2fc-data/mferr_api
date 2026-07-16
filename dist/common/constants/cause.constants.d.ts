import { Division } from '../../database/models/division.model';
import { City } from '../../database/models/city.model';
import { CauseUser } from '../../database/models/cause_user.model';
import { User } from '../../database/models/user.model';
import { CauseRoleType } from '../../database/models/cause_role_type.model';
import { CauseTask } from '../../database/models/cause_task.model';
export declare const CAUSE_INCLUDE: ({
    model: typeof Division;
    as: string;
    include?: undefined;
} | {
    model: typeof City;
    as: string;
    include?: undefined;
} | {
    model: typeof CauseUser;
    as: string;
    include: ({
        model: typeof User;
        as: string;
    } | {
        model: typeof CauseRoleType;
        as: string;
    })[];
} | {
    model: typeof CauseTask;
    as: string;
    include?: undefined;
})[];
export declare function mapCauseRecord(cause: any): any;
