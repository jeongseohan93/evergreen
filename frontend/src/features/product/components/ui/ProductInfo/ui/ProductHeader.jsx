import React from 'react';

const ProductHeader = ({ name }) => {
    return (
        <h1 className="text-2xl font-bold mb-4">{name}</h1>
    );
};

export default ProductHeader;