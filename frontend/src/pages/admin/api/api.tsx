import {request} from "@/lib/allAuth.tsx";
import {ProductSchema, PropertySchema,CategoryFormValues, UserProfileSchema} from "@/Schema/Schema.ts";
const BASE_URL: string = `http://localhost:10000/_allauth/api`

export const URLs: { [key: string]: string } = Object.freeze({
    // Meta
    CATEGORIES: BASE_URL + '/admin/categories/',
    PRODUCT: BASE_URL + '/admin/products/',
    LOGIN: BASE_URL + '/admin/login/',
    PROPERTY: BASE_URL + '/admin/properties/',
    USER: BASE_URL + '/admin/users/',
})

//Login
export async function adminLogin(data: { username: string, password: string }) {
    return await request('POST', URLs.LOGIN, data);
}

//Category
export async function getCategories() {
    return await request('GET', URLs.CATEGORIES);
}
export async function getCategory(id:string) {
    return await request('GET', `${URLs.CATEGORIES}${id}/`);
}
export async function addCategory(data:CategoryFormValues) {
    return await request('POST', URLs.CATEGORIES, data);
}
export async function editCategory(id:string, data:CategoryFormValues) {
    return await request('PATCH', `${URLs.CATEGORIES}${id}/`, data);
}
export async function deleteCategory(id:string) {
    return await request('DELETE', `${URLs.CATEGORIES}${id}/`);
}

//Product
export async function addProduct(data :ProductSchema) {
    return await request('POST', URLs.PRODUCT, data);
}
export async function getProducts() {
    return await request('GET', URLs.PRODUCT);
}
export async function getProduct(id:string) {
    return await request('GET', `${URLs.PRODUCT}${id}/`);
}
export async function editProduct(id:string, data:CategoryFormValues) {
    return await request('PATCH', `${URLs.PRODUCT}${id}/`, data);
}
export async function deleteProduct(id:string) {
    return await request('DELETE', `${URLs.PRODUCT}${id}/`);
}

//Property
export async function addProperty(data :PropertySchema) {
    return await request('POST', URLs.PROPERTY, data);
}
export async function getProperties() {
    return await request('GET', URLs.PROPERTY);
}
export async function getPropertyById(id:string) {
    return await request('GET', `${URLs.PROPERTY}${id}/`);
}
export async function editProperty(id:string, data: PropertySchema) {
    return await request('PATCH', `${URLs.PROPERTY}${id}/`, data);
}
export async function deleteProperty(id:string) {
    return await request('DELETE', `${URLs.PROPERTY}${id}/`);
}



export async function getUsers() {
    return await request('GET', URLs.USER);
}
export async function getUserById(id:string) {
    return await request('GET', `${URLs.USER}${id}/`);
}
export async function editUser(id:string, data:UserProfileSchema) {
    return await request('PATCH', `${URLs.USER}${id}/`, data);
}
export async function deleteUser(id:string) {
    return await request('DELETE', `${URLs.USER}${id}/`);
}