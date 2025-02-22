const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    ACCOUNT_PROVIDER_CALLBACK: "/account/provider/callback",
    PROFILE: "/profile",

    // Shop Routes
    SHOP: "/shop",
    SHOP_PRODUCT: "/shop/:id",
    SELL: "/sell",
    ADD_PRODUCT: "/sell/add-product",
    EDIT_PRODUCT: "/sell/edit-product/:id",

    // Rent Routes
    RENT: "/rent",
    RENT_PROPERTY: "/rent/:id",
    ADD_PROPERTY: "/rent/add-property",
    RENT_MY_LISTINGS: "/rent/my-listings",
    EDIT_PROPERTY: "/rent/my-listings/:id",

    // Admin Routes
    ADMIN_LOGIN: "/admin/login",

    ADMIN_CATEGORIES: "/admin/categories",

    //Products
    ADMIN_PRODUCTS: "/admin/products",
    ADMIN_ADD_PRODUCT: "/admin/products/add-product",
    ADMIN_PRODUCT: "/admin/products/:id",
    ADMIN_EDIT_PRODUCT: "/admin/products/edit/:id",

    //Property
    ADMIN_PROPERTIES: "/admin/properties",
    ADMIN_ADD_PROPERTY: "/admin/properties/add-property",
    ADMIN_PROPERTY: "/admin/properties/:id",
    ADMIN_EDIT_PROPERTY: "/admin/properties/edit/:id",

    //Users
    ADMIN_USERS: "/admin/users",
    ADMIN_EDIT_USERS: "/admin/users/edit/:id",



};

export default ROUTES;
