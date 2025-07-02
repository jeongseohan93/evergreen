import React from 'react';

const DescriptionTags = ({ tags }) => {
    return (
        <div className="mb-4">
            <p className="text-sm text-gray-600 font-medium">상품간략설명</p>
            <div className="flex flex-wrap mt-1">
                {tags && tags.map((tag, index) => (
                    <span key={index} className="text-blue-600 text-sm mr-2">#{tag}</span>
                ))}
            </div>
        </div>
    );
};

export default DescriptionTags;