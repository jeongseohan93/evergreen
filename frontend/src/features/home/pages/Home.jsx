import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import BannerSlider from '../components/Banner/Banner';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import HomeHeader from '../components/ui/HomeHeader';
import CardBundle from '../components/CardBundle/CardBundle';


const Home = () => {

    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />
            <BannerSlider />
            
            <HomeHeader title = '인기상품' />
            <CardBundle />

            <Footer />
        </>
    );
};

export default Home;