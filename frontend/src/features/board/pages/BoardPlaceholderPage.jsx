import React from 'react';
import { Header, SubHeader, Footer } from '@/app';

const BoardPlaceholderPage = ({ title }) => {
  return (
    <>
      <Header />
      <SubHeader />
      <main className="flex flex-col items-center justify-center min-h-[400px] bg-white">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-gray-500">아직 준비 중입니다.</p>
      </main>
      <Footer />
    </>
  );
};

export default BoardPlaceholderPage; 