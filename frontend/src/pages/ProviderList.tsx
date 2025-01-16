import { useConfig } from '@/auth'
import {redirectToProvider} from "@/lib/allAuth.tsx";
import {Button} from "@/components/ui/button.tsx";

interface Provider {
    id: string
    name: string
}

interface ProviderListProps {
    callbackURL: string
    process?: string
}

interface ConfigData {
    socialaccount: {
        providers: Provider[]
    }
}

interface Config {
    data: ConfigData
}

export default function ProviderList(props: ProviderListProps): JSX.Element | null {
    const config = useConfig() as Config
    const providers = config.data.socialaccount.providers

    if (!providers.length) {
        return null
    }

    return (
        <>
            <ul>
                {providers.map((provider: Provider) => {
                    return (
                        <li key={provider.id}>
                            <Button
                                onClick={() => redirectToProvider(provider.id, props.callbackURL, props.process)}
                            >
                                {provider.name}
                            </Button>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}