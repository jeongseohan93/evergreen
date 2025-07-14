import React from 'react';

// props를 받을 때, 각 값이 없을 경우를 대비해 기본값을 = 0 과 같이 설정합니다.
const MyPointSummary = ({
  availablePoints = 0,
  totalPoints = 0,
  usedPoints = 0,
  totalOrders = { count: 0, times: 0 }, // 객체도 기본 형태를 지정해줍니다.
}) => {
    return (
        <div className="flex justify-around p-4 mb-8 bg-gray-100 rounded-lg">
            <div>
                <p className="text-sm text-gray-600">가용 적립금</p>
                {/* 이제 이 값들은 절대 undefined가 아니므로 에러가 발생하지 않습니다. */}
                <p className="text-lg font-bold">{availablePoints.toLocaleString()}원</p>
            </div>
            <div>
                <p className="text-sm text-gray-600">누적 적립금</p>
                <p className="text-lg font-bold">{totalPoints.toLocaleString()}원</p>
            </div>
            <div>
                <p className="text-sm text-gray-600">사용 적립금</p>
                <p className="text-lg font-bold">{usedPoints.toLocaleString()}원</p>
            </div>
            <div>
                <p className="text-sm text-gray-600">총 주문</p>
                <p className="text-lg font-bold">{totalOrders.count} ({totalOrders.times}회)</p>
            </div>
        </div>
    );
};

export default MyPointSummary;