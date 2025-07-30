import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import { PageHeader } from '@/shared';
import GuidelinePage from '../components/ui/GuildLine';


const HelpPage = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />
            <PageHeader title='이용안내' />
            <GuidelinePage />
            
            <Footer />
        </>
    );
};

export default HelpPage;