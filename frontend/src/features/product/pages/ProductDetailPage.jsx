import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProductByIdApi, addWishList } from '../api/ProductApi';
import { addToCartApi } from '../../cart/api/cartApi';
import { format } from 'date-fns';
import ProductReview from '../components/ProductReview/ProductReview';
import { Header, Footer, SubHeader } from '@/app';
import DetailPageHeader from '../components/ui/DetailPageHeader/DetailPageHeader';
import ImageGallery from '../components/ui/ImageGallery/ImageGallery';
import ProductInfo from '../components/ui/ProductInfo/ProductInfo';
import ProductDetailTabs from '../components/ui/ProductInfo/ui/ProductDetailTab/ProductDetailTab';


const ProductDetailPage = () => {
    const { productId } = useParams();
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

    const handleAddToCart = async () => {
        if (!productId) return;
        try {
            const result = await addToCartApi(productId, quantity);

            console.log('API 응답:', result);

            if (result.success) {
                alert('장바구니에 상품을 담았습니다.');
                navigate('/cart');
            } else {
                alert(`장바구니 추가 실패: ${result.message || '알 수 없는 오류'}`);
            }
        } catch (err) {
            console.error('API 호출 중 오류 발생:', err);
            alert('장바구니 추가에 실패했습니다. 서버 또는 네트워크를 확인해주세요.');
        }
    };

    const handlePurchase = () => {
        console.log('주문하기 클릭!', { productId, quantity });
        navigate('/order', {
            state: {
                items: [
                    {
                        productId: product.product_id,
                        name: product.name,
                        price: product.price,
                        quantity: quantity,
                    }
                ]
            }
        });
    };

    const handleWishlist = async () => {
        try {
            const response = await addWishList(productId);
            if (response.success) {
                alert(response.message || '관심 상품에 성공적으로 추가되었습니다!');
            } else {
                alert(`관심 상품 추가 실패: ${response.message || '알 수 없는 오류'}`);
            }
        } catch (error) {
            console.error("관심 상품 추가 오류:", error.response?.data || error.message);
            alert('관심 상품 추가 중 오류가 발생했습니다.');
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다.');
                // navigate('/login'); // 로그인 페이지로 리다이렉트
            }
        }
    }

    if (loading) return <div className="text-center py-8">로딩 중...</div>;
    if (error) return <div className="text-center py-8 text-red-500">오류: {error}</div>;
    if (!product) return <div className="text-center py-8">상품 정보가 없습니다.</div>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <SubHeader />
            <div className="flex-grow container mx-auto px-4 py-8">
                <DetailPageHeader title={product.name} />
                
                {/* 이미지와 버튼들을 감싸는 div의 높이 조절 */}
                {/* max-h-[800px] 또는 max-h-[700px] 등으로 조절하여 전체 컨테이너 높이 제한 */}
                <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 rounded-lg shadow-md max-h-[700px] overflow-hidden"> 
                    {/* 이미지 영역을 lg:w-3/5 (60%)로 유지 */}
                    <div className="w-full lg:w-2/5 h-full"> {/* h-full 추가하여 부모 max-h에 맞춤 */}
                        {/* small_photo 대신 large_photo로 변경 */}
                        <ImageGallery imageUrl={product.small_photo} />
                    </div>
                    {/* 상품 정보 영역을 lg:w-2/5 (40%)로 유지 */}
                    <div className="w-full lg:w-3/5 h-full overflow-y-auto"> {/* h-full과 overflow-y-auto 추가 */}
                        <ProductInfo
                            name={product.name}
                            originalPrice={product.price}
                            salePrice={product.sale_price || product.price}
                            // shippingCost={2500} // ProductInfo에서 제거했으므로 여기도 제거
                            quantity={quantity}
                            setQuantity={setQuantity}
                            onAddToCart={handleAddToCart}
                            onPurchase={handlePurchase}
                            onAddWishList={handleWishlist} 
                            brand={product.brand} 
                            sub2_category_name={product.sub2_category_name} 
                            model_name={product.model_name} 
                            deposit={product.deposit} 
                        />
                    </div>
                </div>
                
                <ProductDetailTabs />
                <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <div id="detail-info" className="py-4">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">상품 상세 정보</h2>
                        {/* 기존 텍스트 설명을 제거하고 large_photo 이미지를 표시 */}
                        {product.large_photo && (
                            <div className="flex justify-center items-center p-4 ">
                                <img 
                                    src={product.large_photo} 
                                    alt={`${product.name} 상세 이미지`} 
                                    className="max-w-full h-auto object-contain rounded-md shadow-sm"
                                    // 이미지 크기 조절을 위해 max-h-screen 또는 특정 높이 제한 추가 가능
                                    // 예: max-h-[800px]
                                />
                            </div>
                        )}

                        {product.youtube_url && (
                        <div className="flex justify-center items-center p-4 mt-4"> {/* mt-4로 위 이미지와의 간격 추가 */}
                            <iframe 
                                width="560" 
                                height="315" 
                                src={product.youtube_url}
                                title={`${product.name} 유튜브 영상`} 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                referrerpolicy="strict-origin-when-cross-origin" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        )}
                        {!product.large_photo && (
                            <p className="text-gray-600">등록된 상세 이미지가 없습니다.</p>
                        )}
                    </div>
                    <div id="purchase-guide" className="py-4 mt-6 border-t pt-6">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">구매 안내</h2>
                        <ul className="list-disc list-inside text-gray-700">
                            <li>배송 안내: 주문 확인 후 2-3일 이내 출고됩니다. (주말, 공휴일 제외)</li>
                            <li>교환/반품 안내: 상품 수령 후 7일 이내 신청 가능합니다. (고객센터 문의)</li>
                            <li>A/S 안내: 구매일로부터 1년간 무상 A/S를 제공합니다.</li>
                        </ul>
                    </div>
                    <div id="reviews" className="py-4 mt-6 border-t pt-6">
                        <ProductReview productId={productId} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetailPage;