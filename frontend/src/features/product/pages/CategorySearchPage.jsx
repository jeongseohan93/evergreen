// CategorySearchPage.jsx (수정)
import React, { useEffect, useState } from "react"; // useEffect, useState 추가 (로딩/데이터 처리에 필요할 수 있으나, 지금은 단순 전달)
import { useSearchParams } from "react-router-dom"; // 🚨 useSearchParams 훅 임포트
import { Header, Footer, SubHeader} from '@/app';
import BrandHeader from "../components/BrandHeader/BrandHeader";
import CardBundle from "@/features/home/components/CardBundle/CardBundle";
import Pagination from "@/shared/components/Pagination/Pagination";

const CategorySearchPage = () => {
    // 🚨 useSearchParams 훅을 사용하여 URL 쿼리 파라미터를 가져옵니다.
    const [searchParams] = useSearchParams();

    // 🚨 'name'이라는 이름의 쿼리 파라미터 값을 가져옵니다.
    const categoryName = searchParams.get('name'); 

    // 하드코딩된 title 값 대신 categoryName을 BrandHeader에 전달합니다.
    const headerTitle = categoryName || "검색 결과"; // name 파라미터가 없으면 기본값 설정

    return (
        <>
            <Header />
            <SubHeader />
            {/* 🚨 BrandHeader에 categoryName을 prop으로 전달합니다. */}
            <BrandHeader title={headerTitle} />
            
            <CardBundle />
            <CardBundle />

            <Pagination />

            
            <Footer />
        </>
    );
};

export default CategorySearchPage;