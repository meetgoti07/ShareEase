import { useState, useEffect } from 'react'
import { AuthChangeRedirector, AnonymousRoute, AuthenticatedRoute } from '@/auth'
import {
    createBrowserRouter,
    RouterProvider,
    RouteObject, Outlet
} from 'react-router-dom'

import { useConfig } from '@/auth'
import ROUTES from './routes.ts'

// Page Components
import Login from "@/pages/Login/Login.tsx";
import ProviderCallback from "@/pages/Login/ProviderCallback.tsx";
import { Profile } from "@/pages/Profile/Profile.tsx";
import { AddProductForm } from "@/pages/shop/Manage/AddProduct.tsx";
import { Home } from "@/pages/Home.tsx";
import { Shop } from "@/pages/shop/Product/Shop.tsx";
import { ShowProduct } from "@/pages/shop/Product/ShowProduct.tsx";
import { AddPropertyForm } from "@/pages/rent/Manage/AddProperty.tsx";
import ShowProperty from "@/pages/rent/Property/ShowProperty.tsx";
import AdminLogin from "@/pages/admin/Login/AdminLogin.tsx";
import ProductList from "@/pages/shop/Manage/ProductList.tsx";
import { EditProduct } from "@/pages/shop/Manage/EditProduct.tsx";
import PropertyList from "@/pages/rent/Manage/PropertyList.tsx";
import { Rent } from "@/pages/rent/Property/Rent.tsx";
import { EditProperty } from "@/pages/rent/Manage/EditProperty.tsx";
import AddCategory from "@/pages/admin/Category/Categories.tsx";
import AdminProductList from "@/pages/admin/Product/AdminProductList.tsx";
import {AdminEditProduct} from "@/pages/admin/Product/AdminEditProduct.tsx";
import {AdminAddProductForm} from "@/pages/admin/Product/AdminAddProduct.tsx";
import AdminPropertyList from "@/pages/admin/Rent/AdminPropertyList.tsx";
import {AdminEditProperty} from "@/pages/admin/Rent/AdminEditProperty.tsx";
import {AdminAddProperty} from "@/pages/admin/Rent/AdminAddProperty.tsx";
import UserList from "@/pages/admin/User/UserList.tsx";
import EditUser from "@/pages/admin/User/EditUser.tsx";

// Router Setup
function createRouter(): ReturnType<typeof createBrowserRouter> {
    const routes: RouteObject[] = [
        {
            path: ROUTES.HOME,
            element: <AuthChangeRedirector><Outlet/></AuthChangeRedirector>,
            children: [
                { path: ROUTES.HOME, element: <AuthenticatedRoute><Home/></AuthenticatedRoute> },
                { path: ROUTES.LOGIN, element: <AnonymousRoute><Login/></AnonymousRoute> },
                { path: ROUTES.ACCOUNT_PROVIDER_CALLBACK, element: <ProviderCallback /> },
                { path: ROUTES.PROFILE, element: <AuthenticatedRoute><Profile/></AuthenticatedRoute> },

                {
                    path: ROUTES.SELL,
                    element: <AuthenticatedRoute><Outlet /></AuthenticatedRoute>,
                    children: [
                        { path: ROUTES.SELL, element: <ProductList /> },
                        { path: ROUTES.ADD_PRODUCT, element: <AddProductForm /> },
                        { path: ROUTES.EDIT_PRODUCT, element: <EditProduct /> }
                    ]
                },

                {
                    path: ROUTES.SHOP,
                    element: <AuthenticatedRoute><Outlet /></AuthenticatedRoute>,
                    children: [
                        { path: ROUTES.SHOP, element: <Shop /> },
                        { path: ROUTES.SHOP_PRODUCT, element: <ShowProduct /> }
                    ]
                },

                {
                    path: ROUTES.RENT,
                    element: <AuthenticatedRoute><Outlet /></AuthenticatedRoute>,
                    children: [
                        { path: ROUTES.RENT, element: <Rent /> },
                        { path: ROUTES.RENT_PROPERTY, element: <ShowProperty /> },
                        { path: ROUTES.ADD_PROPERTY, element: <AddPropertyForm /> },
                        { path: ROUTES.RENT_MY_LISTINGS, element: <PropertyList /> },
                        { path: ROUTES.EDIT_PROPERTY, element: <EditProperty /> }
                    ]
                },

                {
                    path: "/admin",
                    element: <Outlet />,
                    children: [
                        { path: ROUTES.ADMIN_LOGIN, element: <AnonymousRoute><AdminLogin/></AnonymousRoute> },

                        { path: ROUTES.ADMIN_CATEGORIES, element: <AuthenticatedRoute><AddCategory/></AuthenticatedRoute> },

                        { path: ROUTES.ADMIN_PRODUCTS, element: <AuthenticatedRoute><AdminProductList/></AuthenticatedRoute> },
                        { path: ROUTES.ADMIN_EDIT_PRODUCT, element: <AuthenticatedRoute><AdminEditProduct/></AuthenticatedRoute> },
                        { path: ROUTES.ADMIN_ADD_PRODUCT, element: <AuthenticatedRoute><AdminAddProductForm/></AuthenticatedRoute> },

                        { path: ROUTES.ADMIN_PROPERTIES, element: <AuthenticatedRoute><AdminPropertyList/></AuthenticatedRoute> },
                        { path: ROUTES.ADMIN_ADD_PROPERTY, element: <AuthenticatedRoute><AdminAddProperty/></AuthenticatedRoute> },
                        { path: ROUTES.ADMIN_EDIT_PROPERTY, element: <AuthenticatedRoute><AdminEditProperty/></AuthenticatedRoute> },
                        { path: ROUTES.ADMIN_USERS, element: <AuthenticatedRoute><UserList/></AuthenticatedRoute> },
                        { path: ROUTES.ADMIN_EDIT_USERS, element: <AuthenticatedRoute><EditUser/></AuthenticatedRoute> },

                    ]
                }
            ]
        }
    ]

    return createBrowserRouter(routes);
}

export default function Router(): JSX.Element | null {
    const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null);
    const config = useConfig();

    useEffect(() => {
        setRouter(createRouter());
    }, [config]);

    return router ? <RouterProvider router={router} /> : null;
}
