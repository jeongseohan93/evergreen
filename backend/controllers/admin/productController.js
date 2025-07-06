// 상품 현황, 재고 변경
// 상품 추가, 상품 수정, 상품 삭제
// 일일 매출, 월간 매출, 연간 매출



// models에서 product 클래스 호출
const Product = require('../../models/product');
const Category = require('../../models/category');
// Sequelize에서 제공하는 연산자
const {Op} = require('sequelize');


//------------------------------상품 현황------------------------------------------------
// product는 user 로그인시에도 재사용 가능성있음.
// 모든 상품 조회
exports.productAll = async (req, res) => {

    try{
               // product 전체 조회
            const products = await Product.findAll();
            
                // 성공적인 처리라는 의미(200)를 클라이언트에게 알리는 역할
            res.status(200).json({
                // success를 명시하여 프론트에서 if(success)식으로 사용가능함.
                // 프론트의 일관성 유지를 위해 필요

                                // 프론트에서의 예시
                                /* const res = await fetch('/api/products');
                                const result = await res.json();

                            if (result.success) {
                             renderProductList(result.data);
                                } else {
                                     showError(result.message);
                                        } */
                success : true,
                data : products
            });
    } catch (error) {
            console.error('상품 조회 오류' , error);
            res.status(500).json({
                success : false,
                message : '상품을 불러오는 도중 오류가 발생했습니다.'
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
                                // 검색결과가 다수일 수도 있기 때문에 findAll 사용함
    const result = await Product.findAll({
        where : {
            name : {
                    // Sequelize에서 제공하는 Op 연산자를 사용함.
                    // Op.like는 부분일치하는 경우
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





//------------------------------재고 변경------------------------------------------------

exports.productStock = async (req,res) => {


    const { product_id , stock } = req.body;
    // product와 stock의 data가 모두 들어오지 않았을 경우 차후 로직에서 문제가 생길 수 있어서 이 로직이 필요함.
    if(product_id === undefined || stock === undefined){
        return res.status(400).json({
            success : false,
            message : 'product와 stock 값이 모두 들어오지 않았습니다.'
        });
    }


    try {
        // 해당 상품이 존재하는지 찾기
                                    // findByPk는 테이블에서 product_id가 req.body.product_id랑 일치하는 '한 행'을 찾아준다.
                                    // PK로 단일 조회할때에는 findOne보다 더 간결하고 직관적임
                                    // Sequelize가 모델 정의시 primaryKey를 알고 있을때 사용 가능한 특수 메서드.
        const product = await Product.findByPk(product_id);
        if(!product){
            return res.status(404).json({

                success : false,
                message : '해당 상품을 찾을 수 없습니다.'
            });
        }
        // 재고 값 업데이트
        product.stock = stock;
        await product.save();
        res.status(200).json({
            // success와 message의 경우 응답의 "상태 정보"에 해당되기 때문에 단일 값으로 충분하며, 
            // data는 실제 비즈니스 데이터를 담기위한 공간이라 보통 객체나 배열로 더 복잡한 정보를 담음.
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
    const { name, price, category_id, memo, stock, small_photo, large_photo } = req.body;
    
    // 필수 필드 검증
    if (!name || !price || !category_id) {
        return res.status(400).json({
            success: false,
            message: '상품명, 가격, 카테고리는 필수 입력 항목입니다.'
        });
    }
    
    // 가격이 숫자인지 확인
    if (isNaN(price) || price <= 0) {
        return res.status(400).json({
            success: false,
            message: '가격은 0보다 큰 숫자여야 합니다.'
        });
    }
    
    // 재고가 숫자인지 확인 (재고가 제공된 경우)
    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
        return res.status(400).json({
            success: false,
            message: '재고는 0 이상의 숫자여야 합니다.'
        });
    }
    
    try {
        // 새 상품 생성
        const newProduct = await Product.create({
            name,
            price: parseInt(price),
            category_id: parseInt(category_id),
            memo: memo || null,
            stock: stock ? parseInt(stock) : 0,
            small_photo: small_photo || null,
            large_photo: large_photo || null
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
    }
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
    
    // 필수 필드 검증
    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: '카테고리명은 필수 입력 항목입니다.'
        });
    }
    
    try {
        // 중복 카테고리명 확인
        const existingCategory = await Category.findOne({
            where: { name: name.trim() }
        });
        
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: '이미 존재하는 카테고리명입니다.'
            });
        }
        
        // 새 카테고리 생성
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
        // 카테고리 존재 확인
        const category = await Category.findByPk(category_id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: '해당 카테고리를 찾을 수 없습니다.'
            });
        }
        
        // 해당 카테고리에 속한 상품이 있는지 확인
        const productsInCategory = await Product.count({
            where: { category_id: parseInt(category_id) }
        });
        
        if (productsInCategory > 0) {
            return res.status(400).json({
                success: false,
                message: `이 카테고리에 속한 상품이 ${productsInCategory}개 있습니다. 먼저 상품을 삭제하거나 다른 카테고리로 이동시켜주세요.`
            });
        }
        
        // 카테고리 삭제
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
    const { category_id } = req.params; // URL 파라미터에서 category_id 가져오기
    const { name } = req.body;          // 요청 본문에서 새로운 이름 가져오기

    // 필수 필드 검증
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
        // 카테고리 존재 확인 및 업데이트
        // Category.update는 [영향을 받은 행의 수, 업데이트된 인스턴스 배열]을 반환합니다.
        const [updatedRowsCount] = await Category.update(
            { name: name.trim() }, // 업데이트할 필드와 값
            { where: { category_id: parseInt(category_id) } } // 업데이트할 조건
        );

        if (updatedRowsCount === 0) {
            // 업데이트된 행이 없으면 해당 카테고리를 찾을 수 없거나 변경 사항이 없는 경우
            const existingCategory = await Category.findByPk(category_id);
            if (!existingCategory) {
                return res.status(404).json({
                    success: false,
                    message: '해당 카테고리를 찾을 수 없습니다.'
                });
            } else {
                // 카테고리는 찾았지만, 이름이 같아서 업데이트된 행이 없는 경우
                return res.status(200).json({
                    success: true,
                    message: '카테고리 이름이 변경되지 않았습니다 (기존과 동일).',
                    data: existingCategory // 변경되지 않았지만 현재 카테고리 정보 반환
                });
            }
        }
        
        // 업데이트 성공 후, 업데이트된 카테고리 정보를 다시 조회하여 반환 (선택 사항)
        const updatedCategory = await Category.findByPk(category_id);

        res.status(200).json({
            success: true,
            message: '카테고리 이름이 성공적으로 수정되었습니다.',
            data: updatedCategory
        });

    } catch (error) {
        console.error('카테고리 수정 오류:', error);
        // 중복 이름 에러 등 특정 에러 처리 추가 가능
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
