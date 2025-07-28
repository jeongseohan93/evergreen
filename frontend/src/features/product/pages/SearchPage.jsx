// src/features/search/pages/SearchPage.jsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header, Footer, SubHeader} from '@/app';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';
import ProductSearchBar from "../components/ProductSearchBar/ProductSearchBar";
import Pagination from "@/shared/components/Pagination/Pagination";

// ⭐️ 상품 검색 API 함수 임포트
import { searchProductsApi } from '../api/ProductApi'; // 실제 파일 경로에 맞게 수정

// ⭐️ ProductCard 컴포넌트 임포트
import { ProductCard } from '@/shared'; // ⭐️ ProductCard 컴포넌트의 실제 경로로 수정하세요!
// 예시: import ProductCard from '@/features/product/components/ProductCard/ProductCard';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [searchTermInInput, setSearchTermInInput] = useState(''); 
    const [searchResults, setSearchResults] = useState([]); 
    const [totalResults, setTotalResults] = useState(0); 
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 12;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const query = searchParams.get('query') || '';
        const page = parseInt(searchParams.get('page')) || 1; 

        setSearchTermInInput(query);
        setCurrentPage(page);

        if (query || page > 1) { 
            const fetchSearchResults = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await searchProductsApi({ 
                        query: query,
                        page: page,
                        limit: itemsPerPage
                    });

                    if (response.success) {
                        setSearchResults(response.products);
                        setTotalResults(response.totalCount);
                    } else {
                        setError(response.message || '검색 결과를 불러오는데 실패했습니다.');
                        setSearchResults([]);
                        setTotalResults(0);
                    }
                } catch (err) {
                    console.error("상품 검색 오류:", err);
                    setError(err.response?.data?.message || '상품 검색 중 서버 오류가 발생했습니다.');
                    setSearchResults([]);
                    setTotalResults(0);
                } finally {
                    setLoading(false);
                }
            };
            fetchSearchResults();
        } else {
            setSearchResults([]);
            setTotalResults(0);
            setLoading(false);
            setError(null);
        }
    }, [searchParams, itemsPerPage]);

    const handleSearchExecution = (newSearchTerm) => {
        navigate(`?query=${encodeURIComponent(newSearchTerm)}&page=1`);
    };

    const handlePageChange = (newPage) => {
        const currentQuery = searchParams.get('query') || '';
        navigate(`?query=${encodeURIComponent(currentQuery)}&page=${newPage}`);
    };

    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />
            <ProductSearchBar
                value={searchTermInInput}
                onSearch={handleSearchExecution}
            />
            
            <div className="container mx-auto p-4">
                {loading && <div className="text-center text-gray-600 text-xl py-10">상품을 검색 중입니다...</div>}
                {error && <div className="text-center text-red-500 text-xl py-10">오류: {error}</div>}
                
                {/* 검색 결과 표시 */}
                {!loading && !error && (
                    <>
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                                {searchResults.map(product => (
                                    // ⭐️ 여기에 ProductCard 컴포넌트를 사용합니다.
                                    <ProductCard
                                        key={product.product_id}
                                        productId={product.product_id}
                                        imageUrl={product.small_photo} // Product 모델의 small_photo 필드 사용
                                        name={product.name}
                                        price={product.price}
                                        // ⭐️ hashtags는 Product 모델의 brand 필드를 배열로 만들어 사용 (없으면 빈 배열)
                                        hashtags={product.brand ? [product.brand] : []} 
                                        likes={0} // 좋아요 데이터가 없으므로 0으로 설정 (또는 pick 필드를 사용)
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-600 text-xl py-10">
                                {searchTermInInput ? `"${searchTermInInput}"에 대한 검색 결과가 없습니다.` : "검색어를 입력하여 상품을 찾아보세요."}
                            </div>
                        )}
                    </>
                )}
                
                {/* 페이지네이션 컴포넌트 */}
                {!loading && !error && totalResults > 0 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalResults}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default SearchPage;