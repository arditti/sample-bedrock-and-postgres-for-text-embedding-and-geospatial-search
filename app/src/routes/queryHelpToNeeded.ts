import {getBestHelp, getEntity} from "../services/dbDataModel";

export const queryHelpToNeeded = async (needHelpId: number) => {
    const entity = await getEntity(needHelpId);
    const res = await getBestHelp(needHelpId);
    return {query: entity, results: res.rows}
}