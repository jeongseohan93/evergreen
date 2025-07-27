import { useState } from 'react';
import { Header, Footer, SubHeader} from '@/app';
import BannerSlider from '../components/Banner/Banner';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import HomeHeader from '../components/ui/HomeHeader';
import CardBundle from '../components/CardBundle/CardBundle';

import ProductDetailTabs from '../components/ui/CategoryTabs';
import ProductDisplayBox from '../components/ui/ProductDisplayBox';


const Home = () => {
    const [activeCategory, setActiveCategory] = useState('evergreen-recommend');
    
    const handleTabChange = (categoryId) => {
        setActiveCategory(categoryId);
        console.log(`카테고리 변경: ${categoryId}`);
        // 실제 앱에서는 여기에서 선택된 카테고리에 맞는 상품 데이터를 불러오는 로직을 추가할 수 있습니다.
        // 예: fetchProducts(categoryId);
    };

    return (
        <>
            <Header />
            <div className="flex justify-center py-4">
            </div>
            <SubHeader />
            <MenuBar />
            <BannerSlider />
            
            <div className="mt-8"> 
                <HomeHeader title = 'BEST SELLER' title2 = '가장 인기있는 상품들을 소개합니다' />
                <ProductDetailTabs 
                    onTabChange={handleTabChange}
                    />
                <ProductDisplayBox activeCategory={activeCategory} />
            </div>

            <div className="mt-8">
                <HomeHeader title = 'NEW ARRIVAL' title2 = '신상품을 소개합니다' />
                <CardBundle pickValue="new-products" />
            </div>

            <div className="mt-8">
                <HomeHeader title = 'RE ARRIVAL' title2 = '재입고 상품을 소개합니다' />
                <CardBundle pickValue="restocked-products" />
            </div>

            <div className="mt-8 mb-16"> {/* 마지막 섹션 아래에는 Footer와의 공간을 위해 mb-16 (64px) 추가 */}
                <HomeHeader title = 'SPECIAL PRODUCTS' title2 = '추천 상품을 소개합니다' />
                <CardBundle pickValue="general-recommend" />
            </div>

            <Footer />
        </>
    );
};

export default Home;