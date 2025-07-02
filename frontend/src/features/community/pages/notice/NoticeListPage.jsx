import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import { PageHeader } from '@/shared';
import BoardPage from '@/shared/components/board/BoardPage';
const NoticeListPage = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <PageHeader title = '공지사항' />
            <BoardPage />
            
            <Footer />
        </>
    );
};

export default NoticeListPage;