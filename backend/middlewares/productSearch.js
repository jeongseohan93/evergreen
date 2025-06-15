const Product = require('../models/product');
const { Op } = require('sequelize');

exports.productSearch = async (req, res, next) => {
    const keyword = req.query.keyword;
    
    if(!keyword){
        return res.status(400).json({
            success : false,
            message : '검색 키워드를 입력하세요'
        });
    }
    try {
        const result = await Product.findAll({
            where : {
                name : {
                    [Op.like] : `%${keyword}%`
                }
            }
        });
        res.status(200).json({
            success : true,
            data : result,
        });
    }catch (error){
        console.error('상품 검색 오류' , error);
        res.status(500).json({
            success : false,
            message : '상품 검색 중 오류 발생'
        });
    }
    next();
}
