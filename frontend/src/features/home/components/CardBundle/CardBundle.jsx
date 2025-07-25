// src/components/CardBundle.jsx (컴포넌트 이름 변경 권장)

import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/shared';
import { getProductsByPickApi } from '../../api/HomeProduct'; // API 함수 이름 변경 가정

const CardBundle = ({ pickValue }) => { // pickValue prop을 받도록 수정
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!pickValue) { // pickValue가 없으면 API 호출 안 함 (초기 로딩 방지 등)
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null); // 새로운 fetch 시작 전 에러 초기화

            try {
                // pickValue를 인자로 전달하여 API 호출
                const result = await getProductsByPickApi(pickValue); 
                
                if (result.success) {
                    setProducts(result.data);
                } else {
                    // 서버에서 메시지를 제대로 받지 못하거나, 기본 메시지 사용
                    throw new Error(result.message || `${pickValue} 상품 데이터 로딩 실패`);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pickValue]); // pickValue가 변경될 때마다 이 Effect가 다시 실행되도록 추가

    if (loading) {
        return <div className="p-4 text-center">상품을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">오류: {error}</div>;
    }

    return (
        <div className="p-4 flex flex-wrap justify-center gap-10">
            {products.length > 0 ? (
                products.map(product => (
                    <ProductCard 
                        key={product.product_id}
                        productId={product.product_id} 
                        imageUrl={product.small_photo || '/images/default_product.png'}
                        name={product.name}
                        price={product.price}
                    />
                ))
            ) : (
                <div className="p-4 text-center">등록된 상품이 없습니다.</div>
            )}
        </div>
    );
};

export default CardBundle;