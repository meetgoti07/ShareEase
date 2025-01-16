import { useState, useEffect } from 'react'
import { AuthChangeRedirector, AnonymousRoute, AuthenticatedRoute } from '@/auth'
import {
    createBrowserRouter,
    RouterProvider,
    RouteObject
} from 'react-router-dom'

import { useConfig } from '@/auth'
import Login from "@/pages/Login.tsx";
import ProviderCallback from "@/pages/ProviderCallback.tsx";
import {Home} from "@/pages/Home.tsx";

function createRouter(config: any): ReturnType<typeof createBrowserRouter> {
    const routes: RouteObject[] = [
        {
            path: '/',
            element: <AuthChangeRedirector><Login /></AuthChangeRedirector>,
            children: [
                {
                    path: '/',
                    element: <AnonymousRoute><Login /></AnonymousRoute>
                },
              {
                path: '/dashboard',
                element: <AuthenticatedRoute><Home /></AuthenticatedRoute>
              },
                {
                    path: '/account/provider/callback',
                    element: <ProviderCallback />
                },
            ]
        }
    ]

    return createBrowserRouter(routes)
}

export default function Router(): JSX.Element | null {
    const [router, setRouter] = useState<ReturnType<typeof createBrowserRouter> | null>(null)
    const config = useConfig()

    useEffect(() => {
        setRouter(createRouter(config))
    }, [config])

    return router ? <RouterProvider router={router} /> : null
}
