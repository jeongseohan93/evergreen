import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header, Footer, SubHeader} from '@/app';

const SearchPage = () => {
    const [searchParams] = useSearchParams(); // URL의 쿼리 파라미터를 가져옵니다.
    const [displayQuery, setDisplayQuery] = useState(''); // 화면에 보여줄 검색어 상태

    useEffect(() => {
        console.log('[SearchPage] useEffect 실행됨');
        console.log('[SearchPage] searchParams:', searchParams.toString());
        
        // 'query'라는 이름의 파라미터 값을 가져옵니다.
        const query = searchParams.get('query');
        console.log('[SearchPage] 추출된 query:', query);
        
        if (query) {
            setDisplayQuery(query);
            console.log(`현재 페이지에서 "${query}" 검색어를 표시합니다.`);
            // 여기서 실제로 검색 API를 호출하여 결과를 가져오고 싶다면 여기에 추가
            // (지금은 검색어만 표시하는 데 집중)
        } else {
            setDisplayQuery('');
            console.log('[SearchPage] query 파라미터가 없습니다.');
        }
    }, [searchParams]); // searchParams가 변경될 때마다 useEffect 재실행

    console.log('[SearchPage] 렌더링됨, displayQuery:', displayQuery);

    return (
        <>
            <Header />
            <SubHeader />

            <h1>검색 페이지</h1>
            {displayQuery ? (
            <p className="text-xl">
            당신이 검색한 키워드: <span className="font-semibold text-blue-600">'{displayQuery}'</span>
            </p>
            ) : (
            <p>검색어를 입력해 주세요.</p>
            )}

            <Footer />
        </>
    );
};

export default SearchPage;