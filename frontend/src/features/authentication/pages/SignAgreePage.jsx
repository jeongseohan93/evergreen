import { useState } from 'react';
import { Header, SubHeader, Footer } from '@/app';
import SignAgree from '@/features/authentication/components/signupagree/Signupagree';



const SignAgreePage = () => {

    return (
        <>
            <Header />
            <SubHeader />
            
            <SignAgree />

            <Footer />
        </>
    );
}

export default SignAgreePage;