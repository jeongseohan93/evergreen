import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductByIdApi, addWishList } from '../api/ProductApi';
import { addToCartApi } from '../../cart/api/cartApi';
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

    // 섹션별 ref는 이제 필요하지 않지만, 나중에 다른 용도로 활용할 수도 있으니 일단 남겨둡니다.
    // const detailInfoRef = useRef(null);
    // const paymentInfoRef = useRef(null);
    // const deliveryInfoRef = useRef(null);
    // const exchangeInfoRef = useRef(null);
    // const serviceInfoRef = useRef(null);
    // const reviewsRef = useRef(null);
    // const qnaRef = useRef(null);


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
                navigate('/wishlist');
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

    // 페이지 맨 위로 스크롤하는 함수
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

                {/* ProductDetailTabs는 별도로 관리 (스크롤 대상 아님) */}
                <ProductDetailTabs />

                {/* DETAIL, REVIEW, Q&A 섹션이 묶여 있는 하나의 박스 */}
                <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <div id="detail-info" className="py-4">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">DETAIL</h2>
                        {product.large_photo && (
                            <div className="flex justify-center items-center p-4 ">
                                <img
                                    src={product.large_photo}
                                    alt={`${product.name} 상세 이미지`}
                                    className="max-w-full h-auto object-contain rounded-md shadow-sm"
                                />
                            </div>
                        )}
                        {product.youtube_url && (
                        <div className="flex justify-center items-center p-4 mt-4">
                            <iframe
                                width="560"
                                height="315"
                                src={product.youtube_url}
                                title={`${product.name} 유튜브 영상`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen>
                            </iframe>
                        </div>
                        )}
                        {!product.large_photo && (
                            <p className="text-gray-600">등록된 상세 이미지가 없습니다.</p>
                        )}
                    </div>

                    {/* REVIEW 섹션 - 위로가기 버튼 추가 */}
                    <div id="reviews" className="py-4 mt-6 border-t pt-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-2"> {/* 제목과 버튼을 감싸는 div 추가 */}
                            <h2 className="text-xl font-semibold">REVIEW (0)</h2>
                            <button
                                className="text-sm text-gray-600 hover:text-gray-900"
                                onClick={scrollToTop}
                            >
                                위로가기
                            </button>
                        </div>
                        <p className="text-gray-600">아직 등록된 사용후기가 없습니다. 첫 후기를 남겨보세요!</p>
                    </div>

                    {/* Q&A 섹션 - 위로가기 버튼 추가 */}
                    <div id="qna" className="py-4 mt-6 border-t pt-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-2"> {/* 제목과 버튼을 감싸는 div 추가 */}
                            <h2 className="text-xl font-semibold">Q&A (0)</h2>
                            <button
                                className="text-sm text-gray-600 hover:text-gray-900"
                                onClick={scrollToTop}
                            >
                                위로가기
                            </button>
                        </div>
                        <p className="text-gray-600">상품에 대해 궁금한 점이 있으신가요? 문의를 남겨주세요.</p>
                    </div>
                </div>

                {/* GUIDE 섹션 - 별도의 박스로 분리 */}
                <div id="purchase-guide" className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">GUIDE</h2>

                    {/* PAYMENT INFO Section - 카드 형식 대신 경계선만 */}
                    <div className="py-4">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-semibold text-gray-800">PAYMENT INFO</h2>
                            <button
                                className="text-sm text-gray-600 hover:text-gray-900"
                                onClick={scrollToTop}
                            >
                                위로가기
                            </button>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">
                            고객결제의 경우 안전을 위해 카드사에서 확인전화를 드릴 수도 있습니다. 확인과정에서 도난카드의 사용이나 명의 주문등 정상적인 주문이 아니라고 판단될 경우 임의로 주문을 보류 또는 취소할 수 있습니다.
                        </p>
                        <p className="text-sm text-gray-700">
                            무통장 입금은 상품 구매 대금은 PC뱅킹, 인터넷뱅킹, 텔레뱅킹 혹은 가까운 은행에서 직접 입금하시면 됩니다.<br/>
                            주문시 입력한 입금자명과 실제입금자의 성명이 반드시 일치하여야 하며, 7일 이내로 입금을 하셔야 하며 입금되지 않은 주문은 자동취소 됩니다.
                        </p>
                    </div>

                    {/* DELIVERY INFO Section - 카드 형식 대신 경계선만 */}
                    <div className="py-4 mt-6 border-t pt-6"> {/* 상단에 border-t pt-6 추가하여 구분선 */}
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-semibold text-gray-800">DELIVERY INFO</h2>
                            <button
                                className="text-sm text-gray-600 hover:text-gray-900"
                                onClick={scrollToTop}
                            >
                                위로가기
                            </button>
                        </div>
                        <ul className="text-sm text-gray-700 space-y-2">
                            <li><strong>배송 방법:</strong> 택배</li>
                            <li><strong>배송 지역:</strong> 전국지역</li>
                            <li><strong>배송 비용:</strong> 3,000원</li>
                            <li><strong>배송 기간:</strong> 3일 - 7일</li>
                        </ul>
                        <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                            배송 안내: 산간벽지나 도서지방은 별도의 추가금액을 지불하여야 하는 경우가 있습니다.<br/>
                            고객님께서 주문하신 상품은 입금 확인후 배송해 드립니다. 다만, 상품종류에 따라서 상품의 배송이 다소 지연될 수 있습니다.
                        </p>
                    </div>

                    {/* EXCHANGE INFO Section - 카드 형식 대신 경계선만 */}
                    <div className="py-4 mt-6 border-t pt-6"> {/* 상단에 border-t pt-6 추가하여 구분선 */}
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-semibold text-gray-800">EXCHANGE INFO</h2>
                            <button
                                className="text-sm text-gray-600 hover:text-gray-900"
                                onClick={scrollToTop}
                            >
                                위로가기
                            </button>
                        </div>

                        <h3 className="text-base font-semibold text-gray-800 mb-2">교환 및 반품이 가능한 경우</h3>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-6">
                            <li>상품 공급 받으신 날로부터 7일 이내 단, 가전제품의 경우 포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우에는 교환/반품이 불가능합니다.</li>
                            <li>공급받으신 상품 및 용역 내용이 표시 광고 내용과 다르거나 다르게 이행된 경우에는 공급받은 날로부터 3월이내, 그사실을 알게 된 날로부터 30일이내</li>
                        </ul>

                        <h3 className="text-base font-semibold text-gray-800 mb-2">교환 및 반품이 불가능한 경우</h3>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-6">
                            <li>고객님의 책임 있는 사유로 상품등이 멸실 또는 훼손된 경우. 단, 상품의 내용을 확인하기 위하여 포장등을 훼손한 경우는 제외</li>
                            <li>포장을 개봉하였거나 포장이 훼손되어 상품가치가 상실된 경우<br/>(예: 가전제품, 식품, 음반등, 더 액정화면이 부착된 노트북, LCD모니터, 디지털 카메라의 불량화소에 따른 반품/교환은 제조사 기준에 따릅니다.)</li>
                            <li>고객님의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우. 단, 화장품등의 경우 시용제품을 제공한 경우에 한합니다.</li>
                            <li>시간의 경과에 의하여 재판매가 곤란할 정도로 상품등의 가치가 현저히 감소한 경우</li>
                            <li>복제가 가능한 상품등의 포장을 훼손한 경우<br/>(자세한 내용은 고객만족센터 1:1 E-MAIL 상담을 이용해 주시기 바랍니다.)</li>
                        </ul>

                        <p className="text-xs text-gray-600 border-t pt-4 mt-4">
                            ※ 고객님의 마음이 바뀌어 교환, 반품을 하실 경우 상품반송 비용은 고객님께서 부담하셔야 합니다.<br/>
                            (색상 교환, 사이즈 교환 등 포함)
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetailPage;