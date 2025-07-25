import React from 'react';

const HomeHeader = ({title, title2}) => {

    return(
        // flex 컨테이너로 만들고, justify-center와 items-center를 사용하여 가운데 정렬
        // 기존 h-24는 높이 유지, w-full은 너비 유지
        // pl-16과 pt-12는 제거하거나 필요에 따라 조절
         <div className='h-24 w-full flex flex-col justify-center items-center gap-1'>
            <p className='text-2xl font-aggro font-medium'>{title}</p>
            <p className='text-xl font-aggro font-light'>{title2}</p>
        </div>
    )
}

export default HomeHeader;