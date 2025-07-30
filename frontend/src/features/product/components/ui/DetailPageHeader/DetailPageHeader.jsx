import React from 'react';
import { Link } from 'react-router-dom';


const DetailPageHeader = ({title}) => {

    return (
        <div className='flex items-center gap-2 text-sm'> {/* text-sm 추가 */}
        <Link to='/' className='text-gray-500'>Home {'>'} </Link>
        <span>{title}</span>
        </div>
    )
}

export default DetailPageHeader;