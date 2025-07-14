// models에서 product 클래스 호출
const Product = require('../../models/product');
const Category = require('../../models/category');
// Sequelize에서 제공하는 연산자
const {Op} = require('sequelize');


// --- 이미지 추가를 위해 새로 추가되는 부분 시작 ---------------------------------------------
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // fs 모듈 추가

// 이미지 저장 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // ⭐ 여기가 중요! 서버의 실제 파일 시스템 경로를 지정해야 해.
        // 보통 서버 파일이 있는 위치를 기준으로 '../uploads'나 './uploads' (현재 디렉토리 기준)
        // 아니면 path.join(process.cwd(), 'uploads')를 사용해서 프로젝트 루트에 명시적으로 지정
        // 지금은 'uploads/'로 되어 있는데, 서버가 실행되는 위치 기준으로 'uploads' 폴더가 없으면 에러남.
        // 서버가 실행되는 파일의 위치를 기준으로 path.join(__dirname, 'uploads') 또는
        // path.join(__dirname, '..', 'uploads') (만약 이 파일이 routes 폴더 안에 있다면)
        // 으로 바꾸는 걸 추천.
        // 또는 가장 확실한 방법: process.cwd()는 터미널에서 node 명령을 실행한 디렉토리.
        const uploadDir = path.join(process.cwd(), 'uploads');
        console.log('파일 저장 시도 경로 (백엔드):', uploadDir); // ⭐ 이 로그를 추가해봐! ⭐

        // 혹시 'uploads' 폴더가 없다면 자동으로 생성하는 로직 (선택 사항)
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // recursive: true는 상위 폴더도 함께 생성
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // ⭐ 이 부분이 핵심! 파일 이름 생성 로직 수정 ⭐
        const originalname = file.originalname;
        const extension = path.extname(originalname); // .png, .jpg 등 확장자
        const basename = path.basename(originalname, extension); // 확장자를 제외한 파일 이름

        // 파일명 중복을 피하기 위해 타임스탬프와 랜덤 문자열을 조합
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        // 최종 파일 이름: 원본 이름_타임스탬프.확장자 또는 타임스탬프.확장자
        const newFileName = `${basename}-${uniqueSuffix}${extension}`;
        // 또는 간단히: const newFileName = `${Date.now()}-${uniqueSuffix}${extension}`; // 이렇게 해도 됨

        console.log('생성될 파일 이름 (백엔드):', newFileName); // ⭐ 이 로그도 추가해봐! ⭐
        cb(null, newFileName);
    }
});

// 파일 필터 설정 (선택 사항): 이미지 파일만 허용
const fileFilter = (req, file, cb) => {
    // 파일의 MIME 타입이 'image/'로 시작하는지 확인
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // 허용
    } else {
        // 이미지 파일이 아니면 에러 반환
        cb(new Error('이미지 파일만 업로드할 수 있습니다.'), false);
    }
};

// multer 업로드 미들웨어 생성
// storage 설정과 fileFilter를 적용
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // 파일 크기 제한 (선택 사항): 5MB로 제한
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

