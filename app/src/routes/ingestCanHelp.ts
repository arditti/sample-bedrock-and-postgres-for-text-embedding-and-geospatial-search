import {IReqProps, IUser} from "../types";
import {ingest} from "./ingest";
import {CAN_HELP, DB_ENTITIES} from "../consts";

export const ingestCanHelp = async (user: IUser, props: IReqProps) => {
    const id = await ingest(DB_ENTITIES.TABLE_CAN_HELP, user, props, CAN_HELP);
    return id;
}