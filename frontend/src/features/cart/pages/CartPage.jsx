import React, { useState, useEffect } from 'react';
import { getCartApi, updateCartItemApi, removeCartItemApi } from '../api/cartApi';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCartItems = async () => {
        try {
            const result = await getCartApi();
            if (result.data.success) {
                setCartItems(result.data.data);
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
            // 상태 업데이트: 해당 아이템의 수량만 변경
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
            // 상태 업데이트: 해당 아이템을 목록에서 제거
            setCartItems(items => items.filter(item => item.cart_id !== cartId));
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">장바구니</h1>
            {cartItems.length === 0 ? (
                <p>장바구니가 비어있습니다.</p>
            ) : (
                cartItems.map(item => (
                    <div key={item.cart_id} className="flex items-center justify-between border-b py-4">
                        <div className="flex items-center">
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
                ))
            )}
        </div>
    );
};

export default CartPage;