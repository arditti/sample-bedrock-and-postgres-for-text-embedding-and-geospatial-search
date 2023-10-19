import {IDBCanHelp, IReqProps, IUser, TEntityID, TEntityType} from "../types";
import { insertGeneric, insertPerson} from "../services/dbDataModel";
import {getGeoCodeBoundAndPoint} from "../services/geocode";
import {getEmbeddings} from "../services/embeddings";

const normalizePhone = (phone: string)=>{
    let newPhone = phone
        .replaceAll('-', '')
        .replaceAll(' ', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('+972', '');

    if (newPhone.startsWith('972')){
        newPhone = newPhone.substring(3);
    }
    if (newPhone.startsWith('0'))
        return newPhone
    return `0${newPhone}`;

}
export const ingest = async (tableName: string, user: IUser, props: IReqProps, entityType: TEntityType) => {
    const personId = await insertPerson({...user, phone: normalizePhone(user.phone)});
    const {geocode, bounds, point} = await getGeoCodeBoundAndPoint(props.address);
    const embeddingBody = {inputText: props.text};
    const embeddings = await getEmbeddings(JSON.stringify(embeddingBody));
    const dbProps: IDBCanHelp = {
        text: props.text,
        address: props.address,
        person_id: personId,
        embeddings: embeddings,
        geocode: geocode,
        polygon: bounds,
        point: point,
        entity_type: entityType
    }
    return await insertGeneric(tableName, dbProps)
}