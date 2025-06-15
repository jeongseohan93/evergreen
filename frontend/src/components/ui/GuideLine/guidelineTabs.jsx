import React from 'react';
import ContentTabs from '../../commons/ContentTabs';

const guidelineTabs = [
    { label: '회원안내', file: '/aggreement/guide/guide-member-info.txt' },
    { label: '주문안내', file: '/aggreement/guide/guide-order-info.txt' },
    { label: '결제안내', file: '/aggreement/guide/guide-payment-info.txt' },
    { label: '배송안내', file: '/aggreement/guide/guide-shipping-info.txt' },
    { label: '교환/반품안내', file: '/aggreement/guide/guide-return-exchange-info.txt' },
    { label: '환불안내', file: '/aggreement/guide/guide-refund-info.txt' },
    { label: '기타안내', file: '/aggreement/guide/guide-etc-info.txt' },
  ];

const GuidelinePage = () => {
  return (
    <div className="mt-10">
      <ContentTabs tabs={guidelineTabs} />
    </div>
  );
};

export default GuidelinePage;
