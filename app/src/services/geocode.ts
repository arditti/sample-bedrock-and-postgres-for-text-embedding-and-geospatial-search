import {GeocodeResult, LatLngBounds} from "@googlemaps/google-maps-services-js";
import {getGeoCode} from "./externals/googleMaps";
import {LatLngLiteral} from "@googlemaps/google-maps-services-js/src/common";

interface IRes {
    geocode: GeocodeResult[],
    bounds: LatLngBounds,
    point: LatLngLiteral
}

/*
 * Shifts array x times
 */
const shiftXElements = (array: any[], xTimes: number) => {
    const newArray = [...array]
    for (let i = 0; i < xTimes; i++) {
        newArray.shift();
    }
    return newArray;
}
export const getGeoCodeBoundAndPoint = async (address: string): Promise<IRes> => {
    const innerGeoCode = async (address: string): Promise<IRes | false> => {
        const response = await getGeoCode(address)
        if (!response.data.results.length) { // In case there are no results, try to break some of the address
            return false
        }
        const bounds = response.data.results[0].geometry.bounds
        const point = response.data.results[0].geometry.location;
        // @ts-ignore
        return {geocode: response.data.results, bounds, point};
    }
    /*
    In use in order to remove address parts till geocode found.
    For example, in case of "New York, NY" geocode will return nothing,
    but if we remove "NY" part, geocode will return something.
    TODO: Refactor
     */
    const addressParts = address.split(" ");
    for (let i = 0; i < addressParts.length; i++) {
        const parts = shiftXElements(addressParts, i);
        const response = await innerGeoCode(parts.join(' '));
        if (!response) {
            continue;
        }
        return response;

    }

    throw new Error("Address not found");
}



