const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

// 타임스탬프 패턴 (예: -1753839765490-209963617)
const timestampPattern = /-\d{13}-\d{9}/;

function renameFiles() {
    try {
        const files = fs.readdirSync(uploadsDir);
        let renamedCount = 0;
        
        files.forEach(file => {
            if (timestampPattern.test(file)) {
                console.log(`파일명 변경: ${file}`);
                
                // 타임스탬프 부분 제거
                const newName = file.replace(timestampPattern, '');
                
                // 파일 확장자 확인
                const ext = path.extname(newName);
                const nameWithoutExt = newName.replace(ext, '');
                
                // 중복 파일명 처리
                let finalName = newName;
                let counter = 1;
                
                while (fs.existsSync(path.join(uploadsDir, finalName))) {
                    const nameWithoutExt = newName.replace(ext, '');
                    finalName = `${nameWithoutExt}_${counter}${ext}`;
                    counter++;
                }
                
                const oldPath = path.join(uploadsDir, file);
                const newPath = path.join(uploadsDir, finalName);
                
                try {
                    fs.renameSync(oldPath, newPath);
                    console.log(`  → ${finalName}`);
                    renamedCount++;
                } catch (error) {
                    console.error(`  오류: ${file} → ${finalName}`, error.message);
                }
            }
        });
        
        console.log(`\n총 ${renamedCount}개 파일명 변경 완료`);
        
    } catch (error) {
        console.error('오류:', error.message);
    }
}

// 스크립트 실행
renameFiles(); 