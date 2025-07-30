// backend/controllers/admin/replyController.js
const { Reply, Board, User } = require('../../models'); // Reply, Board, User 모델 import
const { Op } = require('sequelize'); // Op 사용을 위해 Sequelize import (필요 없으면 제거 가능)

// 특정 게시글의 댓글 목록 조회
exports.getRepliesByBoardId = async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const replies = await Reply.findAll({
            where: { board_id: boardId },
            include: [{
                model: User,
                as: 'User', // Reply 모델에서 User를 참조할 때 사용한 alias
                attributes: ['user_uuid', 'name'], // 댓글 작성자 정보 포함
            }],
            order: [['created_at', 'ASC']], // 오래된 댓글부터 표시
        });
        res.status(200).json(replies);
    } catch (error) {
        console.error("Error in getRepliesByBoardId:", error);
        next(error);
    }
};

// 특정 게시글에 댓글 추가
exports.createReply = async (req, res, next) => {
    const { boardId } = req.params;
    const { user_id, content } = req.body; // user_id와 댓글 내용 받음

    try {
        // 게시글 존재 여부 확인
        const board = await Board.findByPk(boardId);
        if (!board) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        // 사용자 존재 여부 확인 (댓글 작성자)
        const user = await User.findOne({ where: { user_uuid: user_id } });
        if (!user) {
            return res.status(400).json({ message: '유효하지 않은 사용자 ID입니다.' });
        }

        const newReply = await Reply.create({
            board_id: boardId,
            user_id: user_id,
            content: content,
            created_at: new Date(),
            updated_at: new Date(),
        });
        res.status(201).json(newReply);
    } catch (error) {
        console.error("Error in createReply:", error);
        next(error);
    }
};

// 댓글 수정
exports.updateReply = async (req, res, next) => {
    const { replyId } = req.params;
    const { content } = req.body; // 수정할 댓글 내용

    try {
        const [updatedRows] = await Reply.update({
            content: content,
            updated_at: new Date(),
        }, {
            where: { reply_id: replyId },
            // 🚩 (선택 사항) 댓글 작성자만 수정할 수 있도록 user_id 조건 추가 가능:
            // where: { reply_id: replyId, user_id: req.user.id },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: '댓글을 찾을 수 없거나 수정 권한이 없습니다.' });
        }
        res.status(200).json({ message: '댓글이 성공적으로 수정되었습니다.' });
    } catch (error) {
        console.error("Error in updateReply:", error);
        next(error);
    }
};

// 댓글 삭제
exports.deleteReply = async (req, res, next) => {
    const { replyId } = req.params;

    try {
        const deletedRows = await Reply.destroy({
            where: { reply_id: replyId },
            // 🚩 (선택 사항) 댓글 작성자만 삭제할 수 있도록 user_id 조건 추가 가능:
            // where: { reply_id: replyId, user_id: req.user.id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: '댓글을 찾을 수 없거나 삭제 권한이 없습니다.' });
        }
        res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error("Error in deleteReply:", error);
        next(error);
    }
};
