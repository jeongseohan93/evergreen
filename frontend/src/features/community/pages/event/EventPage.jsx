import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import { PageHeader } from '@/shared';
import BoardPage from '@/shared/components/board/BoardPage';

const EventPage = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <PageHeader title = '이벤트' />
            <BoardPage />
            <Footer />
        </>
    );
};

export default EventPage;