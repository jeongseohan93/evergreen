import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import BannerSlider from '../components/Banner/Banner';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import HomeHeader from '../components/ui/HomeHeader';
import ReviewBundle from '../components/Review/ReviewBundle';
import CardBundle from '../components/CardBundle/CardBundle';
import Logo from '../../../shared/components/layouts/Header/Logo';


const Home = () => {

    return (
        <>
            <Header />
            <div className="flex justify-center py-4">
            <Logo />
            </div>
            <SubHeader />
            <MenuBar />
            <BannerSlider />
            
            <HomeHeader title = '인기상품' />
            <CardBundle />
        
            <HomeHeader title = '리뷰' />
            <ReviewBundle />

            <Footer />
        </>
    );
};

export default Home;