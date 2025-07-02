import React from 'react';
import ReviewCard from './ReviewCard';
import tempImage from '@/assets/image/temp.png'

const ReviewBundle = () => {

    return(
        <div className='flex flex-row'>
            <ReviewCard imageUrl={tempImage} />
            <ReviewCard imageUrl={tempImage} />
            <ReviewCard imageUrl={tempImage} />
            <ReviewCard imageUrl={tempImage} />
            <ReviewCard imageUrl={tempImage} />
        </div>
    );
}

export default ReviewBundle;