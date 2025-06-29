import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// 배너 이미지 파일들을 직접 임포트합니다.
// 경로와 파일명은 사용하시는 것에 맞춰 정확하게 설정해주세요.
// 예: '../../../assets/image/banner1.png'
import bannerImage1 from '../../../../assets/image/배너1.png' // 이 부분은 실제 파일명 'banner1.png' 등으로 변경 권장
import bannerImage2 from '../../../../assets/image/배너2.png'
import bannerImage3 from '../../../../assets/image/배너3.png'
// 모든 배너 이미지 URL을 배열로 관리합니다.
const imageUrls = [
  bannerImage1,
  bannerImage2,
  bannerImage3,
];

function BannerSlider() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // 호버 상태를 관리할 새로운 state

  // 자동 슬라이드 기능 - Hooks는 항상 최상위에서 호출되어야 합니다.
  useEffect(() => {
    // 이미지 배열이 비어있으면 자동 슬라이드 실행 안 함
    if (imageUrls.length === 0) return;

    let intervalId;
    // 마우스 오버 시 자동 슬라이드를 일시 정지
    if (!isHovered) {
      intervalId = setInterval(() => {
        setCurrentSlideIndex((prevIndex) =>
          prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // 5초마다 다음 슬라이드로 전환
    }

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 또는 호버 상태 변경 시 인터벌 정리
  }, [currentSlideIndex, imageUrls.length, isHovered]); // isHovered를 의존성 배열에 추가

  // 이미지 배열이 비어있는 경우를 대비한 방어 로직 - Hooks 호출 후에 배치
  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-200 text-gray-500">
        표시할 배너 이미지가 없습니다.
      </div>
    );
  }

  const goToPrevSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      className="relative w-full h-[500px] overflow-hidden group" // 'group' 클래스 추가
      onMouseEnter={() => setIsHovered(true)} // 마우스 진입 시 isHovered true
      onMouseLeave={() => setIsHovered(false)} // 마우스 이탈 시 isHovered false
    >
      {/* 모든 슬라이드를 담는 트랙 */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
      >
        {imageUrls.map((imageUrl, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            {/* 텍스트 콘텐츠는 렌더링하지 않습니다. */}
          </div>
        ))}
      </div>

      {/* 좌측 화살표 - group-hover:opacity-100 transition-opacity 추가 */}
      <button
        className={`absolute top-1/2 left-4 -translate-y-1/2 p-4 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 z-20
                   ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} // opacity 조절
        onClick={goToPrevSlide}
      >
        <FaChevronLeft className="text-3xl text-white" />
      </button>

      {/* 우측 화살표 - group-hover:opacity-100 transition-opacity 추가 */}
      <button
        className={`absolute top-1/2 right-4 -translate-y-1/2 p-4 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 z-20
                   ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} // opacity 조절
        onClick={goToNextSlide}
      >
        <FaChevronRight className="text-3xl text-white" />
      </button>

      {/* 슬라이드 인디케이터 (하단 점들) - group-hover:opacity-100 transition-opacity 추가 */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10
                   ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} // opacity 조절
      >
        {imageUrls.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentSlideIndex === index ? 'bg-white' : 'bg-gray-400 bg-opacity-50'
            }`}
            onClick={() => setCurrentSlideIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default BannerSlider;