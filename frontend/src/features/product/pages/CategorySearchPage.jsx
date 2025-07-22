// CategorySearchPage.jsx (수정)

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header, Footer, SubHeader} from '@/app';
import BrandHeader from "../components/BrandHeader/BrandHeader"; 
import Pagination from "@/shared/components/Pagination/Pagination";

// ⭐️ 상품 검색 API 함수 임포트 - searchProductsApi로 통일
import { searchProductsApi } from '../api/ProductApi'; // 실제 파일 경로에 맞게 수정

// ⭐️ ProductCard 컴포넌트
import { ProductCard } from '@/shared'; 

// ⭐️ fullMenuItems 데이터
import { fullMenuItems } from '@/shared/contants/menuData'; 


const CategorySearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); 

    const [searchResults, setSearchResults] = useState([]); 
    const [totalResults, setTotalResults] = useState(0); 
    const [currentPage, setCurrentPage] = useState(1);      
    const itemsPerPage = 12; 

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const categoryName = searchParams.get('name') || ''; 
    const subCategoryName = searchParams.get('sub') || '';
    const sub2CategoryName = searchParams.get('sub2') || ''; // sub2 파라미터도 읽어와야 합니다.
    const page = parseInt(searchParams.get('page')) || 1;

    const headerTitle = sub2CategoryName 
        ? `${categoryName} > ${subCategoryName} > ${sub2CategoryName}` 
        : (subCategoryName ? `${categoryName} > ${subCategoryName}` : categoryName || "카테고리 검색 결과");

    // ⭐️ 검색 API 호출 및 결과 업데이트 로직 (실제 백엔드 통신)
    useEffect(() => {
        if (categoryName || subCategoryName || sub2CategoryName || page > 1) { 
            const fetchSearchResults = async () => {
                setLoading(true);
                setError(null);
                try {
                    // ⭐️ 실제 searchProductsApi 함수 호출
                    const response = await searchProductsApi({ 
                        query: '', // 카테고리 검색이므로 일반 검색어는 비워둡니다.
                        name: categoryName,      
                        sub: subCategoryName,    
                        sub2: sub2CategoryName,  
                        page: page,
                        limit: itemsPerPage
                    });

                    if (response.success) {
                        setSearchResults(response.products);
                        setTotalResults(response.totalCount);
                        setCurrentPage(response.currentPage); 
                    } else {
                        setError(response.message || '검색 결과를 불러오는데 실패했습니다.');
                        setSearchResults([]);
                        setTotalResults(0);
                    }
                } catch (err) { 
                    console.error("카테고리 상품 검색 오류:", err);
                    setError(err.response?.data?.message || '카테고리 상품 검색 중 서버 오류가 발생했습니다.');
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
            setCurrentPage(1);
            setLoading(false);
            setError(null);
        }
    }, [searchParams, itemsPerPage, categoryName, subCategoryName, sub2CategoryName]); 

    const handlePageChange = useCallback((newPage) => {
        let url = `?name=${encodeURIComponent(categoryName)}&page=${newPage}`;
        if (subCategoryName) url += `&sub=${encodeURIComponent(subCategoryName)}`;
        if (sub2CategoryName) url += `&sub2=${encodeURIComponent(sub2CategoryName)}`;
        
        navigate(url);
    }, [navigate, categoryName, subCategoryName, sub2CategoryName]);

    // ⭐️ BrandHeader에 전달할 '하위 카테고리 버튼' 데이터 생성 로직 (기존과 동일)
    const getSubCategoryButtons = useCallback(() => {
        let targetButtons = []; 
        const currentCategoryData = fullMenuItems.find(item => item.category === categoryName);

        if (!currentCategoryData) return []; 

        if (!subCategoryName && !sub2CategoryName) {
            targetButtons = currentCategoryData.subItems.map(item => 
                typeof item === 'string' ? { name: item, isGroup: false } : { name: item.name, isGroup: true }
            );
        } 
        else if (subCategoryName && !sub2CategoryName) {
            targetButtons = currentCategoryData.subItems.map(item => 
                typeof item === 'string' ? { name: item, isGroup: false } : { name: item.name, isGroup: true }
            );
        } 
        else if (sub2CategoryName) {
            const currentSubCategoryData = currentCategoryData.subItems.find(item => 
                typeof item !== 'string' && item.name === subCategoryName
            );
            if (currentSubCategoryData && currentSubCategoryData.subSubItems) {
                targetButtons = currentSubCategoryData.subSubItems.map(item => ({ name: item, isGroup: false }));
            }
        }
        
        return targetButtons;
    }, [categoryName, subCategoryName, sub2CategoryName]); 

    const subCategoryButtons = getSubCategoryButtons(); 

    const handleBrandHeaderSubCategoryClick = useCallback((clickedButtonName, isGroup) => {
        let url = `/categorysearch?name=${encodeURIComponent(categoryName)}`;

        if (clickedButtonName === categoryName && !subCategoryName && !sub2CategoryName) { 
             url = `/categorysearch?name=${encodeURIComponent(categoryName)}`;
        }
        else if (clickedButtonName === categoryName) { 
            url = `/categorysearch?name=${encodeURIComponent(categoryName)}`;
        }
        else if (sub2CategoryName) { 
             url += `&sub=${encodeURIComponent(subCategoryName)}`;
             url += `&sub2=${encodeURIComponent(clickedButtonName)}`;
        }
        else if (subCategoryName) { 
            if (isGroup) { 
                url += `&sub=${encodeURIComponent(clickedButtonName)}`; 
            } else { 
                url += `&sub=${encodeURIComponent(clickedButtonName)}`;
            }
        } else { 
            url += `&sub=${encodeURIComponent(clickedButtonName)}`;
        }
        navigate(url);
    }, [navigate, categoryName, subCategoryName, sub2CategoryName]);


    return (
        <>
            <Header />
            <SubHeader />
            <BrandHeader
                title={headerTitle} 
                currentCategoryName={categoryName} 
                currentSubCategoryName={subCategoryName} 
                currentSub2CategoryName={sub2CategoryName} 
                totalResultsForCurrentSearch={totalResults} 
                subCategoryButtons={subCategoryButtons} 
                onSubCategoryButtonClick={handleBrandHeaderSubCategoryClick} 
            />
            
            <div className="container mx-auto p-4">
                {loading && <div className="text-center text-gray-600 text-xl py-10">상품을 검색 중입니다...</div>}
                {error && <div className="text-center text-red-500 text-xl py-10">오류: {error}</div>}
                
                {!loading && !error && (
                    <>
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                                {searchResults.map(product => (
                                    <ProductCard
                                        key={product.product_id}
                                        productId={product.product_id}
                                        imageUrl={product.small_photo} 
                                        name={product.name}
                                        price={product.price}
                                        hashtags={product.brand ? [product.brand] : []} 
                                        likes={0} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-600 text-xl py-10">
                                {`"${headerTitle}"에 대한 검색 결과가 없습니다.`}
                            </div>
                        )}
                    </>
                )}
                
                {totalResults > 0 && (
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

export default CategorySearchPage;