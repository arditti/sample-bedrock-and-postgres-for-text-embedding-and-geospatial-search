import {IReqProps, IUser} from "../types";
import {ingest} from "./ingest";
import {DB_ENTITIES, NEED_HELP} from "../consts";

export const ingestNeedHelp = async (user: IUser, props: IReqProps) => {
    const id = await ingest(DB_ENTITIES.TABLE_NEED_HELP, user, props, NEED_HELP);
    return id;
}