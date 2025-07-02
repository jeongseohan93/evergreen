import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import BannerSlider from '../components/Banner/Banner';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import CardBundle from '../components/CardBundle/CardBundle';
import HomeHeader from '../components/ui/HomeHeader';
import ReviewBundle from '../components/Review/ReviewBundle';
const Home = () => {
    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />
            <BannerSlider />
            <HomeHeader title = '인기상품' />
            <div>
                <CardBundle />
            </div>

            <HomeHeader title = '신상품' />
            <div>
                <CardBundle />
            </div>

            <HomeHeader title = '재입고상품' />
            <div>
                <CardBundle />
            </div>

            <HomeHeader title = '추천상품' />
            <div>
                <CardBundle />
            </div>
            
            <HomeHeader title = '리뷰' />
            <ReviewBundle />

            <Footer />
        </>
    );
};

export default Home;