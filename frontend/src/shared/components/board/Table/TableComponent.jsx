// src/shared/components/Table/TableComponent.jsx
import React from 'react';

const TableComponent = ({ headers, data, className }) => {
    return (
        <div className={`overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm ${className || ''}`}>
            <table className="min-w-full divide-y divide-gray-200">
                {/* 테이블 헤더 */}
                <thead className="bg-gray-50">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={header.key || index} // key는 고유해야 합니다.
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                {/* 테이블 바디 */}
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={row.id || rowIndex} className="hover:bg-gray-50">
                                {headers.map((header, colIndex) => (
                                    <td
                                        key={header.key || colIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {/* 스크린샷처럼 특정 컬럼에 HIT 태그 등이 붙는다면
                                            header.key와 row[header.key]를 조합하여 조건부 렌더링 로직 추가 가능 */}
                                        {header.key === 'title' && row.isNotice ? (
                                            <span className="inline-flex items-center">
                                                {row[header.key]}
                                                {row.isHit && (
                                                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                                        HIT
                                                    </span>
                                                )}
                                            </span>
                                        ) : (
                                            row[header.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                검색 결과가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableComponent;