import {request} from "@/lib/allAuth.tsx";

const BASE_URL: string = `http://localhost:10000/_allauth/api/`

export const URLs: { [key: string]: string } = Object.freeze({
    // Meta
    PROPERTY: BASE_URL + 'properties/',

})
export async function getProperties() {
    return await request('GET', URLs.PROPERTY);
}
export async function getPropertyById(id) {
    return await request('GET', `${URLs.PROPERTY}${id}/`);
}

export async function addProperty(data:any) {
    return await request('POST', URLs.PROPERTY, data);
}

export async function editProperty(id, data) {
    console.log(data);
    return await request('PUT', `${URLs.PROPERTY}${id}/`, data);
}


export async function deleteProperty(id) {
    return await request('DELETE', `${URLs.PROPERTY}${id}/`);
}
