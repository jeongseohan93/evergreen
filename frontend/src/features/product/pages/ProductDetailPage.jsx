// 추천하는 최종 ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
// ✅ useNavigate 훅을 추가로 import 합니다.
import { useParams, useNavigate } from 'react-router-dom';
import { getProductByIdApi  } from '../api/ProductApi';
import {addToCartApi} from '../../cart/api/cartApi'
import { Header, Footer, SubHeader } from '@/app';
import DetailPageHeader from "../components/ui/DetailPageHeader/DetailPageHeader";
import ImageGallery from "../components/ui/ImageGallery/ImageGallery";
import ProductInfo from "../components/ui/ProductInfo/ProductInfo";
import ProductDetailTabs from "../components/ui/ProductInfo/ui/ProductDetailTab/ProductDetailTab";

const ProductDetailPage = () => {
    const { productId } = useParams();
    // ✅ navigate 함수를 사용할 수 있도록 선언합니다.
    const navigate = useNavigate(); 
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            try {
                const result = await getProductByIdApi(productId);
                if (result.success) {
                    setProduct(result.data);
                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    // ✅ 장바구니 추가 및 페이지 이동 핸들러
    const handleAddToCart = async () => {
    if (!productId) return;
    try {
        const result = await addToCartApi(productId, quantity);
        
        console.log('API 응답:', result); // 이 로그를 보면 result.data 안에 success가 있습니다.

        // ✅ result.success가 아닌 result.data.success로 확인해야 합니다.
        if (result.data.success) { 
            alert('장바구니에 상품을 담았습니다.');
            navigate('/cart');
        } else {
            // ✅ 실패 메시지도 result.data.message에서 가져와야 합니다.
            alert(`장바구니 추가 실패: ${result.data.message || '알 수 없는 오류'}`);
        }
    } catch (err) {
        console.error('API 호출 중 오류 발생:', err);
        alert('장바구니 추가에 실패했습니다. 서버 또는 네트워크를 확인해주세요.');
    }
};
    
    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>오류: {error}</div>;
    if (!product) return <div>상품 정보가 없습니다.</div>;

    const handlePurchase = () => {
        console.log('주문하기 클릭!', { productId, quantity });
        // 실제로는 주문에 필요한 정보를 가지고 주문 페이지로 이동합니다.
        // navigate의 state 옵션을 사용하면 데이터를 안전하게 전달할 수 있습니다.
        navigate('/order', { 
            state: { 
                items: [
                    { 
                        productId: product.product_id,
                        name: product.name,
                        price: product.price,
                        quantity: quantity,
                        small_photo: product.small_photo
                    }
                ] 
            } 
        });
    };

    return (
        <>
            <Header />
            <SubHeader />
            <DetailPageHeader title={product.name} />
            <div className="flex flex-row">
                <ImageGallery imageUrl={product.large_photo} />
                <ProductInfo
                    name={product.name}
                    originalPrice={product.price}
                    salePrice={product.sale_price || product.price}
                    shippingCost={2500}
                    tags={product.memo ? product.memo.split(' ') : []}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    onAddToCart={handleAddToCart}
                    onPurchase={handlePurchase}
                />
            </div>
            <ProductDetailTabs />
            <Footer />
        </>
    );
};

export default ProductDetailPage;