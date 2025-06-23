import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  console.log('[SearchBar] 렌더링!');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // 폼 기본 동작 방지
    const trimmed = searchTerm.trim(); // ✅ 먼저 고정

    if (trimmed === '') {
      alert('검색어를 입력해주세요.');
      return;
    }

    console.log('검색어 (입력 그대로):', searchTerm);
    console.log('검색어 (trim 적용):', trimmed);

    alert(`"${searchTerm}"(으)로 검색합니다!`);

    navigate(`/search?query=${encodeURIComponent(searchTerm)}`); // ✅ 안전하게 navigate
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full max-w-md mx-auto mt-8"> {/* ✅ form 태그 추가 */}
      <div className="relative w-full flex items-center border-b border-gray-400 focus-within:border-blue-500">
        <input
          type="text"
          className="w-full h-10 px-2 py-1 bg-transparent focus:outline-none"
          placeholder="검색어를 입력하세요..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button
          type="submit" // ✅ type을 "submit"으로 변경
          className="absolute right-0 p-2 text-gray-500 hover:text-gray-700"
        >
          <FaSearch className="text-xl" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
