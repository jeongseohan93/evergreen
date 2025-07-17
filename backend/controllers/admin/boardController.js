const { Board, User } = require('../../models'); // Board, User 모델만 가져옴
const Sequelize = require('sequelize'); // Sequelize 라이브러리를 직접 import
const { Op } = Sequelize; // Op는 Sequelize 객체에서 가져옴

// 모든 게시글 가져오기 (enum 타입 및 검색 기능 추가)
exports.getAllBoards = async (req, res, next) => {
    try {
        // 쿼리 파라미터에서 enum 타입과 검색 키워드를 받음
        // 'searchKeyword' 대신 프론트엔드에서 보내는 'keyword'를 사용합니다.
        const { enum: boardType, keyword } = req.query;
        let whereConditions = {}; // Board 모델에 적용될 WHERE 조건
        let includeOptions = [{ // User 모델 포함 조건 (기본값: LEFT JOIN)
            model: User,
            as: 'User',
            attributes: ['user_uuid', 'name'],
            required: false // 기본적으로 LEFT JOIN (사용자 정보가 없어도 게시글은 가져옴)
        }];

        // 1. enum 타입 필터링
        if (boardType) {
            const validEnumTypes = ['review', 'free']; // 모델에 정의된 유효한 enum 값들
            if (!validEnumTypes.includes(boardType)) {
                return res.status(400).json({ message: '유효하지 않은 게시판 타입입니다.' });
            }
            whereConditions.enum = boardType;
        }

        // 2. 검색 키워드 처리 (제목, 내용, 작성자 이름)
        // keyword가 존재할 경우 검색 조건 추가
        if (keyword) {
            const searchOrConditions = []; // 제목, 내용, 작성자 이름을 OR로 묶을 조건 배열

            // 제목 검색 조건
            searchOrConditions.push({ title: { [Op.like]: `%${keyword}%` } });

            // 내용 검색 조건 (content 컬럼이 TEXT/VARCHAR 타입이라고 가정)
            // 만약 content가 JSONB 타입이고 그 안에 'text' 필드가 있다면
            // searchOrConditions.push({ 'content.text': { [Op.like]: `%${keyword}%` } });
            // 로 변경해야 합니다. 현재는 일반 텍스트 필드로 가정하고 수정했습니다.
            searchOrConditions.push({ content: { [Op.like]: `%${keyword}%` } });

            // 작성자 이름 검색 조건
            // Sequelize.literal를 사용하여 명시적으로 SQL 컬럼을 참조 (MySQL 호환성 향상)
            searchOrConditions.push(
                Sequelize.literal(`\`User\`.\`name\` LIKE '%${keyword}%'`)
            );

            // 기존 whereConditions (enum 조건 등)와 새로운 검색 조건들을 조합
            // enum 조건이 있다면 AND로 묶고, 없으면 검색 조건만 적용
            if (Object.keys(whereConditions).length > 0) {
                whereConditions = {
                    [Op.and]: [
                        whereConditions, // 기존 enum 조건
                        { [Op.or]: searchOrConditions } // 제목, 내용, 작성자 이름 검색 조건
                    ]
                };
            } else {
                whereConditions = { [Op.or]: searchOrConditions }; // enum 조건이 없으면 검색 조건만
            }

            // 검색 키워드가 있을 경우, User 모델은 필수적으로 JOIN (INNER JOIN)
            // 이렇게 해야 `User.name` 조건이 유효하게 동작함
            includeOptions[0].required = true;
        }

        const posts = await Board.findAll({
            where: whereConditions, // 최종 WHERE 조건 적용
            // 공지사항(notice)을 최상단에, 그 다음 생성일(created_at)로 정렬
            order: [
                // notice가 'Y'이면 0, 'N'이면 1로 매핑하여 ASC (오름차순) 정렬
                // 이렇게 하면 'Y'가 항상 'N'보다 먼저 오게 됨
                Sequelize.literal(`CASE WHEN Board.notice = 'Y' THEN 0 ELSE 1 END ASC`),
                ['created_at', 'DESC'] // 그 다음 최신순으로 정렬
            ],
            include: includeOptions, // User 모델 포함 조건 적용
            subQuery: false // 복잡한 include와 order 조건에서 단일 쿼리 생성을 강제
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getAllBoards:", error); // 더 상세한 에러 로깅
        if (error.original) {
            console.error("Database error details (getAllBoards):", error.original);
        }
        if (error.sql) {
            console.error("SQL query that caused error (getAllBoards):", error.sql);
        }
        next(error);
    }
};

// 특정 게시글 가져오기
exports.getBoardById = async (req, res, next) => {
    try {
        const post = await Board.findOne({
            where: { board_id: req.params.id },
            include: [{
                model: User,
                as: 'User',
                attributes: ['user_uuid', 'name'],
            }],
        });
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error in getBoardById:", error); // 에러 로깅 강화
        if (error.original) {
            console.error("Database error details (getBoardById):", error.original);
        }
        if (error.sql) {
            console.error("SQL query that caused error (getBoardById):", error.sql);
        }
        next(error);
    }
};

// 새 게시글 작성
exports.createBoard = async (req, res, next) => {
    const { user_id, title, content, notice, enum: enumValue } = req.body;
    try {
        // ✨ 1. 수신된 데이터 확인 (가장 중요!)
        console.log("[createBoard] 수신된 req.body:", req.body);
        console.log("[createBoard] 수신된 user_id:", user_id); 
        console.log("[createBoard] 수신된 title:", title);
        console.log("[createBoard] 수신된 content:", content); // content의 실제 값과 타입을 확인하세요.
        console.log("[createBoard] 수신된 notice:", notice);
        console.log("[createBoard] 수신된 enumValue:", enumValue);

        const validEnumTypes = ['review', 'free'];
        if (!validEnumTypes.includes(enumValue)) {
            console.log("[createBoard] 유효하지 않은 게시판 타입:", enumValue); // ✨ 로그 추가
            return res.status(400).json({ message: '유효하지 않은 게시판 타입입니다.' });
        }

        const user = await User.findOne({ where: { user_uuid: user_id } });
        // ✨ 2. User 조회 결과 확인
        console.log("[createBoard] User.findOne 결과:", user); 
        if (!user) {
            console.log("[createBoard] 사용자 ID를 찾을 수 없음:", user_id); // ✨ 로그 추가
            return res.status(400).json({ message: '유효하지 않은 사용자 ID입니다.' });
        }
        const userName = user.name;
        console.log("[createBoard] 찾은 사용자 이름:", userName); // ✨ 로그 추가

        const newPost = await Board.create({
            user_id: user_id,
            title,
            content, // content가 JSON 타입이어야 함
            name: userName,
            notice: notice || 'N',
            enum: enumValue,
            created_at: new Date(),
            updated_at: new Date(),
        });
        console.log("[createBoard] 게시글 생성 성공:", newPost); // ✨ 로그 추가
        res.status(201).json(newPost);
    } catch (error) {
        // ✨ 3. 에러 발생 시 상세 정보 로깅 (가장 중요!)
        console.error("Error in createBoard:", error); 
        if (error.original) {
            console.error("Database error details (createBoard):", error.original);
        }
        if (error.sql) {
            console.error("SQL query that caused error (createBoard):", error.sql);
        }
        next(error); // 에러 핸들링 미들웨어로 전달
    }
};

// 게시글 수정
exports.updateBoard = async (req, res, next) => {
    const { title, content, notice, enum: enumValue, reply, like_count, hate_count } = req.body;
    const boardId = req.params.id;

    try {
        const validEnumTypes = ['review', 'free'];
        if (!validEnumTypes.includes(enumValue)) {
            return res.status(400).json({ message: '유효하지 않은 게시판 타입입니다.' });
        }

        const existingBoard = await Board.findOne({ where: { board_id: boardId } });
        if (!existingBoard) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        const user = await User.findOne({ where: { user_uuid: existingBoard.user_id } });
        let userName = existingBoard.name;
        if (user) {
            userName = user.name;
        }

        const [updatedRows] = await Board.update({
            title,
            content,
            name: userName,
            notice,
            enum: enumValue,
            reply,
            like_count,
            hate_count,
            updated_at: new Date(),
        }, {
            where: { board_id: boardId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: '게시글을 찾을 수 없거나 수정 권한이 없습니다.' });
        }
        res.status(200).json({ message: '게시글이 성공적으로 수정되었습니다.' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 게시글 삭제 (변경 없음)
exports.deleteBoard = async (req, res, next) => {
    try {
        const deletedRows = await Board.destroy({
            where: { board_id: req.params.id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: '게시글을 찾을 수 없거나 삭제 권한이 없습니다.' });
        }
        res.status(200).json({ message: '게시글이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
