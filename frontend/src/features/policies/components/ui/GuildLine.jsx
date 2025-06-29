import React from 'react';
import ContentTabs from '../ContentTabs/ContentTabs'
import { guidelineTabList } from '../contants/guidelineTabList';

const GuidelinePage = () => {
  return (
    <div className="mt-10">
      <ContentTabs tabs={guidelineTabList} />
    </div>
  );
};

export default GuidelinePage;
