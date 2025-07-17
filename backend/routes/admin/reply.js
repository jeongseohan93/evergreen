// backend/routes/admin/reply.js
const express = require('express');
const router = express.Router();
const replyController = require('../../controllers/admin/replyController'); // 🚩 댓글 컨트롤러 import

// 특정 게시글의 댓글 목록 조회
// 경로: /admin/reply/:boardId/replies
router.get('/:boardId/replies', replyController.getRepliesByBoardId);

// 특정 게시글에 댓글 추가
// 경로: /admin/reply/:boardId/replies
router.post('/:boardId/replies', replyController.createReply);

// 댓글 수정
// 경로: /admin/reply/:replyId
router.put('/:replyId', replyController.updateReply);

// 댓글 삭제
// 경로: /admin/reply/:replyId
router.delete('/:replyId', replyController.deleteReply);

module.exports = router;
