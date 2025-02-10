import {request} from "@/lib/allAuth.tsx";

const BASE_URL: string = `http://localhost:10000/_allauth/api`

export const URLs: { [key: string]: string } = Object.freeze({
    // Meta
    CATEGORIES: BASE_URL + '/admin/categories/',
    PRODUCT: BASE_URL + '/admin/products/',
    LOGIN: BASE_URL + '/admin/login/',
})

export async function getCategories() {
    return await request('GET', URLs.CATEGORIES);
}

export async function adminLogin(data) {
    return await request('POST', URLs.LOGIN, data);
}

export async function getCategory(id:string) {
    return await request('GET', `${URLs.CATEGORIES}${id}/`);
}

export async function addCategory(data:any) {
    return await request('POST', URLs.CATEGORIES, data);
}

export async function editCategory(id, data) {
    return await request('PUT', `${URLs.CATEGORIES}${id}/`, data);
}

export async function deleteCategory(id) {
    return await request('DELETE', `${URLs.CATEGORIES}${id}/`);
}


export async function addProduct(data :any) {
    return await request('POST', URLs.PRODUCT, data);
}

export async function getProducts() {
    return await request('GET', URLs.PRODUCT);
}
export async function getProduct(id) {
    return await request('GET', `${URLs.PRODUCT}${id}/`);
}
export async function editProduct(id, data) {
    return await request('PUT', `${URLs.PRODUCT}${id}/`, data);
}
export async function deleteProduct(id) {
    return await request('DELETE', `${URLs.PRODUCT}${id}/`);
}