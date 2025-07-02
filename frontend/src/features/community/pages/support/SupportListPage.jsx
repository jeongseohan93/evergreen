import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import { PageHeader } from '@/shared';
import BoardPage from '@/shared/components/board/BoardPage';
const SupportListPage = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <PageHeader title = '문의' />
            
            <BoardPage />
            
            <Footer />
        </>
    );
};

export default SupportListPage;