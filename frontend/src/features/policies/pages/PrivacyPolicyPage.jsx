import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import { PageHeader } from '@/shared';
import TermsOfService from '../components/TermsOfService/TermsOfService'

const PrivacyPolicyPage = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />
            
            <PageHeader title='개인정보처리방침' />
            <TermsOfService size="h-[680px]" filePath="/aggreement/member-privacy.txt" />
            <Footer />
        </>
    );
};

export default PrivacyPolicyPage;