// src/components/BestProductList.jsx

import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/shared';
import { getBestProductsApi } from '../../api/HomeProduct';

const CardBundle = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBestProducts = async () => {
            try {
                const result = await getBestProductsApi(); // Best 상품 API 호출
                
                if (result.success) {
                    setProducts(result.data);
                } else {
                    throw new Error(result.message || '데이터 로딩 실패');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBestProducts();
    }, []);

    if (loading) {
        return <div className="p-4 text-center">베스트 상품을 불러오는 중...</div>;
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
                <div className="p-4 text-center">등록된 베스트 상품이 없습니다.</div>
            )}
        </div>
    );
};

export default CardBundle;