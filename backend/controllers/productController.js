const { Product, Category, Lineup  } = require('../models');
const { Op } = require('sequelize');

/**
 * 'pick' 컬럼이 'best'인 상품만 조회하는 함수
 * @description 가장 최근에 수정한 상품이 먼저 오도록 정렬합니다.
 */
exports.getProductsByPathVariable = async (req, res) => {
    try {
        // 1. URL 경로에서 ':pickValue'에 해당하는 값 추출
        const { pickValue } = req.params;

        // 2. pickValue가 유효한지 확인 (방어적 코딩)
        if (!pickValue) {
            return res.status(400).json({
                success: false,
                message: "pickType 경로 파라미터가 필요합니다. (예: /product/pick/best)"
            });
        }

       

        // 3. 추출된 pickValue를 사용하여 상품 필터링
        const products = await Product.findAll({
            where: {
                pick: pickValue // 'best' 대신 URL에서 추출한 pickValue 사용
            },
            order: [['updated_at', 'DESC']], // 최신 업데이트 순 정렬 유지
            attributes: ['product_id', 'name', 'price', 'small_photo', 'brand', 'model_name', 'sub2_category_name', 'memo'] 
        });
         console.log(products);
        
        // 4. 성공 응답 반환 
        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        // 5. 오류 발생 시 처리
        console.error(`'${req.params.pickValue}' 상품 조회 중 오류:`, error);
        res.status(500).json({
            success: false,
            message: '서버 오류로 상품을 조회할 수 없습니다.'
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

exports.searchProducts = async (req, res) => {
    console.log('--- 상품 검색 요청 수신 ---');
    console.log('req.query (프론트엔드에서 받은 파라미터):', req.query); // 프론트에서 넘어온 쿼리 파라미터 확인

    const { query, name, sub, sub2, page, limit } = req.query; 

    const pageNumber = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * itemsPerPage;

    let productWhereCondition = {}; 

    try {
        // 기존: 1단계 카테고리 (name) 처리 -> Lineup에서 name으로 lineup_id 찾음
        // 수정: name은 category_id에 해당한다고 하셨으므로, Category에서 name으로 category_id를 찾음
        if (name) { // 여기서 name은 Category의 name (예: 릴, 로드, 라인)
            const categoryMain = await Category.findOne({ // Category 모델 사용
                where: { name: name }, 
                attributes: ['category_id'] 
            });
            console.log('메인 카테고리 (Category) 조회 결과:', name, categoryMain ? categoryMain.category_id : '없음');
            if (!categoryMain) { 
                return res.status(200).json({ success: true, products: [], totalCount: 0, message: '메인 카테고리를 찾을 수 없습니다.' });
            }
            productWhereCondition.category_id = categoryMain.category_id; // category_id에 할당
        }

        // 기존: 2단계 카테고리 (sub) 처리 -> Category에서 name으로 category_id 찾음
        // 수정: sub는 lineup_id에 해당한다고 하셨으므로, Lineup에서 name으로 lineup_id를 찾음
        if (sub) { // 여기서 sub는 Lineup의 name (예: 특정 브랜드 라인업)
            const lineupSub = await Lineup.findOne({ // Lineup 모델 사용
                where: { name: sub }, 
                attributes: ['lineup_id'] 
            });
            console.log('라인업 (Lineup) 조회 결과:', sub, lineupSub ? lineupSub.lineup_id : '없음');
            if (!lineupSub) { 
                return res.status(200).json({ success: true, products: [], totalCount: 0, message: '라인업을 찾을 수 없습니다.' });
            }
            productWhereCondition.lineup_id = lineupSub.lineup_id; // lineup_id에 할당
        }

        // 3단계 카테고리 (sub2) 처리 - 이 부분은 동일
        if (sub2) {
            console.log('3단계 카테고리 필터링:', sub2);
            productWhereCondition.sub2_category_name = sub2; 
        }

        // 일반 검색어 (query) 처리 - 이 부분은 동일
        if (query && !name && !sub && !sub2) { 
            const { Op } = require('sequelize'); // Op 사용을 위해 추가
            productWhereCondition.name = { 
                [Op.like]: `%${query}%` 
            };
        }
        console.log('최종 Product WHERE 조건:', productWhereCondition);

        // 2. 최종 productWhereCondition을 사용하여 Product 조회
        const { count, rows } = await Product.findAndCountAll({
            where: productWhereCondition,      
            limit: itemsPerPage,        
            offset: offset,             
            order: [['created_at', 'DESC']], 
            attributes: ['product_id', 'name', 'price', 'small_photo', 'brand', 'model_name', 'sub2_category_name', 'memo'] 
        });

        console.log('상품 조회 성공. 총 개수:', count);
        res.status(200).json({
            success: true,
            products: rows,        
            totalCount: count,     
            currentPage: pageNumber,
            itemsPerPage: itemsPerPage,
            totalPages: Math.ceil(count / itemsPerPage) 
        });

    } catch (error) {
        console.error('상품 검색 오류 (캐치 블록):', error.message);
        console.error('오류 스택:', error.stack); 
        res.status(500).json({ success: false, message: '상품 검색 중 서버 오류가 발생했습니다.' });
    } finally {
        console.log('--- 상품 검색 요청 종료 ---');
    }
};