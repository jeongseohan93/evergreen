import React from 'react';

const ReviewCard = ({ imageUrl }) => {
    // 임시 데이터 (실제 데이터는 API 등으로 받아올 수 있습니다)
    const userName = '디자인모어';
    const rating = 4; // 5점 만점 중 4점
    const reviewTitle = '요즘 뾰로지 때문에 고민이 많았…';
    const reviewContent = '요즘 뾰로지 때문에 고민이 많았는데 후기가 좋아 구매했는데 여기는 찐후기 인가봐요. 효과가 바로 나타나네요! 앞으로 인생…';

    return (
        <div className="max-w-sm bg-white rounded-lg overflow-hidden shadow-sm font-sans">
            {/* 이미지 영역 */}
            <div className="w-full h-auto bg-gray-100 flex items-center justify-center">
                <img
                    className="w-full h-auto object-cover" // 이미지 크기에 따라 조정될 수 있습니다.
                    src={imageUrl}
                    alt="상품 이미지"
                />
            </div>

            {/* 리뷰 정보 영역 */}
            <div className="p-4">
                {/* 사용자명 및 별점 */}
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600 font-medium">{userName}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < rating ? 'text-orange-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                            </svg>
                        ))}
                    </div>
                </div>

                {/* 리뷰 제목 */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                    {reviewTitle}
                </h3>

                {/* 리뷰 내용 */}
                <p className="text-sm text-gray-700 leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap">
                    {reviewContent}
                </p>
                {/* 텍스트가 잘릴 경우 '...'을 표시하려면 CSS에서 'text-ellipsis'와 'whitespace-nowrap'을 사용하거나, 실제 자바스크립트로 자르는 로직을 추가해야 합니다. 현재는 whitespace-nowrap 때문에 한 줄로 보일 수 있습니다. 여러 줄을 원한다면 max-lines clamp 같은 CSS 속성을 사용하거나, JS로 잘라야 합니다. */}
            </div>
        </div>
    );
};

export default ReviewCard;