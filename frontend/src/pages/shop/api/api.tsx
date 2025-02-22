import {request} from "@/lib/allAuth.tsx";

const BASE_URL: string = `http://localhost:10000/_allauth/api/`

export const URLs: { [key: string]: string } = Object.freeze({
    // Meta
    CATEGORIES: BASE_URL + 'categories/',
    PRODUCT: BASE_URL + 'products/',
    SEARCH: BASE_URL + 'search/',
    MY_PRODUCT: BASE_URL + 'my-products/',
})

export async function getCategories() {
    return await request('GET', URLs.CATEGORIES);
}

export async function searchProduct(params) {

    return await request('GET', `${URLs.SEARCH}?q=${params}`);
}


export async function getProducts() {
    return await request('GET', URLs.PRODUCT);
}

export async function getProduct(id) {
    return await request('GET', `${URLs.PRODUCT}${id}/`);
}

export async function getMyProducts() {
    return await request('GET', URLs.MY_PRODUCT);
}

export async function getMyProduct(id) {
    return await request('GET', `${URLs.MY_PRODUCT}${id}/`);
}

export async function addProduct(data :any) {
    return await request('POST', URLs.MY_PRODUCT, data);
}

export async function editProduct(id, data) {
    return await request('PATCH', `${URLs.MY_PRODUCT}${id}/`, data);
}
export async function deleteProduct(id) {
    return await request('DELETE', `${URLs.MY_PRODUCT}${id}/`);
}