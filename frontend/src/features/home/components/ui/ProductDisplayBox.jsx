// src/components/ui/ProductDisplayBox.jsx

import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/shared';
import { getProductsByPickApi } from '../../api/HomeProduct';

const ProductDisplayBox = ({ activeCategory }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!activeCategory) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const result = await getProductsByPickApi(activeCategory);
                
                if (result.success) {
                    setProducts(result.data);
                } else {
                    throw new Error(result.message || '상품 데이터 로딩 실패');
                }
            } catch (err) {
                setError(err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategory]);

    if (loading) {
        return (
            <div className="
                max-w-[1330px] mx-auto
                bg-white
                p-6 sm:p-8 lg:p-10
                mt-8 mb-12
                min-h-[400px]
                flex flex-col items-center justify-center text-gray-500 text-lg
            ">
                <p>상품을 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="
                max-w-[1330px] mx-auto
                bg-white 
                p-6 sm:p-8 lg:p-10
                mt-8 mb-12
                min-h-[400px]
                flex flex-col items-center justify-center text-red-500 text-lg
            ">
                <p>오류 발생: {error}</p>
                <p>상품 데이터를 불러오지 못했습니다.</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="
                max-w-[1330px] mx-auto
                bg-white 
                p-6 sm:p-8 lg:p-10
                mt-8 mb-12
                min-h-[400px]
                flex flex-col items-center justify-center text-gray-500 text-lg
            ">
                <p className="mb-4 font-bold text-gray-700">
                    "{activeCategory}" 카테고리에 등록된 상품이 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="
            max-w-[1330px] mx-auto
            bg-white 
            p-6 sm:p-8 lg:p-10
            mt-8 mb-12
            min-h-[400px]
            flex flex-wrap justify-start 
            gap-x-10 gap-y-8 
            px-4 
        ">
            {products.map(product => (
                <ProductCard
                    key={product.product_id}
                    productId={product.product_id}
                    imageUrl={product.small_photo || '/images/default_product.png'}
                    name={product.name}
                    price={product.price}
                    hashtags={product.memo}
                    // 너비 클래스 조정: 한 줄에 4개를 명확히 목표
                    // 기본 (모바일): 1개
                    // sm: 2개
                    // md: 3개
                    // lg: 4개 (1024px 이상)
                    // xl: 4개 (1280px 이상)
                    // ProductCard 내부의 패딩이나 마진에 따라 calc 값이 미세하게 달라질 수 있습니다.
                    className="
                        w-full sm:w-[calc(50%-20px)] md:w-[calc(33.333%-27px)] 
                        lg:w-[calc(25%-30px)] xl:w-[calc(25%-30px)] 
                        flex-shrink-0
                    "
                    // w-[calc(25%-30px)]는 4개 카드와 3개 gap-x-10 (40px)를 고려한 계산.
                    // 30px = (3 * 40px) / 4 = 120px / 4
                    // 또는 각 카드에 (전체 너비 / 4) - (3 * gap / 4)를 대입
                    // 예를 들어, 총 1330px에서 3개의 40px 간격(120px)을 빼면 1210px 남음
                    // 1210px / 4 = 302.5px. 따라서 각 카드는 302.5px의 너비를 가져야 함.
                    // w-[302.5px]와 같은 고정 픽셀 값도 고려할 수 있지만 Tailwind calc가 더 유연합니다.
                />
            ))}
        </div>
    );
};

export default ProductDisplayBox;