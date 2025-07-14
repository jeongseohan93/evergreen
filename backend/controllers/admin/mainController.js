// 관리자 메인 진입
// 배너 추가, 배너 삭제, 배너 갯수 조정, 배너 사용여부
// 글 삭제, 댓글 삭제, 공지 등록 


// backend/controllers/admin/mainController.js
const Banner = require('../../models/banner'); // 경로 수정: ../../../models/banner -> ../../models/banner
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 파일 시스템 모듈 (파일 삭제용)

// 배너 이미지 저장 설정
const bannerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // process.cwd()는 현재 작업 디렉토리(evergreen)를 반환.
        // 따라서 'uploads', 'banners'를 붙여 evergreen/uploads/banners 경로를 만듦.
        const uploadDir = path.join(process.cwd(), 'uploads', 'banners'); 
        
        // 폴더가 없으면 생성
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname;
        const extension = path.extname(originalname);
        const basename = path.basename(originalname, extension);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFileName = `${basename}-${uniqueSuffix}${extension}`;
        cb(null, newFileName);
    }
});

// 파일 필터 (이미지 파일만 허용)
const bannerFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // 허용
    } else {
        cb(new Error('이미지 파일만 업로드할 수 있습니다.'), false); // 에러 반환
    }
};

// multer 업로드 미들웨어 생성 (배너 전용)
const uploadBanner = multer({
    storage: bannerStorage,
    fileFilter: bannerFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB 제한
    }
});

// --- 배너 추가 (이미지 업로드 포함) ---
exports.addBanner = (req, res) => {
    uploadBanner.single('bannerImage')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Multer 에러 처리 (예: 파일 크기 초과, 잘못된 필드 이름)
            return res.status(400).json({ success: false, message: `파일 업로드 오류: ${err.message}` });
        } else if (err) {
            // 그 외 알 수 없는 에러 처리
            return res.status(500).json({ success: false, message: `서버 오류: ${err.message}` });
        }

        // 파일이 업로드되지 않았을 경우
        if (!req.file) {
            return res.status(400).json({ success: false, message: '배너 이미지 파일을 선택해주세요.' });
        }

        const { title, link_url, order, is_active } = req.body;
        const imageUrl = `/uploads/banners/${req.file.filename}`; // 클라이언트 접근용 URL

        try {
            const newBanner = await Banner.create({
                image_url: imageUrl,
                title: title || null,
                link_url: link_url || null,
                order: order ? parseInt(order) : 0,
                is_active: is_active === 'true' // 문자열 'true'를 boolean true로 변환
            });

            res.status(201).json({
                success: true,
                message: '배너가 성공적으로 추가되었습니다.',
                data: newBanner
            });
        } catch (error) {
            console.error('배너 추가 오류:', error);
            // 데이터베이스 저장 실패 시, 업로드된 파일 롤백 (삭제)
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ success: false, message: '배너 추가 중 오류가 발생했습니다.' });
        }
    });
};

// --- 모든 배너 조회 (관리자용) ---
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.findAll({
            order: [['order', 'ASC'], ['created_at', 'DESC']] // 순서대로 정렬, 같은 순서일 경우 최신 생성일 기준
        });
        res.status(200).json({ success: true, data: banners });
    } catch (error) {
        console.error('배너 조회 오류:', error);
        res.status(500).json({ success: false, message: '배너를 불러오는 중 오류가 발생했습니다.' });
    }
};

// --- 활성화된 배너 조회 (프론트엔드 메인 페이지용) ---
exports.getActiveBanners = async (req, res) => {
    try {
        const activeBanners = await Banner.findAll({
            where: { is_active: true }, // 활성화된 배너만 조회
            order: [['order', 'ASC'], ['created_at', 'DESC']] // 순서대로 정렬
        });
        res.status(200).json({ success: true, data: activeBanners });
    } catch (error) {
        console.error('활성화된 배너 조회 오류:', error);
        res.status(500).json({ success: false, message: '활성화된 배너를 불러오는 중 오류가 발생했습니다.' });
    }
};

