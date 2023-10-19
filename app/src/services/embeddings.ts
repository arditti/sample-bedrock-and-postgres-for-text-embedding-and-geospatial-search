import {invokeModel, TModelBody} from "./externals/bedrock";
import {EMBEDDING_MODEL_ID} from "../consts";


export const getEmbeddings = async (body: TModelBody) => {
    const res = await invokeModel(body, EMBEDDING_MODEL_ID);
    const resBody = new TextDecoder().decode(res.body);
    return JSON.parse(resBody).embedding;
}