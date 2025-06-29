import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import BannerSlider from '../components/Banner/Banner';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import CardBundle from '../components/CardBundle/CardBundle';
const Home = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />
            <BannerSlider />
            <div>
                <CardBundle />
            </div>
            
            <Footer />
        </>
    );
};

export default Home;