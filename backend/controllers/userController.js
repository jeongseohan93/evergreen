// userController.js (백엔드)
const jwt = require('jsonwebtoken');
const { User } = require('../models');

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
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } // 비밀번호 제외
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
        const { name, phone, address } = req.body;

        if (!user_uuid) {
            return res.status(401).json({ success: false, message: '토큰에 사용자 ID 정보가 없습니다.' });
        }

        const user = await User.findByPk(user_uuid);
        if (!user) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        user.name = name;
        user.phone = phone;
        user.address = address;
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