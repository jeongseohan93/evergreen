import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Headers from '../../components/layouts/Headers/Header';
import SubHeader from '../../components/layouts/Headers/SubHeader';
import Footer from '../../components/layouts/Footers/Footer';
 
function SearchPage() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  return (
    <>
    <Headers />
    <SubHeader />
    <div className='h-96'>{name ? `${name}` : '검색 페이지'}</div>
    <Footer />
    </>
  )
}

export default SearchPage;