import React from 'react';
import { Header, Footer, SubHeader} from '@/app';
import BannerSlider from '../components/Banner/Banner';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import HomeHeader from '../components/ui/HomeHeader';
import ReviewBundle from '../components/Review/ReviewBundle';
import CardBundle from '../components/CardBundle/CardBundle';
import useProduct from '../hooks/useProduct';

const Home = () => {

    const { products, loading, error } = useProduct();
    
    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러가 발생했습니다.</div>;

    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />
            <BannerSlider />
            <HomeHeader title = '인기상품' />
            <CardBundle products={products?.popular} />

            <HomeHeader title = '신상품' />
            

            <HomeHeader title = '재입고상품' />
            

            <HomeHeader title = '추천상품' />
        
            
            <HomeHeader title = '리뷰' />
            <ReviewBundle />

            <Footer />
        </>
    );
};

export default Home;