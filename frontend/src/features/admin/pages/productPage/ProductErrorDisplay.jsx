// features/admin/product/components/ProductErrorDisplay.jsx
import React from 'react';

 const ProductErrorDisplay = ({ error }) => {
    if (!error) return null;
    return (
        <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '15px', padding: '10px', border: '1px solid red', borderRadius: '5px', backgroundColor: '#ffe6e6' }}>
            오류: {error}
        </div>
    );
};

export default ProductErrorDisplay;