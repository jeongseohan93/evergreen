import { useState, useEffect } from "react";
import { getAllReports, getReportById, createReport, updateReport, deleteReport, uploadImage } from '../../../api/reportApi';

const useReport = (options = {}) => {
  // 목록 관리
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 단일/작성/수정 관리
  const [report, setReport] = useState(null);
  const [title, setTitle] = useState(options.defaultTitle || "");
  const [contents, setContents] = useState(options.defaultContents || []);
  const [inputText, setInputText] = useState("");
  const [inputImage, setInputImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 목록 조회
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllReports();
      setReports(data);
      setFilteredReports(data);
    } catch (e) {
      setError('조행기 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 단일 조회
  const fetchReportById = async (reportId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReportById(reportId);
      setReport(data);
      setTitle(data.title || "");
      setContents(Array.isArray(data.contents) ? data.contents : []);
      return data;
    } catch (e) {
      setError('조행기 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 검색
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredReports(reports);
      return;
    }
    const filtered = reports.filter(report =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 삭제
  const handleDelete = async (reportId, onSuccess, onError) => {
    if (window.confirm('정말로 이 조행기를 삭제하시겠습니까?')) {
      try {
        await deleteReport(reportId);
        alert('조행기가 성공적으로 삭제되었습니다.');
        fetchReports();
        if (onSuccess) onSuccess();
      } catch (error) {
        alert('조행기 삭제 중 오류가 발생했습니다.');
        if (onError) onError(error);
      }
    }
  };

  // 글 추가
  const handleAddText = () => {
    if (inputText.trim()) {
      setContents([...contents, { type: 'text', value: inputText }]);
      setInputText('');
    }
  };

  // 이미지 추가 (서버 업로드/로컬)
  const handleImageChange = async (e, upload = false) => {
    const file = e.target.files[0];
    if (file) {
      if (upload) {
        try {
          const imageUrl = await uploadImage(file);
          setContents([...contents, { type: 'image', value: imageUrl }]);
        } catch (err) {
          alert('이미지 업로드에 실패했습니다.');
        }
      } else {
        const url = URL.createObjectURL(file);
        setContents([...contents, { type: 'image', value: url }]);
        setInputImage(null);
        setPreviewUrl(null);
      }
    }
  };

  // 미리보기용 이미지 선택
  const handlePreviewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 글/사진/이미지 삭제
  const handleRemoveContent = (idx) => {
    setContents(contents.filter((_, i) => i !== idx));
  };

  // 조행기 작성
  const handleCreate = async (navigate, onSuccess) => {
    if (!title.trim() || contents.length === 0) {
      alert('제목과 글/사진을 하나 이상 추가해주세요.');
      return;
    }
    setLoading(true);
    try {
      await createReport({ title, contents });
      alert('조행기가 성공적으로 작성되었습니다.');
      if (onSuccess) onSuccess();
      if (navigate) navigate('/admin/report');
    } catch (error) {
      alert('조행기 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 조행기 수정
  const handleUpdate = async (reportId, navigate, onSuccess) => {
    setLoading(true);
    setError(null);
    if (!title.trim() || contents.length === 0) {
      setError('제목과 글/사진을 하나 이상 추가해주세요.');
      setLoading(false);
      return;
    }
    try {
      await updateReport(reportId, { title, contents });
      if (onSuccess) onSuccess();
      if (navigate) navigate('/admin/report');
    } catch (err) {
      setError('조행기 수정에 실패했습니다.');
      setLoading(false);
    }
  };

  return {
    // 목록
    reports,
    filteredReports,
    searchTerm,
    setSearchTerm,
    handleSearch,
    handleKeyPress,
    handleDelete,
    fetchReports,
    // 단일
    report,
    fetchReportById,
    // 작성/수정/입력
    title,
    setTitle,
    contents,
    setContents,
    inputText,
    setInputText,
    inputImage,
    setInputImage,
    previewUrl,
    setPreviewUrl,
    handleAddText,
    handleImageChange,
    handlePreviewImage,
    handleRemoveContent,
    handleCreate,
    handleUpdate,
    // 상태
    loading,
    error,
    setError,
  };
};

export default useReport;
