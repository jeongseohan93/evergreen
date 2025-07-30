import React from 'react';
import { EvergreenLogo } from '@/shared';


const OrderHeader = () => {
    return(
        <div className="h-10 bg-black pl-10 pr-10 flex items-center"> {/* flex items-center 추가 */}
    <div>
        <EvergreenLogo fontSizeClass="text-2xl" />
    </div>
    <p className='text-white'>주문/결제</p>
</div>
    );
}

export default OrderHeader;