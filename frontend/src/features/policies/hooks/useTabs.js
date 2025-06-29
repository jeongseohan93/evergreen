// hooks/useTabs.js
import { useState, useMemo } from "react";
import useFetchTerms from "./useFetchTerms";

const useTabs = ({ tabs = [], defaultFile }) => {
    // defaultFile과 일치하는 탭을 찾거나, 없으면 첫 번째 탭을 초기값으로 설정합니다.
    // useMemo를 사용하여 tabs나 defaultFile이 변경될 때만 이 계산을 수행합니다.
    const initialTab = useMemo(() => 
        tabs.find(tab => tab.file === defaultFile) || tabs[0] || null
    , [tabs, defaultFile]);

    const [selectedTab, setSelectedTab] = useState(initialTab);
    
    // 선택된 탭이 없을 경우를 대비하여 옵셔널 체이닝(?.) 사용
    const { text, loading, error } = useFetchTerms(selectedTab?.file);

    // tabs 배열이 외부에서 변경되었을 때, 현재 선택된 탭이 더 이상 유효하지 않으면 초기 탭으로 리셋합니다.
    // 이는 동적으로 탭 목록이 변경되는 경우를 대비한 방어 코드입니다.
    if (initialTab && selectedTab && !tabs.some(tab => tab.file === selectedTab.file)) {
        setSelectedTab(initialTab);
    }

    return { 
        selectedTab, 
        setSelectedTab, 
        content: text, 
        isLoading: loading, 
        error 
    };
};

export default useTabs;