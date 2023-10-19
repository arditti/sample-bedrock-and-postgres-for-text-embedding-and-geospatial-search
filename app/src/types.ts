import {LatLngBounds} from "@googlemaps/google-maps-services-js";
import {LatLngLiteral} from "@googlemaps/google-maps-services-js/src/common";

export interface IUser {
    phone: string;
    email: string;
    name: string;
}

export type TPersonID = number;
export type TEntityID = number;

export interface IReqProps {
    text: string;
    address: string;
}

export interface IDBPerson {
    phone: IUser['phone'];
    email: IUser['email'];
    name: IUser['name'];
}

export type TEntityType= 'needHelp' | 'canHelp';

export interface IDBShared {
    entity_type: TEntityType;
    text: IReqProps['text'];
    address: IReqProps['address'];
    person_id: TPersonID;
    embeddings: number[];
    geocode: Record<any, any>;
    polygon: LatLngBounds;
    point: LatLngLiteral;
}

export interface IDBNeedHelp extends IDBShared {

}

export interface IDBCanHelp extends IDBShared {

}

export interface IEnv {
    PORT: string
    POSTGRES_HOST: string
    POSTGRES_PORT: number
    POSTGRES_USER: string
    POSTGRES_PASSWORD: string
    POSTGRES_DB: string
    GOOGLE_MAPS_API_KEY: string
    AWS_ACCESS_KEY_ID: string
    AWS_SECRET_ACCESS_KEY: string
    AWS_DEFAULT_REGION: string
}
