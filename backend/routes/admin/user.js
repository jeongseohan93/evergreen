const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');

// 전체 회원 조회
router.get('/users', userController.getAllUsers);

// 회원 상세 조회
router.get('/users/:userUuid', userController.getUserById);

// 회원 정보 수정
router.put('/users/:userUuid', userController.updateUser);

// 회원 제명(삭제)
router.delete('/users/:userUuid', userController.deleteUser);

// 회원 제명 해제(복구)
router.post('/users/:userUuid/restore', userController.restoreUser);



module.exports = router;