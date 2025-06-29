import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import { PageHeader } from '@/shared';
const NoticeListPage = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <PageHeader title = '공지사항' />
            
            <Footer />
        </>
    );
};

export default NoticeListPage;