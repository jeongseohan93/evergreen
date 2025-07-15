// backend/controllers/admin/boardController.js
const { Board, User } = require('../../models'); // Board, User 모델만 가져옴
const Sequelize = require('sequelize'); // Sequelize 라이브러리를 직접 import
const { Op } = Sequelize; // Op는 Sequelize 객체에서 가져옴

// 모든 게시글 가져오기 (enum 타입 및 검색 기능 추가)
exports.getAllBoards = async (req, res, next) => {
    try {
        // 쿼리 파라미터에서 enum 타입과 검색 키워드를 받음
        const { enum: boardType, searchKeyword } = req.query;
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
        if (searchKeyword) {
            const searchOrConditions = []; // 제목, 내용, 작성자 이름을 OR로 묶을 조건 배열

            // 제목 검색 조건
            searchOrConditions.push({ title: { [Op.like]: `%${searchKeyword}%` } });

            // 내용 검색 조건 (content 컬럼이 TEXT/VARCHAR 타입에 JSON 문자열이 저장된 경우 더 안전)
            searchOrConditions.push(
                Sequelize.literal(`CAST(Board.content AS CHAR) LIKE '%${searchKeyword}%'`)
            );

            // 작성자 이름 검색 조건
            // Sequelize.literal을 사용하여 명시적으로 SQL 컬럼을 참조 (MySQL 호환성 향상)
            searchOrConditions.push(
                Sequelize.literal(`\`User\`.\`name\` LIKE '%${searchKeyword}%'`)
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
            // 🚩 공지사항(notice)을 최상단에, 그 다음 생성일(created_at)로 정렬
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
        const validEnumTypes = ['review', 'free'];
        if (!validEnumTypes.includes(enumValue)) {
            return res.status(400).json({ message: '유효하지 않은 게시판 타입입니다.' });
        }

        const user = await User.findOne({ where: { user_uuid: user_id } });
        if (!user) {
            return res.status(400).json({ message: '유효하지 않은 사용자 ID입니다.' });
        }
        const userName = user.name;

        const newPost = await Board.create({
            user_id: user_id,
            title,
            content,
            name: userName,
            notice: notice || 'N',
            enum: enumValue,
            created_at: new Date(),
            updated_at: new Date(),
        });
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        next(error);
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
