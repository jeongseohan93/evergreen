// userController.js (백엔드)
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ShippingAddress } = require('../models');
const { Wishlist } = require('../models');
const { Product } = require('../models')
const { Op } = require('sequelize');

exports.userinfor = async (req, res) => {
    const token = req.cookies.access_token;
    
    try {
        if (!token) {
            // 💡 200 대신 401 Unauthorized 반환 (일관성 유지를 위해)
            return res.status(401).json({ success: false, message: '접근 권한이 없습니다. 로그인이 필요합니다.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            where: { user_uuid: decoded.user_uuid },
            attributes: ['user_uuid', 'email', 'name', 'phone', 'zipCode', 'addressMain', 'addressDetail', 'role'] // 비밀번호 제외
        });

        if (!user) {
            // 💡 200 대신 404 Not Found 반환 (사용자를 찾을 수 없을 때)
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        return res.status(200).json({
            success: true, // 성공 여부 필드 추가
            user: user.toJSON()
        });
    } catch (err) {
        console.error("JWT 검증 실패:", err.message);
        // 💡 200 대신 401 Unauthorized 반환
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다. 다시 로그인해주세요.' });
        }
        // 그 외 서버 오류
        return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

exports.updateMyInfo = async (req, res) => {
    // 이 부분은 이미 잘 되어 있습니다.
    const token = req.cookies.access_token;

    try {
        if (!token) {
            return res.status(401).json({ success: false, message: '토큰이 없습니다. 로그인이 필요합니다.' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { user_uuid } = decoded; 
        const { name, phone, zipCode, addressMain, addressDetail } = req.body;

        if (!user_uuid) {
            return res.status(401).json({ success: false, message: '토큰에 사용자 ID 정보가 없습니다.' });
        }

        const user = await User.findByPk(user_uuid);
        if (!user) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        user.name = name;
        user.phone = phone;
        user.zipCode = zipCode;
        user.addressMain = addressMain;
        user.addressDetail = addressDetail;
        await user.save();

        res.status(200).json({ success: true, message: '회원 정보가 성공적으로 수정되었습니다.' });

    } catch (error) {
        console.error('내 정보 수정 오류:', error.message);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다. 다시 로그인해주세요.' });
        }
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

exports.shipingform = async (req, res) => {
    const token = req.cookies.access_token;

    try {
        // 1. 토큰 유무 확인
        if (!token) {
            return res.status(401).json({ success: false, message: '인증되지 않았습니다. 로그인이 필요합니다.' });
        }
        
        // 2. 토큰 검증 및 사용자 UUID 추출
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_uuid = decoded.user_uuid; 

        // 3. 토큰에서 추출한 user_uuid로 실제 User가 존재하는지 확인 (요청하신 사용자 조회 부분)
        // 이 과정은 인증된 사용자가 유효한 사용자인지 한 번 더 확인하는 보안 로직입니다.
        const user = await User.findOne({
            where: { user_uuid: user_uuid }
        });

        if (!user) {
             // 🚨 사용자를 찾을 수 없을 때의 메시지 수정 (기존: '접근권한이 없습니다.')
            return res.status(404).json({ success: false, message: '해당 사용자를 찾을 수 없습니다.' });
        }

        // 4. 요청 본문에서 배송지 데이터 추출 (camelCase)
        const {
            addressName,
            recipientName,
            recipientPhone,
            zipCode,
            addressMain,
            addressDetail,
            isDefault
        } = req.body;

        console.log(addressName);
        // 5. 필수 필드 유효성 검사
        if (!addressName || !recipientName || !recipientPhone || !zipCode || !addressMain) {
            return res.status(400).json({ success: false, message: '배송지명, 수령인, 연락처, 우편번호, 주소를 모두 입력해주세요.' });
        }

        // 6. 기본 배송지 설정 로직 처리
        // 만약 새로운 배송지가 '기본 배송지'로 설정되면, 이 사용자의 기존 모든 기본 배송지를 '기본 아님'으로 업데이트
        if (isDefault) {
            await ShippingAddress.update(
                { is_default: false }, // 모든 is_default를 false로 업데이트
                { where: { user_uuid: user_uuid, is_default: true } } // 해당 user_uuid의 기본 배송지만
            );
        }

        // 7. 프론트엔드 데이터를 백엔드 모델의 컬럼명(snake_case)으로 매핑하여 새로운 배송지 데이터 준비
        const newAddressData = {
            user_uuid: user_uuid, // 토큰에서 추출한 user_uuid 사용
            address_name: addressName,
            recipient_name: recipientName,
            recipient_phone: recipientPhone,
            zip_code: zipCode,
            address_main: addressMain,
            address_detail: addressDetail,
            is_default: isDefault,
        };

        // 8. 새로운 배송지 정보 생성 및 데이터베이스에 저장
        const newAddress = await ShippingAddress.create(newAddressData);

        // 9. 성공 응답 반환
        res.status(201).json({ // 201 Created 상태 코드 사용 (자원 생성 성공 시 관례)
            success: true,
            message: '배송지가 성공적으로 추가되었습니다.',
            address: newAddress // 생성된 배송지 정보 클라이언트에 반환 (선택 사항)
        });

    } catch (error) {
        // 10. 오류 처리
        console.error('배송지 추가 처리 오류:', error.message);

        // JWT 관련 오류 (토큰 만료, 위조 등) 처리
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다. 다시 로그인해주세요.' });
        }
        
        // 그 외 서버 내부 오류 (DB 오류 등) 처리
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};



exports.getshipping = async(req, res) => {
    const token = req.cookies.access_token;
    try {
        // 1. 토큰 유무 확인
        if (!token) {
            return res.status(401).json({ success: false, message: '인증되지 않았습니다. 로그인이 필요합니다.' });
        }
        
        // 2. 토큰 검증 및 사용자 UUID 추출
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_uuid = decoded.user_uuid; 

        // 3. 토큰에서 추출한 user_uuid로 실제 User가 존재하는지 확인 (요청하신 사용자 조회 부분)
        // 이 과정은 인증된 사용자가 유효한 사용자인지 한 번 더 확인하는 보안 로직입니다.
        const user = await User.findOne({
            where: { user_uuid: user_uuid }
        });

        if (!user) {
             // 🚨 사용자를 찾을 수 없을 때의 메시지 수정 (기존: '접근권한이 없습니다.')
            return res.status(404).json({ success: false, message: '해당 사용자를 찾을 수 없습니다.' });
        }

        const addresses = await ShippingAddress.findAll({
            where: {
                user_uuid: user_uuid // ⭐️ 여기에 user_uuid를 조건으로 넣어줍니다.
            },
            // 정렬 순서 (선택 사항): 기본 배송지가 먼저 오고, 그 다음 최신순으로 정렬
            order: [
                ['is_default', 'DESC'], // is_default가 true(1)인 것이 먼저 오게 (내림차순)
                ['created_at', 'DESC']  // 그 다음 created_at 기준으로 최신 것이 먼저 오게 (내림차순)
            ]
        });

        res.status(200).json({ success: true, addresses });

        } catch (error) {
        // 10. 오류 처리
        console.error('배송지 추가 처리 오류:', error.message);

        // JWT 관련 오류 (토큰 만료, 위조 등) 처리
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다. 다시 로그인해주세요.' });
        }
        
        // 그 외 서버 내부 오류 (DB 오류 등) 처리
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
}

exports.updateShippingAddress = async (req, res) => {
    const token = req.cookies.access_token;
    const { addressId } = req.params; // URL 파라미터에서 수정할 배송지의 ID 가져오기

    // 프론트엔드에서 받은 formData (camelCase)
    const {
        addressName,
        recipientName,
        recipientPhone,
        zipCode,
        addressMain,
        addressDetail,
        isDefault
    } = req.body;

    // ⭐️ 필수 필드 유효성 검사를 try...catch 블록 진입 전에 수행하여 불필요한 DB/인증 호출 방지
    if (!addressName || !recipientName || !recipientPhone || !zipCode || !addressMain) {
        return res.status(400).json({ success: false, message: '배송지명, 수령인, 연락처, 우편번호, 주소를 모두 입력해주세요.' });
    }

    let user_uuid; // ⭐️ user_uuid 변수를 try 블록 바깥에 선언하여 전체 함수에서 접근 가능하게 함

    try {
        // 1. 토큰 유무 확인
        if (!token) {
            return res.status(401).json({ success: false, message: '인증되지 않았습니다. 로그인이 필요합니다.' });
        }
        
        // 2. 토큰 검증 및 사용자 UUID 추출
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user_uuid = decoded.user_uuid; // ⭐️ 선언된 user_uuid 변수에 할당

        // 3. 토큰에서 추출한 user_uuid로 실제 User가 존재하는지 확인
        const user = await User.findOne({
            where: { user_uuid: user_uuid }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: '해당 사용자를 찾을 수 없습니다.' });
        }

        // 4. 수정하려는 배송지를 찾고, 해당 배송지가 현재 인증된 유저의 것인지 확인
        const address = await ShippingAddress.findOne({
            where: {
                address_id: addressId,
                user_uuid: user_uuid // 현재 사용자의 배송지인지 확인
            }
        });

        if (!address) {
            // 해당 ID의 배송지가 없거나, 다른 유저의 배송지인 경우
            return res.status(404).json({ success: false, message: '해당 배송지를 찾을 수 없거나 수정 권한이 없습니다.' });
        }

        // 5. 기본 배송지 설정 로직 처리 (수정 시)
        // 만약 이 배송지를 '기본 배송지'로 설정한다면 (isDefault: true),
        // 이 사용자의 기존 다른 모든 기본 배송지(`is_default: true`)를 '기본 아님'(`is_default: false`)으로 해제합니다.
        if (isDefault) {
            await ShippingAddress.update(
                { is_default: false }, // 업데이트할 내용: is_default를 false로
                {
                    where: {
                        user_uuid: user_uuid,       // 현재 유저의 배송지 중
                        is_default: true,           // 기본 배송지로 설정된 것
                        address_id: { [Op.ne]: addressId } // 단, 현재 수정하고 있는 배송지는 제외
                    }
                }
            );
        }

        // 6. 업데이트할 데이터 객체 (camelCase -> snake_case로 매핑)
        const updateData = {
            address_name: addressName,
            recipient_name: recipientName,
            recipient_phone: recipientPhone,
            zip_code: zipCode,
            address_main: addressMain,
            address_detail: addressDetail,
            is_default: isDefault,
        };

        // 7. 배송지 정보 업데이트
        await address.update(updateData);

        res.status(200).json({
            success: true,
            message: '배송지 정보가 성공적으로 수정되었습니다.',
            updatedAddress: address // 업데이트된 배송지 정보 반환 (선택 사항)
        });

    } catch (error) {
        // 8. 오류 처리 (JWT 오류, DB 오류 등 모든 오류를 여기서 처리)
        console.error('배송지 수정 처리 오류:', error.message);

        // JWT 관련 오류 (토큰 만료, 위조 등) 처리
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다. 다시 로그인해주세요.' });
        }
        
        // 그 외 서버 내부 오류
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};


exports.deleteShippingAddress = async (req, res) => {
    const token = req.cookies.access_token;
    const { addressId } = req.params; // URL 파라미터에서 삭제할 배송지의 ID 가져오기

    let user_uuid; // user_uuid 변수를 try 블록 바깥에 선언

    try {
        // 1. 토큰 유무 확인
        if (!token) {
            return res.status(401).json({ success: false, message: '인증되지 않았습니다. 로그인이 필요합니다.' });
        }
        
        // 2. 토큰 검증 및 사용자 UUID 추출
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user_uuid = decoded.user_uuid; 

        // 3. 토큰에서 추출한 user_uuid로 실제 User가 존재하는지 확인
        const user = await User.findOne({
            where: { user_uuid: user_uuid }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: '해당 사용자를 찾을 수 없습니다.' });
        }

        // 4. 삭제하려는 배송지를 찾고, 해당 배송지가 현재 인증된 유저의 것인지 확인
        const addressToDelete = await ShippingAddress.findOne({
            where: {
                address_id: addressId,
                user_uuid: user_uuid // 이 배송지가 요청하는 유저의 것인지 확인
            }
        });

        if (!addressToDelete) {
            // 해당 ID의 배송지가 없거나, 다른 유저의 배송지인 경우
            return res.status(404).json({ success: false, message: '해당 배송지를 찾을 수 없거나 삭제 권한이 없습니다.' });
        }

        // 5. 배송지 삭제 (데이터베이스에서 레코드 제거)
        await addressToDelete.destroy();

        // 6. 성공 응답 반환
        res.status(200).json({ success: true, message: '배송지가 성공적으로 삭제되었습니다.' });

    } catch (error) {
        console.error('배송지 삭제 처리 오류:', error.message);

        // JWT 관련 오류 (토큰 만료, 위조 등) 처리
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다. 다시 로그인해주세요.' });
        }
        
        // 그 외 서버 내부 오류
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

exports.addWishlistItem = async (req, res) => {
    const token = req.cookies.access_token;
    const { product_id } = req.body; // 프론트엔드에서 받은 product_id

    let user_uuid; // user_uuid 변수를 try 블록 바깥에 선언

    try {
        // 1. 토큰 유무 확인
        if (!token) {
            return res.status(401).json({ success: false, message: '인증되지 않았습니다. 로그인이 필요합니다.' });
        }
        
        // 2. 토큰 검증 및 사용자 UUID 추출
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user_uuid = decoded.user_uuid; 

        // 3. 토큰에서 추출한 user_uuid로 실제 User가 존재하는지 확인
        const user = await User.findOne({
            where: { user_uuid: user_uuid }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: '해당 사용자를 찾을 수 없습니다.' });
        }

        // 4. product_id 유효성 검사
        if (!product_id) {
            return res.status(400).json({ success: false, message: 'product_id는 필수입니다.' });
        }

        // 5. 이미 관심 상품에 담겨있는지 확인
        const existingItem = await Wishlist.findOne({
            where: { user_uuid, product_id }
        });

        if (existingItem) {
            // 이미 존재한다면 200 OK와 함께 메시지 반환 (새로 추가할 필요 없음)
            return res.status(200).json({ success: true, message: '이미 관심 상품에 있는 상품입니다.' });
        }

        // 6. 상품 정보 조회 (Product 테이블에서 name, price, small_photo 복사)
        // 🚨 중요: Product 모델의 실제 필드명에 맞게 'product_name', 'price', 'product_thumbnail'을 수정해야 합니다.
        // 예를 들어, 상품명이 'name'이면 product.name, 썸네일이 'thumbnail_url'이면 product.thumbnail_url
        const product = await Product.findByPk(product_id, {
            attributes: ['name', 'price', 'small_photo'] // ⭐️ 실제 Product 모델 필드명으로 변경 필수!
        });

        if (!product) {
            return res.status(404).json({ success: false, message: '해당 상품을 찾을 수 없습니다.' });
        }

        // 7. 관심 상품에 추가 (Wishlist 모델의 필드명에 맞게 데이터 매핑)
        const newItem = await Wishlist.create({
            user_uuid: user_uuid,
            product_id: product_id,
            name: product.name,        // ⭐️ Product 모델의 실제 상품명 필드명으로 변경
            price: product.price,
            small_photo: product.small_photo // ⭐️ Product 모델의 실제 썸네일 필드명으로 변경
        });

        res.status(201).json({ success: true, message: '관심 상품에 추가되었습니다.', item: newItem });

    } catch (error) {
        console.error('관심 상품 추가 오류:', error.message);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다. 다시 로그인해주세요.' });
        }
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

exports.getWishlistItems = async (req, res) => {
    const token = req.cookies.access_token;
    let user_uuid;

    try {
        // 1. 인증 로직 (다른 함수들과 동일)
        if (!token) {
            return res.status(401).json({ success: false, message: '인증되지 않았습니다. 로그인이 필요합니다.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user_uuid = decoded.user_uuid; 
        const user = await User.findOne({ where: { user_uuid: user_uuid } });
        if (!user) {
            return res.status(404).json({ success: false, message: '해당 사용자를 찾을 수 없습니다.' });
        }

        // 2. 관심 상품 목록 조회
        const wishlistItems = await Wishlist.findAll({
            where: { user_uuid: user_uuid },
            order: [['createdAt', 'DESC']] // 최신순으로 정렬
        });

        res.status(200).json({ success: true, items: wishlistItems });

    } catch (error) {
        console.error('관심 상품 목록 조회 오류:', error.message);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다. 다시 로그인해주세요.' });
        }
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

/**
 * @desc 관심 상품 삭제
 * @route DELETE /users/wishlists/:wishlistId
 * @access Private (로그인 필요)
 */
exports.deleteWishlistItem = async (req, res) => {
    const token = req.cookies.access_token;
    const { wishlistId } = req.params; // URL 파라미터에서 삭제할 wishlist_id 가져오기

    let user_uuid;

    try {
        // 1. 인증 로직 (다른 함수들과 동일)
        if (!token) {
            return res.status(401).json({ success: false, message: '인증되지 않았습니다. 로그인이 필요합니다.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user_uuid = decoded.user_uuid; 
        const user = await User.findOne({ where: { user_uuid: user_uuid } });
        if (!user) {
            return res.status(404).json({ success: false, message: '해당 사용자를 찾을 수 없습니다.' });
        }

        // 2. 삭제하려는 관심 상품 항목을 찾고, 해당 항목이 현재 유저의 것인지 확인
        const itemToDelete = await Wishlist.findOne({
            where: {
                wishlist_id: wishlistId,
                user_uuid: user_uuid // 이 항목이 요청하는 유저의 것인지 확인
            }
        });

        if (!itemToDelete) {
            return res.status(404).json({ success: false, message: '관심 상품을 찾을 수 없거나 삭제 권한이 없습니다.' });
        }

        // 3. 관심 상품 삭제
        await itemToDelete.destroy();

        res.status(200).json({ success: true, message: '관심 상품이 성공적으로 삭제되었습니다.' });

    } catch (error) {
        console.error('관심 상품 삭제 오류:', error.message);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: '유효하지 않거나 만료된 토큰입니다. 다시 로그인해주세요.' });
        }
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};