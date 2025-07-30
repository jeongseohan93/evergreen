import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/shared';
import { getProductsByPickApi } from '../../api/HomeProduct';

const CardBundle = ({ pickValue }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            // pickValue가 없으면 API 호출을 건너뛰고 상품 목록을 비웁니다.
            if (!pickValue) {
                setLoading(false);
                setProducts([]); 
                return;
            }

            setLoading(true);
            setError(null); // 새로운 데이터 로딩 시작 전에 에러 상태를 초기화합니다.

            try {
            const result = await getProductsByPickApi(pickValue);


            if (result.success) {
                const fetchedProducts = Array.isArray(result.data) ? result.data.map(product => ({
                    ...product,
                    memo: product.memo || '', // 이 로직이 제대로 작동하는지 확인
                    small_photo: product.small_photo || '/images/default_product.png'
                })) : [];

               
                console.log(`[CardBundle Debug 1] Processed fetchedProducts (after memo handling):`, fetchedProducts);
                setProducts(fetchedProducts);
                } else {
                    // API 호출은 성공했으나, 서버 응답이 success: false인 경우
                    throw new Error(result.message || `${pickValue} 상품 데이터를 불러오지 못했습니다.`);
                }
            } catch (err) {
                // 네트워크 오류 또는 예상치 못한 예외가 발생한 경우
                console.error(`상품 데이터 로딩 중 오류 발생 (${pickValue}):`, err); // 개발자용 상세 에러 로그
                setError(`상품 데이터를 불러오는 데 실패했습니다: ${err.message}`); // 사용자에게 보여줄 메시지
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [pickValue]); // pickValue 값이 변경될 때마다 이 Effect가 다시 실행됩니다.

    if (loading) {
        return <div className="p-4 text-center">상품을 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">오류: {error}</div>;
    }

    // 로딩도 아니고 에러도 없는데 상품이 하나도 없을 경우 메시지를 표시합니다.
    if (products.length === 0) {
        return <div className="p-4 text-center">등록된 상품이 없습니다.</div>;
    }

    return (
        <div className="p-4 flex flex-wrap justify-center gap-10">
            {products.map(product => (
                <ProductCard 
                    key={product.product_id}
                    productId={product.product_id}
                    imageUrl={product.small_photo} // 이미 위에서 기본값 처리됨
                    name={product.name}
                    price={product.price}
                    hashtags={product.memo} // 이제 memo는 항상 문자열(빈 문자열 포함)일 것입니다.
                    likes={0} // 'likes' 필드가 백엔드 데이터에 없다면 여기에 기본값을 유지합니다.
                />
            ))}
        </div>
    );
};

export default CardBundle;