// --- 배너 수정 (이미지 변경 포함) ---
exports.updateBanner = (req, res) => {
    uploadBanner.single('bannerImage')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `파일 업로드 오류: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ success: false, message: `서버 오류: ${err.message}` });
        }

        const bannerId = parseInt(req.params.bannerId);
        const { title, link_url, order, is_active } = req.body;

        if (isNaN(bannerId)) {
            return res.status(400).json({ success: false, message: '유효하지 않은 배너 ID입니다.' });
        }

        try {
            const banner = await Banner.findByPk(bannerId);
            if (!banner) {
                // 새로운 파일이 업로드되었는데 배너를 찾을 수 없으면 업로드된 파일 삭제
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(404).json({ success: false, message: '해당 배너를 찾을 수 없습니다.' });
            }

            let newImageUrl = banner.image_url; // 기존 이미지 URL 유지

            // 새 이미지가 업로드된 경우
            if (req.file) {
                // 기존 이미지 파일 삭제 (uploads/banners/ 경로에서)
                const oldImagePath = path.join(process.cwd(), banner.image_url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
                newImageUrl = `/uploads/banners/${req.file.filename}`; // 새 이미지 URL 설정
            }

            const [updatedRowsCount] = await Banner.update({
                image_url: newImageUrl,
                title: title || null,
                link_url: link_url || null,
                order: order ? parseInt(order) : banner.order, // order가 없으면 기존 값 유지
                is_active: is_active !== undefined ? (is_active === 'true') : banner.is_active // is_active가 없으면 기존 값 유지
            }, {
                where: { banner_id: bannerId }
            });

            if (updatedRowsCount === 0) {
                // 업데이트된 행이 없으면 (데이터가 동일하거나 ID를 찾을 수 없음)
                // 새로운 파일이 업로드되었는데 업데이트가 안 되었다면 업로드된 파일 삭제
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                const updatedBanner = await Banner.findByPk(bannerId);
                return res.status(200).json({
                    success: true,
                    message: '배너 정보가 변경되지 않았습니다 (기존과 동일).',
                    data: updatedBanner
                });
            }

            const updatedBanner = await Banner.findByPk(bannerId);
            res.status(200).json({
                success: true,
                message: '배너가 성공적으로 수정되었습니다.',
                data: updatedBanner
            });

        } catch (error) {
            console.error('배너 수정 오류:', error);
            // 에러 발생 시 새로운 파일이 업로드되었다면 롤백 (삭제)
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ success: false, message: '배너 수정 중 오류가 발생했습니다.' });
        }
    });
};

// --- 배너 삭제 ---
exports.deleteBanner = async (req, res) => {
    const bannerId = parseInt(req.params.bannerId);

    if (isNaN(bannerId)) {
        return res.status(400).json({ success: false, message: '유효하지 않은 배너 ID입니다.' });
    }

    try {
        const banner = await Banner.findByPk(bannerId);
        if (!banner) {
            return res.status(404).json({ success: false, message: '해당 배너를 찾을 수 없습니다.' });
        }

        // 데이터베이스에서 배너 레코드 삭제 전에 이미지 파일 삭제
        const imagePathToDelete = path.join(process.cwd(), banner.image_url);
        if (fs.existsSync(imagePathToDelete)) {
            fs.unlinkSync(imagePathToDelete);
        }

        const deletedRows = await Banner.destroy({
            where: { banner_id: bannerId }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ success: false, message: '배너를 삭제할 수 없습니다. 다시 시도해주세요.' });
        }

        res.status(200).json({ success: true, message: '배너가 성공적으로 삭제되었습니다.' });

    } catch (error) {
        console.error('배너 삭제 오류:', error);
        res.status(500).json({ success: false, message: '배너 삭제 중 서버 오류가 발생했습니다.' });
    }
};

// --- 배너 순서 및 활성화 상태 업데이트 (개별 필드 업데이트) ---
exports.updateBannerStatusAndOrder = async (req, res) => {
    const bannerId = parseInt(req.params.bannerId);
    const { order, is_active } = req.body; // order와 is_active만 받음

    console.log(`[Backend Debug] updateBannerStatusAndOrder called for bannerId: ${bannerId}`);
    console.log(`[Backend Debug] Received body:`, req.body);
    console.log(`[Backend Debug] Received is_active: ${is_active} (Type: ${typeof is_active})`);

    if (isNaN(bannerId)) {
        return res.status(400).json({ success: false, message: '유효하지 않은 배너 ID입니다.' });
    }

    const updateFields = {};
    if (order !== undefined) {
        if (isNaN(order)) {
            return res.status(400).json({ success: false, message: '유효하지 않은 순서 값입니다.' });
        }
        updateFields.order = parseInt(order);
    }
    if (is_active !== undefined) {
        // is_active가 문자열 "true" 또는 "false"로 오거나, 실제 불리언 값으로 올 수 있음
        updateFields.is_active = typeof is_active === 'string' ? (is_active === 'true') : Boolean(is_active); 
        console.log(`[Backend Debug] Converted is_active to: ${updateFields.is_active} (Type: ${typeof updateFields.is_active})`);
    }

    if (Object.keys(updateFields).length === 0) {
        console.log('[Backend Debug] No update fields provided.');
        return res.status(400).json({ success: false, message: '업데이트할 필드가 없습니다.' });
    }

    try {
        const [updatedRowsCount] = await Banner.update(updateFields, {
            where: { banner_id: bannerId }
        });

        console.log(`[Backend Debug] Rows updated: ${updatedRowsCount}`);

        if (updatedRowsCount === 0) {
            const existingBanner = await Banner.findByPk(bannerId);
            if (!existingBanner) {
                console.log(`[Backend Debug] Banner with ID ${bannerId} not found.`);
                return res.status(404).json({ success: false, message: '해당 배너를 찾을 수 없습니다.' });
            } else {
                console.log(`[Backend Debug] Banner with ID ${bannerId} found, but no changes made (data might be identical).`);
                return res.status(200).json({
                    success: true,
                    message: '배너 상태/순서가 변경되지 않았습니다 (기존과 동일).',
                    data: existingBanner
                });
            }
        }

        const updatedBanner = await Banner.findByPk(bannerId);
        console.log(`[Backend Debug] Banner ID ${bannerId} successfully updated to:`, updatedBanner);
        res.status(200).json({
            success: true,
            message: '배너 상태/순서가 성공적으로 업데이트되었습니다.',
            data: updatedBanner
        });

    } catch (error) {
        console.error('배너 상태/순서 업데이트 오류:', error);
        res.status(500).json({ success: false, message: '배너 상태/순서 업데이트 중 오류가 발생했습니다.' });
    }
};