// 상품 이미지 업로드 API
// 'productImage'는 프론트엔드에서 FormData에 추가할 필드 이름과 동일해야 해.
exports.uploadProductImage = (req, res) => {
    // upload.single('productImage') 미들웨어를 실행
    upload.single('productImage')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Multer 에러 발생 시 (예: 파일 크기 초과, 잘못된 필드 이름 등)
            return res.status(400).json({
                success: false,
                message: `파일 업로드 오류: ${err.message}`
            });
        } else if (err) {
            // 그 외 알 수 없는 에러 발생 시
            return res.status(500).json({
                success: false,
                message: `서버 오류: ${err.message}`
            });
        }

        // 파일이 업로드되지 않았을 경우
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '이미지 파일을 선택해주세요.'
            });
        }

        // 파일 업로드 성공 시
        // 클라이언트에서 접근할 수 있는 이미지 URL을 생성
        // 예: /uploads/1678888888888-image.jpg
        const imageUrl = `/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: '이미지 업로드 성공!',
            imageUrl: imageUrl, // 업로드된 이미지의 URL 반환
            fileName: req.file.filename // 파일명도 함께 반환 (필요시)
        });
    });
};
// --- 새로 추가되는 부분 끝 ------------------------------------------------------------------

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
            [Op.or]: [ // OR 연산자를 사용하여 여러 필드 검색
                { name: { [Op.like]: `%${keyword}%` } },
                { brand: { [Op.like]: `%${keyword}%` } }, // 브랜드 검색 추가
                { origin: { [Op.like]: `%${keyword}%` } }, // 원산지 검색 추가
                { model_name: { [Op.like]: `%${keyword}%` } } // 모델명 검색 추가
            ]
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
    // origin, model_name 필드 추가
    const { name, price, category_id, memo, stock, small_photo, large_photo, brand, pick, origin, model_name } = req.body; 

    if (isNaN(productId)) {
        return res.status(400).json({ success: false, message: '유효하지 않은 상품 ID입니다.' });
    }

    // 필수 입력 항목에 brand, origin 추가
    if (!name || !price || !category_id || !brand || !origin) {
        return res.status(400).json({
            success: false,
            message: '상품명, 가격, 카테고리, 브랜드, 원산지는 필수 입력 항목입니다.'
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

    // origin 유효성 검사 추가 (필수 입력)
    if (origin !== undefined && (typeof origin !== 'string' || !origin.trim() || origin.length > 100)) {
        return res.status(400).json({
            success: false,
            message: '원산지는 100자 이내의 필수 문자열이어야 합니다.'
        });
    }

    // model_name 유효성 검사 추가 (선택 사항)
    if (model_name !== undefined && (typeof model_name !== 'string' || (model_name && model_name.length > 100))) {
        return res.status(400).json({
            success: false,
            message: '모델명은 100자 이내의 문자열이어야 합니다.'
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
                origin: origin || null, // origin 필드 업데이트
                model_name: model_name || null, // model_name 필드 업데이트
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
    // origin, model_name 필드 추가
    const { name, price, category_id, memo, stock, small_photo, large_photo, brand, origin, model_name } = req.body;
    
    // 필수 입력 항목에 brand, origin 추가
    if (!name || !price || !category_id || !brand || !origin) {
        return res.status(400).json({
            success: false,
            message: '상품명, 가격, 카테고리, 브랜드, 원산지는 필수 입력 항목입니다.'
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

    // origin 유효성 검사 추가 (필수 입력)
    if (origin !== undefined && (typeof origin !== 'string' || !origin.trim() || origin.length > 100)) {
        return res.status(400).json({
            success: false,
            message: '원산지는 100자 이내의 필수 문자열이어야 합니다.'
        });
    }

    // model_name 유효성 검사 추가 (선택 사항)
    if (model_name !== undefined && (typeof model_name !== 'string' || (model_name && model_name.length > 100))) {
        return res.status(400).json({
            success: false,
            message: '모델명은 100자 이내의 문자열이어야 합니다.'
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
            brand: brand || null,
            origin: origin || null, // origin 필드 추가
            model_name: model_name || null // model_name 필드 추가
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

//--------------------------------------상품 삭제-------------------------------------------

exports.productDelete = async (req, res) => {
    const productId = parseInt(req.params.productId); // URL 파라미터에서 상품 ID 가져오기

    // 상품 ID가 유효한 숫자인지 확인
    if (isNaN(productId)) {
        return res.status(400).json({
            success: false,
            message: '유효하지 않은 상품 ID입니다.'
        });
    }

    try {
        // 1. 해당 ID의 상품이 존재하는지 확인 (선택 사항이지만 안전을 위해 권장)
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: '해당 상품을 찾을 수 없습니다.'
            });
        }

        // 2. 데이터베이스에서 상품 삭제
        // Sequelize의 destroy 메서드를 사용하여 해당 product_id를 가진 레코드를 삭제
        const deletedRows = await Product.destroy({
            where: { product_id: productId }
        });

        // deletedRows는 삭제된 레코드의 수를 반환
        if (deletedRows === 0) {
            // 상품이 존재했지만 어떤 이유로 삭제되지 않았을 경우 (매우 드물게 발생)
            return res.status(404).json({
                success: false,
                message: '상품을 삭제할 수 없습니다. 다시 시도해주세요.'
            });
        }

        // 3. 성공 응답 전송
        res.status(200).json({
            success: true,
            message: '상품이 성공적으로 삭제되었습니다.'
        });

    } catch (error) {
        console.error('상품 삭제 중 오류 발생:', error); // 에러 로깅
        res.status(500).json({
            success: false,
            message: '상품 삭제 중 서버 오류가 발생했습니다.',
            error: error.message // 개발 단계에서 디버깅을 위해 에러 메시지 포함
        });
    }
};
//--------------------------------------상품 삭제-------------------------------------------
