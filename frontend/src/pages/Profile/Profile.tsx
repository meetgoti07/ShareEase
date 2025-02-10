"use client";


import {ProfileForm} from "@/pages/Profile/ProfileForm.tsx";
import Layout from "@/layout/Layout.tsx";


export function Profile() {

    return (
        <Layout>
            <div>
                <ProfileForm/>
            </div>
        </Layout>
    );
}
