const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');

//전체 회원 목록 조회
router.get('/', userController.getAllUsers);

//회원 제명
router.delete('/:userUuid', userController.deleteUser);

//회원 제명 해제
router.post('/:userUuid/restore', userController.restoreUser);

//회원 한 명 조회
router.get('/:userUuid', userController.getUserById);

//회원 정보 수정
router.put('/:userUuid', userController.updateUser);

module.exports = router;