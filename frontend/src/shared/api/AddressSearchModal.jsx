// src/shared/api/AddressSearchModal.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const AddressSearchModal = ({ onSelect, onClose }) => {
  useEffect(() => {
    let popupWindow = null;

    const handleMessage = (event) => {
      console.log("메인 창: PostMessage event received:", event);
      console.log("메인 창: Event origin:", event.origin);
      console.log("메인 창: Event data:", event.data);

      // ⭐⭐⭐ 여기를 다시 확인하고 수정! ⭐⭐⭐
      const allowedOrigins = [
          window.location.origin,       // 너의 React 앱의 현재 Origin (예: http://localhost:3000)
          'https://business.juso.go.kr',// 주소 API 팝업의 실제 Origin (PostMessage가 여기에서 올 수 있음)
          'http://localhost:3005'       // 만약 백엔드 서버의 Origin이 포함되어야 한다면 추가
                                        // (이번 경우엔 백엔드가 스크립트를 반환하므로 주소API Origin일 가능성 높음)
      ];

      if (!allowedOrigins.includes(event.origin)) {
          console.warn('메인 창: PostMessage: Unknown origin - Ignoring message:', event.origin);
          return;
      }

      // `event.data`에 `type: 'juso_selected'`가 있는지 확인
      if (event.data && event.data.type === 'juso_selected') {
        const addressData = event.data.data; // 실제 주소 데이터는 `data` 속성 안에 있음
        console.log('메인 창: AddressSearchModal: Received address data via postMessage - Final check:', addressData);

        onSelect({
          zipCode: addressData.zipCode,
          addressMain: addressData.addressMain,
          addressDetail: addressData.addressDetail,
          roadFullAddr: addressData.roadFullAddr,
          jibunAddr: addressData.jibunAddr,
          engAddr: addressData.engAddr,
          siNm: addressData.siNm,
          sggNm: addressData.sggNm,
          emdNm: addressData.emdNm,
          rn: addressData.rn,
          // 필요시 다른 필드도 여기에 추가
        });

        onClose();
        if (popupWindow) {
          popupWindow.close();
        }
      }
    };

    window.addEventListener('message', handleMessage);

    const openJusoPopup = () => {
      const width = 570;
      const height = 420;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const jusoApiUrl = `https://business.juso.go.kr/addrlink/addrLinkUrl.do`;
      const params = new URLSearchParams({
        confmKey: "devU01TX0FVVEgyMDI1MDcyMTIxNTc0OTExNTk2NzA=",
        returnUrl: "http://localhost:3005/mypage/juso-api-callback", // 백엔드 라우터 URL
        resultType: "4", // 이 값은 주소 API 가이드를 따르세요.
      }).toString();

      const url = `${jusoApiUrl}?${params}`;
      popupWindow = window.open(url, "jusoPopup", `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`);
    };

    openJusoPopup();

    return () => {
      window.removeEventListener('message', handleMessage);
      if (popupWindow) {
        popupWindow.close();
      }
    };
  }, [onSelect, onClose]);

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p>주소 검색 팝업이 열렸습니다.</p>
        <p>팝업에서 주소를 검색해주세요.</p>
        <button onClick={onClose} style={{ marginTop: '10px', padding: '5px 10px' }}>닫기</button>
      </div>
    </div>,
    document.body
  );
};

export default AddressSearchModal;