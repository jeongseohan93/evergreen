// frontend/src/features/admin/pages/bannerPage/BannerManager.jsx
import React from 'react';
import useBannerManagement from '../../components/banner/hooks/useBannerManagement'; // 커스텀 훅 임포트
import BannerForm from './BannerForm'; // 새로 생성할 폼 컴포넌트 임포트
import BannerList from './BannerList'; // 새로 생성할 목록 컴포넌트 임포트

const BannerManager = () => {
  const {
    banners,
    loading,
    // error, // 사용되지 않으므로 제거
    editingBanner,
    handleAddBanner,
    handleUpdateBanner,
    handleDeleteBanner,
    handleToggleActive,
    handleChangeOrder,
    startEditing,
    cancelEditing
  } = useBannerManagement();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="text-4xl font-bold font-aggro mb-6">배너 관리</h1>

      {/* 배너 추가/수정 폼 */}
      <div className="mb-8">
        {/* BannerForm 내부에 에러 메시지 표시 로직이 있으므로, 
            여기서는 error 상태가 있더라도 폼을 계속 렌더링하도록 함.
            BannerForm이 항상 렌더링되도록 조건 없이 배치. */}
        <BannerForm 
          editingBanner={editingBanner}
          onAdd={handleAddBanner}
          onUpdate={handleUpdateBanner}
          onCancelEdit={cancelEditing} 
        />
      </div>

      {/* 배너 목록 */}
      <div>
        {/* 목록 로딩 중일 때만 메시지 표시 */}
        {loading && <p>배너 목록을 불러오는 중...</p>}
        
        {/* fetchBanners 과정에서 발생한 에러 메시지 표시 부분 제거.
            폼 제출 에러는 BannerForm 내부에서 처리되며,
            목록 로딩 에러는 loading 상태와 함께 처리되거나,
            더 정교한 에러 핸들링이 필요할 경우 별도 컴포넌트에서 처리. */}
        {/* {error && (
            <p className="text-red-500 text-center py-4">배너 목록을 불러오는 중 오류가 발생했습니다: {error}</p>
        )} */}

        {/* 로딩 중이 아닐 때 항상 목록을 표시 (에러가 있더라도) */}
        {!loading && (
          <BannerList
            banners={banners}
            onEdit={startEditing}
            onDelete={handleDeleteBanner}
            onToggleActive={handleToggleActive}
            onChangeOrder={handleChangeOrder}
          />
        )}
      </div>
    </div>
  );
};

export default BannerManager;
