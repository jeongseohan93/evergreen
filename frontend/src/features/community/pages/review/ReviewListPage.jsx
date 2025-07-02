import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import { PageHeader } from '@/shared';
import BoardPage from '@/shared/components/board/BoardPage';

const ReviewListPage = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <PageHeader title = '리뷰' />
            <BoardPage />
            
            <Footer />
        </>
    );
};

export default ReviewListPage;