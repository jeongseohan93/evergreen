import React from 'react';
// import { Header, Footer, SubHeader} from '@/app';
import  CategoryManager  from './categoryPage/CategoryManager';
import AdminLayout from '../layouts/AdminLayout';

const DashBoardPage = () => {
    return (
        
         <AdminLayout>
       
            <h1 className="text-3xl font-bold text-gray-800 mb-6">관리자 대시보드</h1>
       

    
               <CategoryManager />

                </AdminLayout>
     )
        
};

export default DashBoardPage;