// controllers/productController.js

const { Product, Category, Lineup  } = require('../models');
const { Op } = require('sequelize');

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

exports.searchProducts = async (req, res) => {
    // ⭐️ query 외에 name, sub, sub2 파라미터도 req.query에서 받아옵니다.
    const { query, name, sub, sub2, page, limit } = req.query; 

    const pageNumber = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * itemsPerPage;

    try {
        let whereCondition = {}; // Product 모델에 직접 적용될 WHERE 조건
        let includeOptions = []; // Category, Lineup 모델과의 JOIN을 위한 include 옵션 배열

        // 1. 일반 검색어 (query) 처리
        // 'query' 파라미터가 있을 경우, Product 모델의 'name' 컬럼에서 검색
        if (query) {
            whereCondition.name = { // 🚨 'name'은 실제 Product 모델의 상품명 컬럼명으로 변경해야 합니다.
                [Op.like]: `%${query}%` // 부분 일치 검색
            };
        }

        // 2. 카테고리 이름 (name) 처리
        // 'name' 파라미터가 있을 경우, Category 모델을 조인하여 카테고리 이름으로 필터링
        // 🚨 Category 모델이 존재하고 Product와 Category 관계가 설정되어 있어야 합니다.
        if (name) {
            includeOptions.push({
                model: Category, 
                as: 'Category',  // Product 모델에 Category를 포함할 때의 별칭 (db.Product.belongsTo(db.Category, { as: 'Category' }))
                attributes: [], // Category 테이블의 컬럼을 직접 선택하지 않음 (오직 필터링 목적)
                where: { name: name }, // Category 모델의 'name' 컬럼으로 필터링
                required: true // INNER JOIN (카테고리에 해당하는 상품만 가져옴)
            });
        }

        // 3. 서브 카테고리 이름 (sub) 처리
        // 'sub' 파라미터가 있을 경우, Lineup 모델을 조인하여 라인업 이름으로 필터링
        // 🚨 Lineup 모델이 존재하고 Product와 Lineup 관계가 설정되어 있어야 합니다.
        if (sub) {
            // Lineup 모델 include 옵션을 찾거나 새로 생성하여 추가
            let lineupInclude = includeOptions.find(opt => opt.model === Lineup);
            if (!lineupInclude) { // 아직 Lineup이 include 되어있지 않다면 새로 추가
                lineupInclude = {
                    model: Lineup, 
                    as: 'Lineup',   // Product 모델에 Lineup을 포함할 때의 별칭 (db.Product.belongsTo(db.Lineup, { as: 'Lineup' }))
                    attributes: [], 
                    where: {}, 
                    required: true 
                };
                includeOptions.push(lineupInclude);
            }
            lineupInclude.where.name = sub; // Lineup 모델의 'name' 컬럼으로 필터링
        }

        // 4. 3단계 서브 카테고리 이름 (sub2) 처리
        // 'sub2' 파라미터가 있을 경우, Lineup 모델의 추가 필드를 통해 필터링합니다.
        // 🚨 이 부분은 Lineup 모델의 계층 구조나 Product 모델에 추가적인 필드가 있는지에 따라 수정이 필요합니다.
        // 여기서는 Lineup 모델에 'sub_name'이라는 필드가 있다고 가정하고 필터링합니다.
        // (실제 Lineup 모델 및 DB 컬럼명 확인 필수!)
        if (sub2) {
            let lineupInclude = includeOptions.find(opt => opt.model === Lineup);
            if (!lineupInclude) { 
                lineupInclude = {
                    model: Lineup, 
                    as: 'Lineup',   
                    attributes: [], 
                    where: {}, 
                    required: true 
                };
                includeOptions.push(lineupInclude);
            }
            lineupInclude.where.sub_name = sub2; // ⭐️ Lineup 모델에 'sub_name' 필드가 있다고 가정
        }

        // Sequelize의 findAndCountAll 메서드를 사용하여 상품 목록과 총 개수를 한 번에 조회
        const { count, rows } = await Product.findAndCountAll({
            where: whereCondition,      // Product 모델 자체의 조건 (예: query 검색)
            include: includeOptions,    // 조인된 모델들의 조건 (예: category, lineup 검색)
            limit: itemsPerPage,        // 페이지당 항목 수
            offset: offset,             // 건너뛸 항목 수 (페이지네이션)
            order: [['created_at', 'DESC']], // ⭐️ 'Product' 모델의 실제 생성일 컬럼명에 맞춤
            // ⭐️ attributes에 프론트엔드에서 필요한 컬럼만 명시하여 효율 높이기.
            attributes: ['product_id', 'name', 'price', 'small_photo', 'brand'] 
        });

        // 성공 응답
        res.status(200).json({
            success: true,
            products: rows,        // 현재 페이지의 상품 목록
            totalCount: count,     // 총 검색 결과 수 (페이지네이션에 사용)
            currentPage: pageNumber,
            itemsPerPage: itemsPerPage,
            totalPages: Math.ceil(count / itemsPerPage) // 총 페이지 수
        });

    } catch (error) {
        console.error('상품 검색 오류:', error.message);
        res.status(500).json({ success: false, message: '상품 검색 중 서버 오류가 발생했습니다.' });
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
        // 1단계 카테고리 (name) 처리
        if (name) {
            const lineupCategory = await Lineup.findOne({ 
                where: { name: name }, 
                attributes: ['lineup_id'] 
            });
            console.log('1단계 카테고리 (Lineup) 조회 결과:', name, lineupCategory ? lineupCategory.lineup_id : '없음');
            if (!lineupCategory) { 
                return res.status(200).json({ success: true, products: [], totalCount: 0, message: '1단계 카테고리를 찾을 수 없습니다.' });
            }
            productWhereCondition.lineup_id = lineupCategory.lineup_id; 
        }

        // 2단계 카테고리 (sub) 처리
        if (sub) {
            const categorySub = await Category.findOne({ 
                where: { name: sub }, 
                attributes: ['category_id'] 
            });
            console.log('2단계 카테고리 (Category) 조회 결과:', sub, categorySub ? categorySub.category_id : '없음');
            if (!categorySub) { 
                return res.status(200).json({ success: true, products: [], totalCount: 0, message: '2단계 카테고리를 찾을 수 없습니다.' });
            }
            productWhereCondition.category_id = categorySub.category_id; 
        }

        // 3단계 카테고리 (sub2) 처리
        if (sub2) {
            console.log('3단계 카테고리 필터링:', sub2);
            productWhereCondition.sub2_category_name = sub2; 
        }

        // 일반 검색어 (query) 처리
        if (query && !name && !sub && !sub2) { 
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
            attributes: ['product_id', 'name', 'price', 'small_photo', 'brand', 'model_name', 'sub2_category_name'] 
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
        // ⭐️ 이 부분이 실행될 경우, 서버 콘솔에 에러 스택이 자세히 출력됩니다.
        console.error('상품 검색 오류 (캐치 블록):', error.message);
        console.error('오류 스택:', error.stack); // ⭐️ 스택 트레이스 확인
        res.status(500).json({ success: false, message: '상품 검색 중 서버 오류가 발생했습니다.' });
    } finally {
        console.log('--- 상품 검색 요청 종료 ---');
    }
};