import ProviderList from "@/pages/ProviderList.tsx";

export default function Login() {


    return <div>
        <ProviderList callbackURL='/account/provider/callback' />
    </div>
}
