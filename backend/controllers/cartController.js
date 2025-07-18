const { Cart, Product } = require('../models');

/**
 * 1. 장바구니에 상품 추가 (POST /cart) - 수정된 버전
 */
exports.addToCart = async (req, res) => {
    console.log("--- POST /cart 요청 시작 ---");
    console.log("요청 본문 (req.body):", req.body); // 프론트에서 보낸 데이터 확인

    try {
        const { productId, quantity } = req.body;
        const user_uuid = 'temp-user-uuid'; // 임시 ID 고정

        // 요청 데이터 유효성 검사
        if (!productId || !quantity || quantity < 1) {
            console.error("오류: productId 또는 quantity가 유효하지 않습니다.");
            return res.status(400).json({ success: false, message: "상품 ID와 수량이 올바르게 전달되어야 합니다." });
        }

        // DB에서 해당 상품 정보 조회
        const product = await Product.findByPk(productId);
        if (!product) {
            console.error(`오류: ID가 ${productId}인 상품을 DB에서 찾을 수 없습니다.`);
            return res.status(404).json({ success: false, message: "존재하지 않는 상품입니다." });
        }
        
        // 장바구니에 이미 있는지 확인
        const existingItem = await Cart.findOne({ where: { user_uuid, product_id: productId } });

        if (existingItem) {
            // 있으면 수량만 더하기
            existingItem.quantity += quantity;
            await existingItem.save();
            console.log(`DB 업데이트 완료: cart_id ${existingItem.cart_id}의 수량이 ${existingItem.quantity}로 변경됨`);
            res.status(200).json({ success: true, message: '장바구니 수량이 업데이트되었습니다.', data: existingItem });
        } else {
            // 없으면 새로 만들기
            const newItem = await Cart.create({
                user_uuid,
                product_id: productId,
                quantity,
                name: product.name,
                price: product.price,
                small_photo: product.small_photo,
            });
            console.log(`DB 생성 완료: 새 cart_id ${newItem.cart_id} 생성됨`);
            res.status(201).json({ success: true, message: '장바구니에 상품이 추가되었습니다.', data: newItem });
        }

    } catch (error) {
        console.error('💥 장바구니 추가 컨트롤러에서 심각한 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
    }
};


/**
 * 2. 내 장바구니 조회 (GET /cart) - 수정된 버전
 */
exports.getCart = async (req, res) => {
    console.log("--- GET /cart 요청 시작 ---");
    try {
        const user_uuid = 'temp-user-uuid';
        console.log(`조회할 사용자 UUID: ${user_uuid}`);

        const cartItems = await Cart.findAll({
            where: { user_uuid },
            order: [['createdAt', 'DESC']],
        });
        
        console.log(`조회된 장바구니 아이템 ${cartItems.length}개`);
        res.status(200).json({ success: true, data: cartItems });

    } catch (error) {
        console.error('💥 장바구니 조회 컨트롤러에서 심각한 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
    }
};


/**
 * 3. 장바구니 상품 수량 수정 (PATCH /cart/:cartId)
 */
exports.updateCartItem = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { quantity } = req.body;
        const user_uuid = 'temp-user-uuid'; // 테스트를 위한 임시 사용자 ID

        if (quantity < 1) {
            return res.status(400).json({ success: false, message: '수량은 1 이상이어야 합니다.' });
        }

        const item = await Cart.findByPk(cartId);
        
        if (!item || item.user_uuid !== user_uuid) {
            return res.status(404).json({ success: false, message: '권한이 없거나 해당 상품이 장바구니에 없습니다.' });
        }
        
        item.quantity = quantity;
        await item.save();
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        console.error('장바구니 수정 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

/**
 * 4. 장바구니 상품 삭제 (DELETE /cart/:cartId)
 */
exports.removeCartItem = async (req, res) => {
    try {
        const { cartId } = req.params;
        const user_uuid = 'temp-user-uuid'; // 테스트를 위한 임시 사용자 ID

        const item = await Cart.findByPk(cartId);
        if (!item || item.user_uuid !== user_uuid) {
            return res.status(404).json({ success: false, message: '권한이 없거나 해당 상품이 장바구니에 없습니다.' });
        }

        await item.destroy();
        res.status(200).json({ success: true, message: '상품이 장바구니에서 삭제되었습니다.' });
    } catch (error) {
        console.error('장바구니 삭제 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};