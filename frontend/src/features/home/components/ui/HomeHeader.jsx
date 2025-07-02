import React from 'react';


const HomeHeader = ({title}) => {

    return(
        <div className='h-24 w-full pl-16 pt-12'>
            <p className='text-2xl font-aggro font-medium'>{title}</p>
        </div>
    )
}

export default HomeHeader;