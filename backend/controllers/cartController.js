const { Cart, Product } = require('../models');
const jwt = require('jsonwebtoken');

/**
 * 1. 장바구니에 상품 추가 (POST /cart) - 수정된 버전
 */
exports.addToCart = async (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ success: false, message: '접근 권한이 없습니다. 로그인이 필요합니다.' });
        }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ⭐️ 1. 함수 시작 시 로그
    console.log("--- POST /cart 요청 시작 ---");
    console.log("요청 본문 (req.body):", req.body); // 프론트에서 보낸 데이터 확인

    try {
        const { productId, quantity } = req.body;
        const user_uuid = decoded.user_uuid; // 임시 ID 고정

        // ⭐️ 2. 유효성 검사 직전 로그
        console.log(`유효성 검사: productId=${productId}, quantity=${quantity}`);
        // 요청 데이터 유효성 검사
        if (!productId || !quantity || quantity < 1) {
            console.error("오류: productId 또는 quantity가 유효하지 않습니다. (400 응답)");
            return res.status(400).json({ success: false, message: "상품 ID와 수량이 올바르게 전달되어야 합니다." });
        }

        // ⭐️ 3. 상품 정보 조회 직전 로그
        console.log(`Product 모델에서 productId=${productId} 상품 조회 시도...`);
        // DB에서 해당 상품 정보 조회
        const product = await Product.findByPk(productId);
        // ⭐️ 4. 상품 정보 조회 결과 로그
        console.log("Product.findByPk 결과:", product ? product.toJSON() : "상품 없음");

        if (!product) {
            console.error(`오류: ID가 ${productId}인 상품을 DB에서 찾을 수 없습니다. (404 응답)`);
            return res.status(404).json({ success: false, message: "존재하지 않는 상품입니다." });
        }
        
        // ⭐️ 5. 기존 장바구니 항목 확인 직전 로그
        console.log(`장바구니에서 user_uuid=${user_uuid}, product_id=${productId} 항목 확인 시도...`);
        // 장바구니에 이미 있는지 확인
        const existingItem = await Cart.findOne({ where: { user_uuid, product_id: productId } });
        // ⭐️ 6. 기존 장바구니 항목 확인 결과 로그
        console.log("Cart.findOne 결과 (기존 항목):", existingItem ? existingItem.toJSON() : "기존 항목 없음");


        if (existingItem) {
            // ⭐️ 7. 기존 항목 있을 경우 수량 업데이트 로직 진입 로그
            console.log(`기존 장바구니 항목 발견. 수량 업데이트 (현재: ${existingItem.quantity}, 추가: ${quantity})`);
            existingItem.quantity += quantity;
            await existingItem.save();
            // ⭐️ 8. 업데이트 성공 후 응답 전 로그
            console.log(`DB 업데이트 완료: cart_id ${existingItem.cart_id}의 수량이 ${existingItem.quantity}로 변경됨`);
            console.log("200 OK 응답 전송 (수량 업데이트 성공)");
            res.status(200).json({ success: true, message: '장바구니 수량이 업데이트되었습니다.', data: existingItem });
        } else {
            // ⭐️ 9. 기존 항목 없을 경우 새로 생성 로직 진입 로그
            console.log("기존 장바구니 항목 없음. 새 항목 생성 시도...");
            const newItem = await Cart.create({
                user_uuid,
                product_id: productId,
                quantity,
                name: product.name,
                price: product.price,
                small_photo: product.small_photo,
            });
            // ⭐️ 10. 생성 성공 후 응답 전 로그
            console.log(`DB 생성 완료: 새 cart_id ${newItem.cart_id} 생성됨`);
            console.log("201 Created 응답 전송 (새 항목 추가 성공)");
            res.status(201).json({ success: true, message: '장바구니에 상품이 추가되었습니다.', data: newItem });
        }

    } catch (error) {
        // ⭐️ 11. catch 블록 진입 시 로그 (가장 중요!)
        console.error('💥 장바구니 추가 컨트롤러에서 심각한 오류 발생 (catch 블록 진입):', error);
        console.error('오류 메시지:', error.message);
        console.error('오류 이름:', error.name);
        console.error('오류 스택:', error.stack); // 상세 스택 트레이스 확인
        res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' });
    } finally {
        // ⭐️ 12. 함수 종료 시 로그
        console.log("--- POST /cart 요청 종료 ---");
    }
};


/**
 * 2. 내 장바구니 조회 (GET /cart) - 수정된 버전
 */
exports.getCart = async (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ success: false, message: '접근 권한이 없습니다. 로그인이 필요합니다.' });
        }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("--- GET /cart 요청 시작 ---");
    try {
        const user_uuid = decoded.user_uuid;
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
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ success: false, message: '접근 권한이 없습니다. 로그인이 필요합니다.' });
        }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    try {
        const { cartId } = req.params;
        const { quantity } = req.body;
        const user_uuid = decoded.user_uuid; // 테스트를 위한 임시 사용자 ID

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
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ success: false, message: '접근 권한이 없습니다. 로그인이 필요합니다.' });
        }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    try {
        const { cartId } = req.params;
        const user_uuid = decoded.user_uuid; // 테스트를 위한 임시 사용자 ID

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

exports.countCart = async (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ success: false, message: '접근 권한이 없습니다. 로그인이 필요합니다.' });
        }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const numberOfCartItems = await Cart.count({
            where: { user_uuid: decoded.user_uuid}
        });

        res.json({ success: true, count: numberOfCartItems, message: "장바구니 항목 개수를 성공적으로 불러왔습니다." });
    } catch (error) {
        console.error("장바구니 개수 조회 중 서버 오류:", error.message);
        return res.status(500).json({ success: false, message: '서버 오류로 장바구니 개수를 불러올 수 없습니다.' });
    }
}