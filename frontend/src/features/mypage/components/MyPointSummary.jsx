import React from 'react';

const MyPointSummary = ({ availablePoints, totalPoints, usedPoints, totalOrders }) => {
    return (
        <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
            {/* 왼쪽 MY PAGE 타이틀 (이미지에도 보임) */}
            {/* <div className="p-6 md:border-r border-gray-200 flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-800">MY PAGE</h1>
                <p className="text-lg text-gray-600">마이페이지</p>
            </div> */}

            {/* 오른쪽 포인트 및 주문 정보 */}
            <div className="p-6 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* 가용적립금 */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-700">
                            <span className="text-xl font-semibold mr-2">가용적립금</span>
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9.293 9.293a1 1 0 000 1.414L10.586 12H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 00-1.414 0z" clipRule="evenodd"></path></svg>
                        </div>
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-gray-800">{availablePoints.toLocaleString()}원</span>
                            <button className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200">조회</button>
                        </div>
                    </div>

                    {/* 총적립금 */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-700">
                            <span className="text-xl font-semibold mr-2">총적립금</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">{totalPoints.toLocaleString()}원</span>
                    </div>

                    {/* 사용적립금 */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-700">
                            <span className="text-xl font-semibold mr-2">사용적립금</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">{usedPoints.toLocaleString()}원</span>
                    </div>

                    {/* 총주문 */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-700">
                            <span className="text-xl font-semibold mr-2">총주문</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">{totalOrders.count}({totalOrders.times}회)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPointSummary;