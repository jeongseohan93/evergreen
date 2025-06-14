// 조행기 작성, 조행기 수정, 조행기-상품 연결(?)
const Report = require('../../models/report');

// 조행기 목록 조회
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(reports);
  } catch (err) {
    console.error("조행기 목록 조회 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 조행기 상세 조회
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.reportId);
    if (!report) {
      return res.status(404).json({ message: "조행기를 찾을 수 없습니다." });
    }
    res.status(200).json(report);
  } catch (err) {
    console.error("조행기 상세 조회 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 조행기 수정
exports.updateReport = async (req, res) => {
  try {
    const { title, content } = req.body;
    const report = await Report.findByPk(req.params.reportId);
    
    if (!report) {
      return res.status(404).json({ message: "조행기를 찾을 수 없습니다." });
    }

    // 제목과 내용이 비어있는지 확인
    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용은 필수입니다." });
    }

    // 수정
    await report.update({
      title,
      content,
      updated_at: new Date()
    });

    res.status(200).json({ 
      message: "조행기가 수정되었습니다.",
      report 
    });
  } catch (err) {
    console.error("조행기 수정 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};




