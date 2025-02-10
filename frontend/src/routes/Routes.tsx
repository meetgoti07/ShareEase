import { useState, useEffect } from 'react'
import { AuthChangeRedirector, AnonymousRoute, AuthenticatedRoute } from '@/auth'
import {
    createBrowserRouter,
    RouterProvider,
    RouteObject, Outlet
} from 'react-router-dom'

import { useConfig } from '@/auth'
import Login from "@/pages/Login/Login.tsx";
import ProviderCallback from "@/pages/Login/ProviderCallback.tsx";
import {Profile} from "@/pages/Profile/Profile.tsx";
import {AddProductForm} from "@/pages/shop/Manage/AddProduct.tsx";

import {Home} from "@/pages/Home.tsx";
import {Shop} from "@/pages/shop/Product/Shop.tsx";
import {PropertyList} from "@/pages/rent/Rent.tsx";
import AddCategory from "@/pages/admin/Category/Categories.tsx";
import {ShowProduct} from "@/pages/shop/Product/ShowProduct.tsx";
import {AddPropertyForm} from "@/pages/rent/AddProperty.tsx";
import ShowProperty from "@/pages/rent/ShowProperty.tsx";
import AdminLogin from "@/pages/admin/Login/AdminLogin.tsx";
import ProductList from "@/pages/shop/Manage/ProductList.tsx";
import {EditProduct} from "@/pages/shop/Manage/EditProduct.tsx";

function createRouter(): ReturnType<typeof createBrowserRouter> {
    const routes: RouteObject[] = [
        {
            path: '/',
            element: <AuthChangeRedirector><Outlet/></AuthChangeRedirector>,
            children: [
                {
                    path: '/',
                    element: <AuthenticatedRoute><Home/></AuthenticatedRoute>
                },
                {
                    path: '/login',
                    element: <AnonymousRoute><Login/></AnonymousRoute>
                },
                {
                    path: '/account/provider/callback',
                    element: <ProviderCallback />
                },
                {
                    path:'/profile',
                    element: <AuthenticatedRoute><Profile/></AuthenticatedRoute>
                },
                {
                    path: '/sell/add-product',
                    element: <AuthenticatedRoute><AddProductForm /></AuthenticatedRoute>
                },
                {
                    path: '/sell/edit-product/:id',
                    element: <AuthenticatedRoute><EditProduct /></AuthenticatedRoute>
                },
                {
                    path: '/sell',
                    element: <AuthenticatedRoute><ProductList /></AuthenticatedRoute>
                },
                {
                    path: '/shop/:id',
                    element: <AuthenticatedRoute><ShowProduct /></AuthenticatedRoute>
                },
                {
                    path:'/shop/',
                    element:<AuthenticatedRoute><Shop/></AuthenticatedRoute>
                },
                {
                    path:'/rent/',
                    element:<AuthenticatedRoute><PropertyList/></AuthenticatedRoute>
                },
                {
                    path:'/rent/:id',
                    element:<AuthenticatedRoute><ShowProperty/></AuthenticatedRoute>
                },

                {
                    path:'/rent/add-property',
                    element:<AuthenticatedRoute><AddPropertyForm/></AuthenticatedRoute>
                },
                {
                    path:"/admin/login",
                    element:<AnonymousRoute><AdminLogin/></AnonymousRoute>
                },
                {
                    path:"/admin/add-category",
                    element:<AuthenticatedRoute><AddCategory/></AuthenticatedRoute>
                }
            ]
        }
    ]

    return createBrowserRouter(routes)
}

export default function Router(): JSX.Element | null {
    const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null)
    const config = useConfig()

    useEffect(() => {
        setRouter(createRouter())
    }, [config])

    return router ? <RouterProvider router={router} /> : null
}
