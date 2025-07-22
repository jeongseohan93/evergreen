const express = require('express');
const router = express.Router();


const mypageController = require('../controllers/mypageController');

router.post('/juso-api-callback', (req, res) => {
    console.log('--- 📮 주소 API로부터 POST 요청 수신 (백엔드) ---');
    console.log('✅ 요청 본문 (req.body):', req.body); // 주소 데이터가 여기에 있을 거야

    const dataToFront = {
        zipCode: req.body.zipNo || '',
        addressMain: req.body.roadAddrPart1 || '',
        addressDetail: req.body.addrDetail || '',
        roadFullAddr: req.body.roadFullAddr || '',
        jibunAddr: req.body.jibunAddr || '',
        engAddr: req.body.engAddr || '',
        siNm: req.body.siNm || '',
        sggNm: req.body.sggNm || '',
        emdNm: req.body.emdNm || '',
        rn: req.body.rn || '',
        // 주소 API가 넘겨주는 다른 필요한 데이터들도 여기에 추가
    };

    const jsonString = JSON.stringify(dataToFront);

    // ⭐ 중요: 이 스크립트는 팝업 창에서 실행될 거야.
    // window.opener.postMessage를 사용해서 부모 창으로 데이터를 전달하고 팝업을 닫아.
    const script = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>주소 콜백</title>
            <meta charset="UTF-8">
        </head>
        <body>
            <script>
                try {
                    console.log("Juso Backend Callback Script loaded in popup.");
                    console.log("Window opener:", window.opener);
                    console.log("Data to send (JSON string from backend):", '${jsonString}');

                    if (window.opener) {
                        const data = JSON.parse('${jsonString}');
                        // ⭐ window.opener.postMessage를 사용하여 프론트엔드로 데이터 전달 ⭐
                        // 'http://localhost:3000'은 너의 React 앱 도메인이어야 해.
                        window.opener.postMessage({ type: 'juso_selected', data: data }, 'http://localhost:3000');
                        console.log("Data successfully sent to opener via postMessage.");
                    } else {
                        console.error("🚫 window.opener를 찾을 수 없습니다. 팝업이 부모 창이 없음.");
                    }
                } catch (e) {
                    console.error("⚠️ Backend callback script 실행 중 오류 발생 (팝업 내부):", e);
                    console.error("Error name:", e.name);
                    console.error("Error message:", e.message);
                    if (e instanceof SyntaxError) {
                        console.error("SyntaxError: JSON 문자열 구조에 문제가 있습니다.", '${jsonString}');
                    }
                } finally {
                    window.close(); // 작업을 마쳤으니 팝업 창 닫기
                }
            </script>
        </body>
        </html>
    `;

    res.send(script); // 팝업에게 이 스크립트를 응답으로 보냄
});

// 마이페이지 대시보드 요약
router.get('/', mypageController.getMypageSummary);

// 모든 주문 목록
router.get('/orders', mypageController.getAllOrders);

// 특정 주문 상세
router.get('/orders/:orderId', mypageController.getOrderDetail);


module.exports = router;