// controllers/productController.js

const { Product } = require('../models');

/**
 * 'pick' 컬럼이 'best'인 상품만 조회하는 함수
 * @description 가장 최근에 수정한 상품이 먼저 오도록 정렬합니다.
 */
exports.getBestProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                pick: 'best' // 'best' 상품만 필터링
            },
            order: [['updated_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        console.error('베스트 상품 조회 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류로 베스트 상품을 조회할 수 없습니다.'
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        // 라우터의 :productId 값을 req.params 객체에서 가져옵니다.
        const { productId } = req.params;

        // findByPk: Primary Key(기본 키)로 단 하나의 데이터를 찾는 Sequelize 메서드입니다.
        const product = await Product.findByPk(productId);

        // 상품이 존재하지 않는 경우 404 에러를 반환합니다.
        if (!product) {
            return res.status(404).json({
                success: false,
                message: '해당 상품을 찾을 수 없습니다.'
            });
        }

        // 상품을 찾으면 성공 응답과 함께 상품 데이터를 반환합니다.
        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error('상품 상세 조회 중 오류:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류로 상품을 조회할 수 없습니다.'
        });
    }
};