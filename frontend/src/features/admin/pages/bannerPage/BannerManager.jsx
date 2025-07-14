// frontend/src/features/admin/pages/bannerPage/BannerManager.jsx
import React, { useState } from 'react';
import useBannerManagement from '../../components/banner/hooks/useBannerManagement'; // 커스텀 훅 임포트
import BannerForm from './BannerForm'; // 새로 생성할 폼 컴포넌트 임포트
import BannerList from './BannerList'; // 새로 생성할 목록 컴포넌트 임포트

const BannerManager = () => {
  const {
    banners,
    loading,
    handleAddBanner,
    handleUpdateBanner,
    handleDeleteBanner,
    handleToggleActive,
    handleChangeOrder
  } = useBannerManagement();

  // 수정중인 배너 ID와 데이터 상태를 BannerManager에서 관리
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  // 배너별 이미지 미리보기 URL 상태
  const [previewUrl, setPreviewUrl] = useState({});

  const handleEditClick = (banner) => {
    setEditingId(banner.banner_id);
    setEditData({
      title: banner.title || '',
      link_url: banner.link_url || '',
      order: banner.order,
      is_active: banner.is_active,
      bannerImage: null,
    });
    setPreviewUrl(prev => ({ ...prev, [banner.banner_id]: null }));
  };
  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    setPreviewUrl({});
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'bannerImage' ? files[0] : value)
    }));
    // 이미지 미리보기 처리
    if (name === 'bannerImage' && files && files[0] && editingId) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(prev => ({ ...prev, [editingId]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else if (name === 'bannerImage' && editingId) {
      setPreviewUrl(prev => ({ ...prev, [editingId]: null }));
    }
  };
  const handleSave = (banner) => {
    handleUpdateBanner(banner.banner_id, editData);
    setEditingId(null);
    setEditData({});
    setPreviewUrl({});
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="text-4xl font-bold font-aggro mb-6">배너 관리</h1>
      <div className="mb-8">
        <BannerForm 
          onAdd={handleAddBanner}
          onUpdate={handleUpdateBanner}
        />
      </div>
      <div>
        {loading && <p>배너 목록을 불러오는 중...</p>}
        {!loading && (
          <BannerList
            banners={banners}
            onDelete={handleDeleteBanner}
            onToggleActive={handleToggleActive}
            onChangeOrder={handleChangeOrder}
            editingId={editingId}
            editData={editData}
            onEditClick={handleEditClick}
            onCancel={handleCancel}
            onInputChange={handleInputChange}
            onSave={handleSave}
            previewUrl={previewUrl}
          />
        )}
      </div>
    </div>
  );
};

export default BannerManager;
