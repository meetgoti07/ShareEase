import {request} from "@/lib/allAuth.tsx";
import {PropertyFormValues} from "@/pages/rent/Manage/AddProperty.tsx";

const BASE_URL: string = `http://localhost:10000/_allauth/api/`

export const URLs: { [key: string]: string } = Object.freeze({
    // Meta
    PROPERTY: BASE_URL + 'properties/',
    MY_PROPERTY: BASE_URL + 'my-properties/',

})
export async function getProperties() {
    return await request('GET', URLs.PROPERTY);
}
export async function getPropertyById(id:string) {
    return await request('GET', `${URLs.PROPERTY}${id}/`);
}


export async function getMyProperties() {
    return await request('GET', URLs.MY_PROPERTY);
}
export async function getMyPropertyById(id:string) {
    return await request('GET', `${URLs.MY_PROPERTY}${id}/`);
}

export async function addMyProperty(data:PropertyFormValues) {
    return await request('POST', URLs.MY_PROPERTY, data);
}

export async function editMyProperty(id:string, data:PropertyFormValues) {
    console.log(data);
    return await request('PATCH', `${URLs.MY_PROPERTY}${id}/`, data);
}

export async function deleteMyProperty(id:string) {
    return await request('DELETE', `${URLs.MY_PROPERTY}${id}/`);
}
