// features/admin/product/components/ProductLoadingSpinner.jsx
import React from 'react';

const ProductLoadingSpinner = ({ loading }) => {
    if (!loading) return null;
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ fontSize: '1.2em', color: '#555' }}>데이터를 불러오는 중...</p>
            {/* 여기에 실제 로딩 스피너 UI (CSS 애니메이션 등) 추가 */}
            <div style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                animation: 'spin 1s linear infinite',
                margin: '10px auto'
            }}></div>
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ProductLoadingSpinner;