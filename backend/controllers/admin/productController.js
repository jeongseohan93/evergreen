// models에서 product 클래스 호출
const Product = require('../../models/product');
const Category = require('../../models/category');
// Sequelize에서 제공하는 연산자
const {Op} = require('sequelize');


//------------------------------상품 현황------------------------------------------------
// product는 user 로그인시에도 재사용 가능성있음.
// 모든 상품 조회
exports.productAll = async (req, res) => {
    // URL 쿼리에서 categoryId를 가져옵니다.
    const categoryId = req.query.categoryId; 

    try {
        let products;
        
        // categoryId가 존재하면 해당 카테고리로 필터링
        if (categoryId) {
            // categoryId가 숫자인지 확인 (선택 사항, 프론트에서 항상 숫자로 보낸다면 생략 가능)
            const parsedCategoryId = parseInt(categoryId, 10);
            if (isNaN(parsedCategoryId)) {
                return res.status(400).json({
                    success: false,
                    message: '유효하지 않은 카테고리 ID입니다.'
                });
            }

            // 특정 category_id에 해당하는 상품만 조회
            products = await Product.findAll({
                where: {
                    category_id: parsedCategoryId // 파싱된 categoryId 사용
                }
            });
        } else {
            // categoryId가 없으면 모든 상품 조회
            products = await Product.findAll();
        }
            
        // 성공적인 처리라는 의미(200)를 클라이언트에게 알리는 역할
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('상품 조회 오류', error);
        res.status(500).json({
            success: false,
            message: '상품을 불러오는 도중 오류가 발생했습니다.'
        });
    }
};

// 상품 검색
exports.productSearch = async (req,res) =>{
// 프론트로부터 키워드 가져옴
const keyword = req.query.keyword;
// 키워드 미입력시
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
};
//------------------------------상품 현황------------------------------------------------


//---------------------------------상품 수정---------------------------------------------
exports.productMod = async (req, res) => {
  
    const productId = parseInt(req.params.productId);
    const { name, price, category_id, memo, stock, small_photo, large_photo, brand, pick } = req.body; 

    if (isNaN(productId)) {
        return res.status(400).json({ success: false, message: '유효하지 않은 상품 ID입니다.' });
    }

    if (!name || !price || !category_id) {
        return res.status(400).json({
            success: false,
            message: '상품명, 가격, 카테고리는 필수 입력 항목입니다.'
        });
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json({
            success: false,
            message: '가격은 0보다 큰 숫자여야 합니다.'
        });
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
        return res.status(400).json({
            success: false,
            message: '재고는 0 이상의 숫자여야 합니다.'
        });
    }

    if (brand !== undefined && (typeof brand !== 'string' || (brand && brand.length > 100))) {
        return res.status(400).json({
            success: false,
            message: '브랜드명은 100자 이내의 문자열이어야 합니다.'
        });
    }

    const validPickValues = ['best', 'recommend', 'nothing'];
    const finalPick = validPickValues.includes(pick) ? pick : 'nothing';

    try {
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: '해당 상품을 찾을 수 없습니다.'
            });
        }

        const [updatedRowsCount] = await Product.update(
            {
                name,
                price: parseInt(price),
                category_id: parseInt(category_id),
                memo: memo || null,
                stock: stock ? parseInt(stock) : 0,
                small_photo: small_photo || null,
                large_photo: large_photo || null,
                brand: brand || null,
                pick: finalPick
            },
            {
                where: { product_id: productId }
            }
        );

        if (updatedRowsCount === 0) {
            const updatedProduct = await Product.findByPk(productId);
            return res.status(200).json({
                success: true,
                message: '상품 정보가 변경되지 않았습니다 (기존과 동일).',
                data: updatedProduct
            });
        }

        const updatedProduct = await Product.findByPk(productId);

        res.status(200).json({
            success: true,
            message: '상품이 성공적으로 수정되었습니다.',
            data: updatedProduct
        });

    } catch (error) {
        console.error('상품 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '상품 수정 중 오류가 발생했습니다.'
        });
    }
};
//---------------------------------상품 수정---------------------------------------------


///////////
///////////
////////
//////////리팩토링할때 이거 날리자.
//------------------------------재고 변경------------------------------------------------

exports.productStock = async (req,res) => {


    const { product_id , stock } = req.body;
    if(product_id === undefined || stock === undefined){
        return res.status(400).json({
            success : false,
            message : 'product와 stock 값이 모두 들어오지 않았습니다.'
        });
    }


    try {
        const product = await Product.findByPk(product_id);
        if(!product){
            return res.status(404).json({

                success : false,
                message : '해당 상품을 찾을 수 없습니다.'
            });
        }
        product.stock = stock;
        await product.save();
        res.status(200).json({
            success : true,
            message : '재고가 정상적으로 수정되었습니다.',
            data : {
                product_id : product.product_id,
                stock : product.stock
            }
        });
    } catch (error) {
        console.error('재고수정 오류', error);
        res.status(500).json({
            success : false,
            message : '재고 수정 중 오류가 발생했습니다.'
        });
    }
};
//------------------------------재고 변경------------------------------------------------

