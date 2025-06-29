import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import {  PageHeader } from '@/shared';
import TermsOfService from '../components/TermsOfService/TermsOfService';

const TermsPage = () => {
    return (
        <>
            <Header />
            <SubHeader />

            <PageHeader title='이용약관' />
            <TermsOfService size="h-[680px]" filePath="/aggreement/aggreement.txt" />
            <Footer />
        </>
    );
};

export default TermsPage;