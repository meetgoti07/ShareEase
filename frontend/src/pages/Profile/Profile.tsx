"use client";


import {ProfileForm} from "@/pages/Profile/ProfileForm.tsx";
import Layout from "@/layout/Layout.tsx";


export function Profile() {

    return (
        <Layout>
            <div className='w-1/2'>
                <ProfileForm/>
            </div>
        </Layout>
    );
}
