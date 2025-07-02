import React from 'react';

const ShippingDetails = ({ domesticInternational, method, cost, freeShippingCondition }) => {
    return (
        <div className="text-sm text-gray-700 mb-4">
            <p>국내·해외배송 <span className="font-bold">{domesticInternational}</span></p>
            <p>배송방법 <span className="font-bold">{method}</span></p>
            <p>배송비 <span className="font-bold">{cost.toLocaleString()}원</span> ({freeShippingCondition})</p>
        </div>
    );
};

export default ShippingDetails;