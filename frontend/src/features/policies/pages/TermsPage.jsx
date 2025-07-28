import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import {  PageHeader } from '@/shared';
import TermsOfService from '../components/TermsOfService/TermsOfService';

const TermsPage = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />

            <PageHeader title='이용약관' />
            <TermsOfService size="h-[680px]" filePath="/aggreement/aggreement.txt" />
            <Footer />
        </>
    );
};

export default TermsPage;