import React, { useState, useEffect } from 'react';
// ✅ useNavigate 훅을 추가로 import 합니다.
import { useNavigate } from 'react-router-dom';
import { Header, Footer, SubHeader} from '@/app';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import { getCartApi, updateCartItemApi, removeCartItemApi } from '../api/cartApi';

const CartPage = () => {
    // ✅ navigate 함수를 사용할 수 있도록 선언합니다.
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState(new Set());

    const fetchCartItems = async () => {
        try {
            const result = await getCartApi();
            if (result.data.success) {
                setCartItems(result.data.data);
                setSelectedItems(new Set());
            }
        } catch (error) {
            console.error("장바구니 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleQuantityChange = async (cartId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await updateCartItemApi(cartId, newQuantity);
            setCartItems(items => items.map(item =>
                item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
            ));
        } catch (error) {
            console.error("수량 변경 실패:", error);
        }
    };

    const handleRemoveItem = async (cartId) => {
        try {
            await removeCartItemApi(cartId);
            setCartItems(items => items.filter(item => item.cart_id !== cartId));
            setSelectedItems(prevSelected => {
                const newSet = new Set(prevSelected);
                newSet.delete(cartId);
                return newSet;
            });
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    const handleSelectItem = (cartId, isChecked) => {
        setSelectedItems(prevSelected => {
            const newSet = new Set(prevSelected);
            if (isChecked) {
                newSet.add(cartId);
            } else {
                newSet.delete(cartId);
            }
            return newSet;
        });
    };

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            const allCartIds = new Set(cartItems.map(item => item.cart_id));
            setSelectedItems(allCartIds);
        } else {
            setSelectedItems(new Set());
        }
    };

    const calculateSelectedTotal = () => {
        return cartItems.reduce((total, item) => {
            if (selectedItems.has(item.cart_id)) {
                return total + (item.price * item.quantity);
            }
            return total;
        }, 0);
    };

    // 🚨 선택된 상품들을 가지고 주문 페이지로 이동하는 함수
    const handleOrderSelectedItems = () => {
        if (selectedItems.size === 0) {
            alert("주문할 상품을 선택해주세요.");
            return;
        }

        // 선택된 상품들만 필터링하여 주문 페이지로 전달할 형식으로 변환
        const itemsToOrder = cartItems
            .filter(item => selectedItems.has(item.cart_id))
            .map(item => ({
                productId: item.product_id, // 상품 ID
                cartId: item.cart_id,       // 장바구니 ID (필요시)
                name: item.name,            // 상품 이름
                price: item.price,          // 상품 단가
                quantity: item.quantity,    // 수량
                small_photo: item.small_photo // 이미지 (주문 페이지에서 필요할 경우)
            }));

        // ✅ /order 경로로 이동하면서 state에 선택된 상품 목록을 전달합니다.
        navigate('/order', {
            state: {
                items: itemsToOrder,
                totalAmount: calculateSelectedTotal() // 총 가격도 함께 전달할 수 있습니다.
            }
        });
    };

    if (loading) return <div>로딩 중...</div>;

    const allItemsSelected = cartItems.length > 0 && selectedItems.size === cartItems.length;

    return (
        <>
        <Header />
        <SubHeader />
        <MenuBar />
         <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">장바구니</h1>

            {cartItems.length === 0 ? (
                <p>장바구니가 비어있습니다.</p>
            ) : (
                <>
                    {/* 전체 선택/해제 체크박스 */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={allItemsSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <span className="font-bold">전체 선택 ({selectedItems.size}/{cartItems.length})</span>
                    </div>

                    {cartItems.map(item => (
                        <div key={item.cart_id} className="flex items-center justify-between border-b py-4">
                            <div className="flex items-center">
                                {/* 개별 상품 선택 체크박스 */}
                                <input
                                    type="checkbox"
                                    className="mr-4"
                                    checked={selectedItems.has(item.cart_id)}
                                    onChange={(e) => handleSelectItem(item.cart_id, e.target.checked)}
                                />
                                <img src={item.small_photo} alt={item.name} className="w-20 h-20 object-cover mr-4"/>
                                <div>
                                    <p className="font-bold">{item.name}</p>
                                    <p>{item.price.toLocaleString()}원</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.cart_id, parseInt(e.target.value))}
                                    className="w-16 text-center border mx-4"
                                />
                                <button onClick={() => handleRemoveItem(item.cart_id)} className="text-red-500">삭제</button>
                            </div>
                        </div>
                    ))}

                    {/* 선택된 상품 총 가격 표시 */}
                    <div className="text-right text-xl font-bold mt-6">
                        선택된 상품 총 가격: {calculateSelectedTotal().toLocaleString()}원
                    </div>

                    {/* 🚨 선택된 상품 주문 버튼 */}
                    <div className="text-right mt-4">
                        <button
                            // ✅ 클릭 시 handleOrderSelectedItems 함수 호출
                            onClick={handleOrderSelectedItems}
                            disabled={selectedItems.size === 0}
                            className={`bg-blue-500 text-white px-6 py-3 rounded-lg text-lg ${selectedItems.size === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                        >
                            선택 상품 주문하기
                        </button>
                    </div>
                </>
            )}
        </div>
        <Footer />
        </>

    );
};

export default CartPage;