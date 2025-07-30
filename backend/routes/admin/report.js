const express = require('express');
const router = express.Router();
const reportControllers = require('../../controllers/admin/reportController');
const multer = require('multer');
const path = require('path');

// multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/adminImages');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 이미지 업로드 엔드포인트 추가
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '이미지 파일이 필요합니다.' });
  }
  res.json({ url: `/adminImages/${req.file.filename}` });
});

// 기존 조행기 라우터들
router.get('/', reportControllers.getReports);
router.get('/:reportId', reportControllers.getReportById);
router.put('/:reportId', reportControllers.updateReport);
router.delete('/:reportId', reportControllers.deleteReport);
router.post('/', reportControllers.createReport);

//JSON 형태로만 데이터를 받는다면
//프론트엔드에서 이미지를 “파일”로 직접 업로드하지 않고,
//이미지의 “URL(경로)”만 contents 배열에 넣어서 보내는 구조가 된다.
//JSON 전체가 DB의 contents 필드에 저장

//그럼에도 백엔드의 public/images 폴더에 이미지 파일이 저장되어 있어야 함.
//그래서 이미지 업로드 엔드포인트를 추가함.

module.exports = router;