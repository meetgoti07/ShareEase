import {
    Navigate,
    useLocation,
    Link
} from 'react-router-dom'
import { URLs, pathForPendingFlow, useAuthStatus } from '@/auth'

interface AuthStatus {
    isAuthenticated: boolean
}

interface Auth {
    // Define the shape of your auth object based on what pathForPendingFlow expects
    // This is a placeholder - adjust according to your actual auth object structure
    pendingFlow?: string
    [key: string]: any
}

interface URLs {
    LOGIN_URL: string
    LOGIN_REDIRECT_URL: string
}

export default function ProviderCallback(): JSX.Element {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const error = params.get('error')
    const [auth, status] = useAuthStatus() as [Auth, AuthStatus]

    let url: string = URLs.LOGIN_URL
    if (status.isAuthenticated) {
        url = URLs.LOGIN_REDIRECT_URL
    } else {
        url = pathForPendingFlow(auth) || url
    }

    if (!error) {
        return <Navigate to={url} />
    }

    return (
        <>
            <h1>Third-Party Login Failure</h1>
    <p>Something went wrong.</p>
    <Link to={url}>Continue</Link>
        </>
)
}