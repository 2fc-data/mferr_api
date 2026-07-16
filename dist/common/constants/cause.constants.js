"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAUSE_INCLUDE = void 0;
exports.mapCauseRecord = mapCauseRecord;
const court_model_1 = require("../../database/models/court.model");
const area_model_1 = require("../../database/models/area.model");
const stage_model_1 = require("../../database/models/stage.model");
const status_model_1 = require("../../database/models/status.model");
const outcome_model_1 = require("../../database/models/outcome.model");
const division_model_1 = require("../../database/models/division.model");
const city_model_1 = require("../../database/models/city.model");
const cause_user_model_1 = require("../../database/models/cause_user.model");
const user_model_1 = require("../../database/models/user.model");
const cause_role_type_model_1 = require("../../database/models/cause_role_type.model");
const party_side_model_1 = require("../../database/models/party_side.model");
const cause_task_model_1 = require("../../database/models/cause_task.model");
exports.CAUSE_INCLUDE = [
    { model: court_model_1.Court, as: 'court' },
    { model: area_model_1.Area, as: 'area' },
    { model: stage_model_1.Stage, as: 'current_stage' },
    { model: status_model_1.Status, as: 'current_status' },
    { model: outcome_model_1.Outcome, as: 'outcome' },
    { model: division_model_1.Division, as: 'division' },
    { model: city_model_1.City, as: 'city' },
    {
        model: cause_user_model_1.CauseUser,
        as: 'cause_users',
        include: [
            { model: user_model_1.User, as: 'user' },
            { model: cause_role_type_model_1.CauseRoleType, as: 'role_type' },
            { model: party_side_model_1.PartySide, as: 'party_side' },
        ],
    },
    { model: cause_task_model_1.CauseTask, as: 'cause_tasks' },
];
function mapCauseRecord(cause) {
    const json = typeof cause.toJSON === 'function' ? cause.toJSON() : cause;
    const client_names = json.cause_users
        ?.filter((cu) => cu.role_type?.slug === 'client')
        .map((cu) => cu.user?.name)
        .filter(Boolean)
        .join(', ');
    const collaborator_ids = json.cause_users
        ?.filter((cu) => cu.role_type?.slug === 'lawyer')
        .map((cu) => Number(cu.user_id)) || [];
    const client_ids = json.cause_users
        ?.filter((cu) => cu.role_type?.slug === 'client')
        .map((cu) => Number(cu.user_id)) || [];
    return {
        ...json,
        client_names: client_names || 'Não Atribuído',
        collaborator_ids,
        client_ids,
    };
}
//# sourceMappingURL=cause.constants.js.map