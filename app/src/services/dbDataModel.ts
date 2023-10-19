import {IDBPerson, IDBShared, TEntityID, TPersonID} from "../types";
import {DB_ENTITIES, MAX_KM, MAX_RESULTS, NEED_HELP} from "../consts";
import {insert, query} from "./externals/postgres";
import pgvector from "pgvector/pg";
import {LatLngBounds} from "@googlemaps/google-maps-services-js";
import {LatLngLiteral} from "@googlemaps/google-maps-services-js/src/common";


// TODO: Switch to upsert
export const insertPerson = async (user: IDBPerson): Promise<number> => {
    const string = `INSERT INTO ${DB_ENTITIES.SCHEMA}.${DB_ENTITIES.TABLE_PERSONS}
                            (phone, email, name)
                             values ($1, $2, $3)
                             RETURNING ${DB_ENTITIES.ID_FIELD};`
    const props = [user.phone, user.email, user.name]

    const res = await insert(string, props);

    return res.rows[0][DB_ENTITIES.ID_FIELD] as TPersonID;
}


const boundsToPolygon = (bounds: LatLngBounds) => {
    const cords = {
        northeast: {lat: bounds.northeast.lat, lng: bounds.northeast.lng},
        northwest: {lat: bounds.northeast.lat, lng: bounds.southwest.lng},
        southwest: {lat: bounds.southwest.lat, lng: bounds.southwest.lng},
        southeast: {lat: bounds.southwest.lat, lng: bounds.northeast.lng},
    }
    return `'POLYGON((${cords.northeast.lng} ${cords.northeast.lat},${cords.northwest.lng} ${cords.northwest.lat},${cords.southwest.lng} ${cords.southwest.lat},${cords.southeast.lng} ${cords.southeast.lat}, ${cords.northeast.lng} ${cords.northeast.lat}))'`
}

const latLngToPoint = (point: LatLngLiteral) => {
    return `'POINT(${point.lng} ${point.lat})'`
}

export const insertGeneric = async (tableName: string, dbData: IDBShared) => {
    const poly = boundsToPolygon(dbData.polygon);
    const point = latLngToPoint(dbData.point);
    const person = String(dbData.person_id)
    const embeddings = pgvector.toSql(dbData.embeddings)
    const geocode = JSON.stringify(dbData.geocode)
    const string = `INSERT INTO ${DB_ENTITIES.SCHEMA}.${tableName} 
                            (person_id, text, address, embeddings, geocode, point, polygon, entity_type) 
                            values ($1,$2,$3,$4,$5,${point},${poly},$6)   
                            RETURNING ${DB_ENTITIES.ID_FIELD};`
    const props = [person, dbData.text, dbData.address, embeddings, geocode, dbData.entity_type];
    const res = await insert(string, props);
    return res.rows[0][DB_ENTITIES.ID_FIELD] as TEntityID;
}

export const getEntity = async (id: TEntityID) => {
    const string = `SELECT * FROM ${DB_ENTITIES.SCHEMA}.${DB_ENTITIES.TABLE_CAN_HELP}
                            WHERE id = $1;`
    const props = [String(id)];
    const res = await query(string, props);
    return res.rows[0];
}

/*
TODO: Add complex business logic here
Current logic:
1. query for helpers - 20km
2. query 5 closest vectors (knn)
3. order by geo
 */
export const getBestHelp = async (needHelpId: number)=>{
    const {SCHEMA, TABLE_NEED_HELP} = DB_ENTITIES;
    const source =  `${SCHEMA}.${TABLE_NEED_HELP}`;
    const id = String(needHelpId)
    const string = `
SELECT * 
from
(SELECT
    *,
    embeddings <-> (select embeddings from ${source} where id = $1) AS vector_dist
    FROM (
    SELECT * FROM (
        SELECT *,
        ${source}.polygon <-> (select polygon from ${source} where id = $1) AS dist
        FROM
            ${source}
        where 
            (entity_type <> '${NEED_HELP}' OR entity_type is null) AND id <> $1
        ) relevant_helpers
            where dist < $2
        ) relevant_distance_helpers
    order by vector_dist
    limit $3) relevant_vector_helpers
    order by dist
`
    const props = [id, String(MAX_KM), String(MAX_RESULTS)];
    const res = await query(string, props);
    return res
}