//------------------------------상품 추가------------------------------------------------
exports.productAdd = async (req, res) => {
    const { name, price, category_id, memo, stock, small_photo, large_photo, brand } = req.body;
    
    if (!name || !price || !category_id) {
        return res.status(400).json({
            success: false,
            message: '상품명, 가격, 카테고리는 필수 입력 항목입니다.'
        });
    }
    
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({
            success: false,
            message: '가격은 0보다 큰 숫자여야 합니다.'
        });
    }
    
    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
        return res.status(400).json({
            success: false,
            message: '재고는 0 이상의 숫자여야 합니다.'
        });
    }

    if (brand !== undefined && typeof brand !== 'string' || (brand && brand.length > 100)) {
        return res.status(400).json({
            success: false,
            message: '브랜드명은 100자 이내의 문자열이어야 합니다.'
        });
    }
    
    try {
        const newProduct = await Product.create({
            name,
            price: parseInt(price),
            category_id: parseInt(category_id),
            memo: memo || null,
            stock: stock ? parseInt(stock) : 0,
            small_photo: small_photo || null,
            large_photo: large_photo || null,
            brand: brand || null
        });
        
        res.status(201).json({
            success: true,
            message: '상품이 성공적으로 추가되었습니다.',
            data: newProduct
        });
    } catch (error) {
        console.error('상품 추가 오류:', error);
        res.status(500).json({
            success: false,
            message: '상품 추가 중 오류가 발생했습니다.'
        });
    };
};
//------------------------------상품 추가------------------------------------------------

//------------------------------카테고리 조회------------------------------------------------
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['category_id', 'ASC']]
        });
        
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('카테고리 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '카테고리를 불러오는 도중 오류가 발생했습니다.'
        });
    }
};
//------------------------------카테고리 조회------------------------------------------------

//------------------------------카테고리 추가------------------------------------------------
exports.addCategory = async (req, res) => {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: '카테고리명은 필수 입력 항목입니다.'
        });
    }
    
    try {
        const existingCategory = await Category.findOne({
            where: { name: name.trim() }
        });
        
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: '이미 존재하는 카테고리명입니다.'
            });
        }
        
        const newCategory = await Category.create({
            name: name.trim()
        });
        
        res.status(201).json({
            success: true,
            message: '카테고리가 성공적으로 추가되었습니다.',
            data: newCategory
        });
    } catch (error) {
        console.error('카테고리 추가 오류:', error);
        res.status(500).json({
            success: false,
            message: '카테고리 추가 중 오류가 발생했습니다.'
        });
    }
};
//------------------------------카테고리 추가------------------------------------------------

//------------------------------카테고리 삭제------------------------------------------------
exports.deleteCategory = async (req, res) => {
    const { category_id } = req.params;
    
    if (!category_id || isNaN(category_id)) {
        return res.status(400).json({
            success: false,
            message: '유효한 카테고리 ID가 필요합니다.'
        });
    }
    
    try {
        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: '해당 카테고리를 찾을 수 없습니다.'
            });
        }
        
        const productsInCategory = await Product.count({
            where: { category_id: parseInt(category_id) }
        });
        
        if (productsInCategory > 0) {
            return res.status(400).json({
                success: false,
                message: `이 카테고리에 속한 상품이 ${productsInCategory}개 있습니다. 먼저 상품을 삭제하거나 다른 카테고리로 이동시켜주세요.`
            });
        }
        
        await category.destroy();
        
        res.status(200).json({
            success: true,
            message: '카테고리가 성공적으로 삭제되었습니다.'
        });
    } catch (error) {
        console.error('카테고리 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '카테고리 삭제 중 오류가 발생했습니다.'
        });
    }
};
//------------------------------카테고리 삭제------------------------------------------------


//------------------------------카테고리 수정 (새로 추가)------------------------------------------------
exports.updateCategory = async (req, res) => {
    const { category_id } = req.params;
    const { name } = req.body;

    if (!category_id || isNaN(category_id)) {
        return res.status(400).json({
            success: false,
            message: '유효한 카테고리 ID가 필요합니다.'
        });
    }
    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: '새 카테고리명은 필수 입력 항목입니다.'
        });
    }

    try {
        const [updatedRowsCount] = await Category.update(
            { name: name.trim() },
            { where: { category_id: parseInt(category_id) } }
        );

        if (updatedRowsCount === 0) {
            const existingCategory = await Category.findByPk(category_id);
            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: '해당 카테고리를 찾을 수 없습니다.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: '카테고리 이름이 변경되지 않았습니다 (기존과 동일).',
                    data: existingCategory
                });
            }
        }
        
        const updatedCategory = await Category.findByPk(category_id);

        res.status(200).json({
            success: true,
            message: '카테고리 이름이 성공적으로 수정되었습니다.',
            data: updatedCategory
        });

    } catch (error) {
        console.error('카테고리 수정 오류:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: '이미 존재하는 카테고리명입니다.'
            });
        }
        res.status(500).json({
            success: false,
            message: '카테고리 수정 중 오류가 발생했습니다.'
        });
    }
};
//------------------------------카테고리 수정------------------------------------------------