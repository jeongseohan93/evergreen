const { Op } = require('sequelize'); // Op 연산자를 불러옵니다.
const Product = require('../models/product');

exports.groupProduct = async (req, res) => {
    try {
        const { keywords } = req.query;

        // keywords가 없는 경우에 대한 방어 코드
        if (!keywords) {
            return res.status(400).json({ message: '키워드가 필요합니다.' });
        }

        const keywordsArray = keywords.split(',');

        // Sequelize 문법으로 수정된 조회 로직
        const products = await Product.findAll({
            where: {
                // 'pick' 컬럼의 값이 keywordsArray에 포함된 모든 상품을 찾습니다.
                pick: {
                    [Op.in]: keywordsArray
                }
            }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};