// hooks/useFetchTerms.js
import { useState, useEffect } from 'react';

const useFetchTerms = (url) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) {
            setText('');
            return;
        }

        const controller = new AbortController();
        const { signal } = controller;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(url, { signal });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.text();
                setText(data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error(`데이터 불러오기 실패 (${url}):`, err);
                    setError(err);
                }
            } finally {
                // AbortError가 아닐 경우에만 로딩 상태를 false로 변경
                if (signal.aborted === false) {
                  setLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup 함수: 컴포넌트가 언마운트되거나 url이 변경될 때 요청을 취소합니다.
        return () => {
            controller.abort();
        };
    }, [url]);

    return { text, loading, error };
};

export default useFetchTerms;