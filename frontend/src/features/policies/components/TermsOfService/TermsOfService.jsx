import React from 'react'; // React import는 항상 필요합니다.
import useFetchTerms from '../../hooks/useFetchTerms'; // 커스텀 훅을 가져옵니다.


const TermsOfService = ( { size, filePath } ) => {
    // useFetchTerms 훅은 'text'만 반환하므로, 'loading'과 'error'는 받지 않습니다.
    const { text } = useFetchTerms(`${process.env.PUBLIC_URL}${filePath}`);

    return (
        <div className="w-full max-w-[1200px] mx-auto bg-gray-100 rounded-lg p-6 shadow-inner mb-8">
            {/* 안쪽 테두리 + 흰색 박스 */}
            <div className={`w-full ${size} bg-white border border-gray-300 rounded-md overflow-y-scroll p-6 shadow-sm text-sm leading-relaxed whitespace-pre-wrap`}>
                {text}
            </div>
        </div>
    );
};

export default TermsOfService;