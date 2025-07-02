// ProductDetailPage.jsx
import React from "react";
import { useSearchParams } from "react-router-dom"; // 🚨 useParams 대신 useSearchParams 임포트
import { Header, Footer, SubHeader} from '@/app';
import DetailPageHeader from "../components/ui/DetailPageHeader/DetailPageHeader";
import ImageGallery from "../components/ui/ImageGallery/ImageGallery";
import ProductInfo from "../components/ui/ProductInfo/ProductInfo";
import ProductDetailTabs from "../components/ui/ProductInfo/ui/ProductDetailTab/ProductDetailTab";

const ProductDetailPage = () => {
    // 🚨 useSearchParams 훅을 사용하여 URL 쿼리 파라미터를 가져옵니다.
    const [searchParams] = useSearchParams();

    // 🚨 'imageUrl'이라는 이름의 쿼리 파라미터 값을 가져옵니다.
    const imageUrl = searchParams.get('imageUrl'); 

    const productName = '남궁전 츄르타워 (하드코딩)';
    const originalProductPrice = 330000;
    const saleProductPrice = 220000;
    const shippingInfo = {
        domesticInternational: '국내배송',
        method: '택배',
        cost: 2500,
        freeShippingCondition: '50,000원 이상 구매 시 무료',
    };
    const productTags = ['하드코딩', '테스트', '고양이'];

    return (
        <>
            <Header />
            <SubHeader />

            <DetailPageHeader title = 'fuckyou'/>
            {/* 🚨 ImageGallery에 쿼리 파라미터로 받은 imageUrl을 그대로 전달합니다. */}
            <div className="flex flex-row">
                <ImageGallery imageUrl={imageUrl} /> 
                <ProductInfo
                    name={productName}
                    originalPrice={originalProductPrice}
                    salePrice={saleProductPrice}
                    shippingDomesticInternational={shippingInfo.domesticInternational}
                    shippingMethod={shippingInfo.method}
                    shippingCost={shippingInfo.cost}
                    shippingFreeCondition={shippingInfo.freeShippingCondition}
                    tags={productTags}
                    />
            </div>

            {/* 🚨 탭 버튼 컴포넌트 추가 */}
            <ProductDetailTabs />

            {/* 🚨 각 콘텐츠 섹션에 ID 부여 */}
            <section id="detail-info" className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-4">상세정보</h2>
                {/* 상세정보 내용 */}
                <p>여기에 상품의 상세 정보가 들어갑니다. 이미지, 설명 등...</p>
                {/* 내용이 길어져야 스크롤이 됩니다. */}
                <div style={{ height: '500px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    상세 정보 내용 (스크롤 테스트용)
                </div>
            </section>

            <section id="purchase-guide" className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-4">구매안내</h2>
                {/* 구매안내 내용 */}
                <p>구매, 교환, 반품, 환불에 대한 안내입니다.</p>
                <div style={{ height: '300px', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    구매 안내 내용 (스크롤 테스트용)
                </div>
            </section>

            <section id="reviews" className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-4">사용후기 (0)</h2>
                {/* 사용후기 내용 */}
                <p>고객들의 사용 후기가 여기에 표시됩니다.</p>
                <div style={{ height: '400px', background: '#d0d0d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    사용 후기 내용 (스크롤 테스트용)
                </div>
            </section>

            <section id="qna" className="p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-4">Q&A (0)</h2>
                {/* Q&A 내용 */}
                <p>자주 묻는 질문과 답변이 여기에 표시됩니다.</p>
                <div style={{ height: '300px', background: '#c0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Q&A 내용 (스크롤 테스트용)
                </div>
            </section>

           
            
            <Footer />
        </>
    );
};

export default ProductDetailPage;