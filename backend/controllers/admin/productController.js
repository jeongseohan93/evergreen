// 상품 현황, 재고 변경
// 상품 추가, 상품 수정, 상품 삭제
// 일일 매출, 월간 매출, 연간 매출



// models에서 product 클래스 호출
const Product = require('../../models/product');
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
