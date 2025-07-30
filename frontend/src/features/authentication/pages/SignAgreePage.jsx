import { useState } from 'react';
import { Header, SubHeader, Footer } from '@/app';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import SignAgree from '@/features/authentication/components/signupagree/Signupagree';



const SignAgreePage = () => {

    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />
            <SignAgree />

            <Footer />
        </>
    );
}

export default SignAgreePage;