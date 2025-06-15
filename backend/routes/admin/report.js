const express = require('express');
const router = express.Router();
const reportControllers = require('../../controllers/admin/reportController');

//조행기 전체 조회
router.get('/admin/report', reportControllers.getReports);

//조행기 상세 조회(제목 클릭 시)
router.get('/admin/report/:reportId', reportControllers.getReportById);

//조행기 수정
router.put('/admin/report/:reportId', reportControllers.updateReport);

//조행기 삭제
router.delete('/admin/report/:reportId', reportControllers.deleteReport);

module.exports = router;