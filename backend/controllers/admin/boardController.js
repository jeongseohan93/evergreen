// backend/controllers/admin/boardController.js
const { Board, User, Sequelize } = require('../../models'); // Sequelize 추가

// 모든 게시글 가져오기 (enum 타입으로 필터링 기능 추가)
exports.getAllBoards = async (req, res, next) => {
    try {
        const { enum: boardType } = req.query; // 쿼리 파라미터로 enum 타입 받기 (예: ?enum=review)
        const whereClause = {};

        if (boardType) {
            // 유효한 enum 타입인지 확인 (모델의 ENUM과 일치해야 함)
            const validEnumTypes = ['review', 'free']; // 모델에 정의된 enum 값들
            if (!validEnumTypes.includes(boardType)) {
                return res.status(400).json({ message: '유효하지 않은 게시판 타입입니다.' });
            }
            whereClause.enum = boardType;
        }

        const posts = await Board.findAll({
            where: whereClause, // enum 필터링 조건 적용
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                as: 'User', // 🚩 이 부분이 빠져있었어! Board 모델의 associate에 정의된 alias와 일치해야 함
                attributes: ['user_uuid', 'name'], // User의 name을 가져와 게시글 목록에 표시
            }],
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
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
                as: 'User', // 🚩 이 부분이 빠져있었어! Board 모델의 associate에 정의된 alias와 일치해야 함
                attributes: ['user_uuid', 'name'], // User의 name을 가져와 게시글 상세에 표시
            }],
        });
        if (!post) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 새 게시글 작성
exports.createBoard = async (req, res, next) => {
    const { user_id, title, content, notice, enum: enumValue } = req.body; // enumValue 받음
    try {
        // 유효한 enum 타입인지 백엔드에서 다시 검증
        const validEnumTypes = ['review', 'free'];
        if (!validEnumTypes.includes(enumValue)) {
            return res.status(400).json({ message: '유효하지 않은 게시판 타입입니다.' });
        }

        // user_id를 이용하여 User 모델에서 사용자의 이름을 조회
        const user = await User.findOne({ where: { user_uuid: user_id } });
        if (!user) {
            return res.status(400).json({ message: '유효하지 않은 사용자 ID입니다.' });
        }
        const userName = user.name; // User에서 조회한 이름

        const newPost = await Board.create({
            user_id: user_id, // 프론트에서 받은 user_id 또는 JWT에서 추출된 ID
            title,
            content,
            name: userName, // 조회한 사용자 이름을 여기에 저장
            notice: notice || 'N',
            enum: enumValue, // 이제 기본값 없이 프론트에서 넘어온 enumValue 사용
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
        // 유효한 enum 타입인지 백엔드에서 다시 검증
        const validEnumTypes = ['review', 'free'];
        if (!validEnumTypes.includes(enumValue)) {
            return res.status(400).json({ message: '유효하지 않은 게시판 타입입니다.' });
        }

        // 기존 게시글 정보를 조회하여 user_id를 가져옴
        const existingBoard = await Board.findOne({ where: { board_id: boardId } });
        if (!existingBoard) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        // 기존 게시글의 user_id를 이용하여 User 모델에서 사용자의 최신 이름을 조회
        const user = await User.findOne({ where: { user_uuid: existingBoard.user_id } });
        let userName = existingBoard.name; // 기본값은 기존 게시글의 이름
        if (user) {
            userName = user.name; // 유효한 user_id가 있다면 최신 이름으로 갱신
        }

        const [updatedRows] = await Board.update({
            title,
            content,
            name: userName, // 조회한 사용자 이름을 여기에 저장하여 업데이트
            notice,
            enum: enumValue, // 프론트에서 넘어온 enumValue 사용
            reply,
            like_count,
            hate_count,
            updated_at: new Date(), // 업데이트 시점 갱신
        }, {
            where: { board_id: boardId },
            // + user_id: req.user.id (본인 글만 수정 가능하게 하려면)
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
            // + user_id: req.user.id (본인 글만 삭제 가능하게 하려면)
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