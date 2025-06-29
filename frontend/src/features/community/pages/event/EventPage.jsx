import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import { PageHeader } from '@/shared';

const EventPage = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <PageHeader title = '이벤트' />
            
            <Footer />
        </>
    );
};

export default EventPage;