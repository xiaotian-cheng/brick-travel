import { FluxStandardAction } from 'flux-standard-action';

import { IActionMetaInfo, IActionPayload } from '../store.action';
import { IEntities, INIT_ENTITY_STATE } from './entity.model';

export interface IEntityActionMetaInfo extends IActionMetaInfo {
    pagination: IPagination;
    entityType: EntityTypeEnum;
    phaseType: EntityActionPhaseEnum;
}

export interface IPagination {
    page: number;
    limit: number;
}

export interface IQueryCondition {
    [key: string]: string;
}

export interface IEntityActionPayload extends IActionPayload {
    entities: IEntities
    queryCondition?: IQueryCondition,
    objectId? : string
}

// Flux-standard-action gives us stronger typing of our actions.
export type EntityAction = FluxStandardAction<IEntityActionPayload, IEntityActionMetaInfo>;

export enum EntityActionPhaseEnum {
    TRIGGER = "TRIGGER",
    START = "START",
    SUCCEED = "SUCCEED",
    FAIL = "FAIL",
    EXECUTE = "EXECUTE"
}

export enum EntityTypeEnum {
    CITY = "CITY",
    VIEWPOINT = "VIEWPOINT",
    VIEWPOINTCOMMENT = "VIEWPOINTCOMMENT",
    TRAVELAGENDA = "TRAVELAGENDA",
    DAILYTRIP = "DAILYTRIP",
    FILTERCATEGORY = "FILTERCATEGORY",
    TRAVELVIEWPOINT = "TRAVELVIEWPOINT"
}

export enum EntityActionTypeEnum {
    LOAD = "ENTITY:LOAD",
    SAVE = "ENTITY:SAVE",
    UPDATE = "ENTITY:UPDATE",
    INSERT = "ENTITY:INSERT",
    DELETE = "ENTITY:DELETE",
    FLUSH = "ENTITY:FLUSH"
}

let defaultEntityActionPayload = {
    error: null,
    entities: null,
    objectId: ''
}

let defaultEntityActionMeta = {
    pagination: null,
    phaseType: EntityActionPhaseEnum.EXECUTE,
    progressing: false
}


//#region Load Actions
export function entityLoadAction(entityType: EntityTypeEnum) {
    return (queryCondition: IQueryCondition = {}, page: number = 0, limit: number = 50): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            pagination: { page: page, limit: limit },
            progressing: true,
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            queryCondition: queryCondition
        })
    })
}

export function entityLoadActionStarted(entityType: EntityTypeEnum) {
    return (): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            progressing: true,
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.START
        }),
        payload: defaultEntityActionPayload,
    })
}

export function entityLoadActionFailed(entityType: EntityTypeEnum) {
    return (error: Error): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType, 
            phaseType: EntityActionPhaseEnum.FAIL
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            error: error
        })
    })
}

export function entityLoadActionSucceeded(entityType: EntityTypeEnum) {
    return (entities: IEntities): EntityAction => ({
        type: EntityActionTypeEnum.LOAD,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.SUCCEED
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entities: entities
        })
    })
}
//#endregion

//#region Update action
export function entityUpdateAction<T>(entityType: EntityTypeEnum, entityKey: string) {
    return (id: string, entity: T): EntityAction => ({
        type: EntityActionTypeEnum.UPDATE,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entities: Object.assign({}, INIT_ENTITY_STATE, { [entityKey]: { [id]: entity } })
        })
    })
}
//#endregion

//#region Insert action
export function entityInsertAction<T>(entityType: EntityTypeEnum, entityKey: string) {
    return (id: string, entity: T): EntityAction => ({
        type: EntityActionTypeEnum.INSERT,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entities: Object.assign({}, INIT_ENTITY_STATE, { [entityKey]: { [id]: entity } })
        })
    })
}
//#endregion

//#region Flush action
export function entityFlushAction(entityType: EntityTypeEnum, entityKey: string) {
    return (id: string): EntityAction => ({
        type: EntityActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.TRIGGER
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
           objectId: id
        })
    })
}

export function entityFlushActionStarted(entityType: EntityTypeEnum) {
    return (): EntityAction => ({
        type: EntityActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultEntityActionMeta, {
            progressing: true,
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.START
        }),
        payload: defaultEntityActionPayload,
    })
}

export function entityFlushActionFailed(entityType: EntityTypeEnum) {
    return (error: Error): EntityAction => ({
        type: EntityActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.FAIL
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            error: error
        })
    })
}

export function entityFlushActionSucceeded(entityType: EntityTypeEnum) {
    return (): EntityAction => ({
        type: EntityActionTypeEnum.FLUSH,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType,
            phaseType: EntityActionPhaseEnum.SUCCEED
        }),
        payload: defaultEntityActionPayload
    })
}

//#endregion

//#region Delete action
export function entityDeleteAction<T>(entityType: EntityTypeEnum, entityKey: string) {
    return (id: string, entity: T): EntityAction => ({
        type: EntityActionTypeEnum.DELETE,
        meta: Object.assign({}, defaultEntityActionMeta, {
            entityType: entityType
        }),
        payload: Object.assign({}, defaultEntityActionPayload, {
            entities: Object.assign({}, INIT_ENTITY_STATE, { [entityKey]: { [id]: entity } })
        })
    })
}
//#endregion