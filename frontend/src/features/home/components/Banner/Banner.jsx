// frontend/src/features/home/components/Banner/Banner.jsx
import React, { useState, useEffect } from 'react';
// 기존에 react-icons/fa에서 불러오던 아이콘들이 있다면 유지
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 

// 우리가 만든 API 함수를 불러와.
// 경로는 Banner.jsx (home/components/Banner)에서 api/bannerApi.js (admin/api)까지의 상대 경로를 계산해야 해.
// home -> features (../) -> src (../) -> frontend (../) -> features (admin) -> api
// 따라서 ../../../admin/api/bannerApi 가 될 거야.
import { getActiveBanners } from '../../../admin/api/bannerApi'; 

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // 기존 imageUrls 대신 API에서 불러올 배너 데이터를 저장할 상태
  const [banners, setBanners] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveBanners = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getActiveBanners(); // 활성화된 배너만 불러옴
        if (result.success) {
          // API에서 받아온 데이터 중 image_url을 사용하여 배너를 구성
          setBanners(result.data); 
        } else {
          setError(result.message || '배너를 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        console.error('메인 배너 불러오기 오류:', err);
        setError('메인 배너를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBanners();

   // 자동 슬라이드 기능 (선택 사항, 기존에 있었다면 유지)
   // banners 배열이 비어있지 않을 때만 setInterval을 설정하도록 조건 추가
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 10000); // 10초마다 변경
      return () => clearInterval(interval);
    }
  }, [banners.length]); // banners.length가 변경될 때마다 useEffect 재실행 (자동 슬라이드 활성화 위함)

  // 배너 데이터가 없거나 로딩 중일 때 처리
  if (loading) {
    return <div className="text-center py-8">배너를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">오류: {error}</div>;
  }

  if (banners.length === 0) {
    return <div className="text-center py-8">표시할 배너가 없습니다.</div>;
  }

  // 슬라이드 변경 함수 (기존 로직 유지)
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    // min-h-[400px] (최소 높이) 또는 h-[400px] (고정 높이) 추가
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg min-h-[450px]"> 
      {/* 배너 이미지 렌더링 */}
      {banners.map((banner, index) => (
        <div
          key={banner.banner_id} // 각 배너의 고유 ID를 key로 사용
          className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* 배너 클릭 시 link_url로 이동 */}
          {banner.link_url ? (
            <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
              <img
                src={banner.image_url} // API에서 받은 이미지 URL 사용
                alt={banner.title || '배너 이미지'}
                className="w-full h-full object-cover"
              />
            </a>
          ) : (
            <img
              src={banner.image_url} // API에서 받은 이미지 URL 사용
              alt={banner.title || '배너 이미지'}
              className="w-full h-full object-cover"
            />
          )}
          {/* 배너 제목 표시 부분 제거됨 */}
        </div>
      ))}

      {/* 이전/다음 버튼 (기존 아이콘 사용) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors z-20"
      >
        {/* <FaChevronLeft /> */} {/* 기존 아이콘이 있다면 사용 */}
        {'<'}
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors z-20"
      >
        {/* <FaChevronRight /> */} {/* 기존 아이콘이 있다면 사용 */}
        {'>'}
      </button>

      {/* 인디케이터 (점) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Banner;
