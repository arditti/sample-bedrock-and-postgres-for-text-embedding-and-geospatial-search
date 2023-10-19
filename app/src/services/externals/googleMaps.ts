import {Client, GeocodeRequest} from "@googlemaps/google-maps-services-js";

const client = new Client();
export const getGeoCode = async (address: string) => {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
        throw new Error("GOOGLE_MAPS_API_KEY is not defined");
    }
    const geoCodeReq: GeocodeRequest = {params: {address: address, key: process.env.GOOGLE_MAPS_API_KEY,}}
    const response = await client.geocode(geoCodeReq);
    return response;
}