// SearchPage.jsx (수정)
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import { Header, Footer, SubHeader} from '@/app';
import ProductSearchBar from "../components/ProductSearchBar/ProductSearchBar"; // 경로 확인
import CardBundle from "@/features/home/components/CardBundle/CardBundle";
import Pagination from "@/shared/components/Pagination/Pagination";

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate 훅 사용

    // 검색 입력 필드의 현재 값을 관리하는 상태.
    // URL 쿼리와 동기화되어야 하므로 useEffect에서 설정.
    const [searchTermInInput, setSearchTermInInput] = useState(''); 

    useEffect(() => {
        console.log('[SearchPage] useEffect 실행됨');
        console.log('[SearchPage] searchParams:', searchParams.toString());
        
        const query = searchParams.get('query');
        console.log('[SearchPage] 추출된 query:', query);
        
        // URL에서 'query' 파라미터를 받으면 입력 필드에 그 값을 설정합니다.
        if (query) {
            setSearchTermInInput(query);
            console.log(`현재 페이지에서 "${query}" 검색어를 입력 필드에 표시합니다.`);
        } else {
            setSearchTermInInput('');
            console.log('[SearchPage] query 파라미터가 없습니다.');
        }
    }, [searchParams]);

    // 🚨 ProductSearchBar에서 검색 버튼 클릭 시 호출될 실제 검색 핸들러 함수
    const handleSearchExecution = (newSearchTerm) => {
        console.log(`[SearchPage] 검색 실행 요청: "${newSearchTerm}"`);
        // 여기에서 실제로 API 호출을 하거나, 검색 결과 페이지로 이동 등의 로직을 수행합니다.
        // 예를 들어, 검색어를 URL 쿼리 파라미터에 업데이트하여 페이지를 다시 로드할 수 있습니다.
        navigate(`?query=${encodeURIComponent(newSearchTerm)}`);
        // setSearchTermInInput(newSearchTerm); // URL 업데이트 후 useEffect가 다시 실행되며 이 값도 업데이트될 것임
    };

    console.log('[SearchPage] 렌더링됨, searchTermInInput:', searchTermInInput);

    return (
        <>
            <Header />
            <SubHeader />

            {/* 🚨 onSearch prop으로 함수를 전달하고, value prop을 추가합니다. */}
            <ProductSearchBar
                value={searchTermInInput} // URL에서 받은 검색어를 input 필드에 표시
                onSearch={handleSearchExecution} // 검색 실행 함수를 전달
            />
            
            {/* 여기에 검색 결과를 표시할 컴포넌트가 올 수 있습니다. */}
            {/* 예: <SearchResults query={searchTermInInput} /> */}

            <CardBundle />
            <CardBundle />

            <Pagination />

            <Footer />
        </>
    );
};

export default SearchPage;