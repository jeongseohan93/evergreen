import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useBoardManagement from '@/features/admin/components/board/hooks/useBoardManagement';
import { getRepliesByBoardId, createReply, updateReply, deleteReply } from '@/features/admin/api/replyApi';

export const usePostManagement = () => {
    const { user } = useSelector(state => state.auth);
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [currentBoardType, setCurrentBoardType] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [replies, setReplies] = useState([]);
    const [repliesLoading, setRepliesLoading] = useState(false);
    const [repliesError, setRepliesError] = useState(null);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editingReplyContent, setEditingReplyContent] = useState('');
    const [newReplyContent, setNewReplyContent] = useState('');

    const {
        boards,
        selectedBoard,
        loading,
        error,
        fetchBoards,
        fetchBoardById,
        addBoard,
        modifyBoard,
        removeBoard,
        setSelectedBoard,
    } = useBoardManagement();

    // 현재 로그인한 사용자가 작성한 게시글만 필터링
    const myBoards = boards.filter(board => 
        board.User && board.User.user_uuid === user?.user_uuid
    );

    // 게시글 목록 가져오기
    useEffect(() => {
        if (currentBoardType === 'notice') {
            fetchBoards('', searchKeyword, 'Y');
        } else {
            fetchBoards(currentBoardType, searchKeyword, '');
        }
    }, [currentBoardType, searchKeyword, fetchBoards]);

    // 게시글 선택 핸들러
    const handleSelectBoard = async (boardId) => {
        try {
            setRepliesLoading(true);
            setRepliesError(null);
            
            await fetchBoardById(boardId);
            
            // 댓글 가져오기
            const repliesResult = await getRepliesByBoardId(boardId);
            if (repliesResult.success) {
                setReplies(repliesResult.data);
            } else {
                setRepliesError(repliesResult.message);
                setReplies([]);
            }
        } catch (err) {
            console.error('게시글 상세 조회 실패:', err);
            setRepliesError('게시글을 불러오는데 실패했습니다.');
        } finally {
            setRepliesLoading(false);
        }
    };

    // 새 게시글 작성
    const handleNewBoardClick = () => {
        setSelectedBoard(null);
        setShowForm(true);
        setShowDetail(false);
    };

    // 게시글 수정
    const handleEditBoardClick = () => {
        setShowForm(true);
        setShowDetail(false);
    };

    // 게시글 저장
    const handleSaveBoard = async (formData) => {
        if (!user?.user_uuid) {
            alert('로그인한 사용자 정보를 찾을 수 없습니다.');
            return;
        }

        let result;
        const dataToSend = { ...formData, user_id: user.user_uuid };

        if (selectedBoard) {
            // 수정
            result = await modifyBoard(selectedBoard.board_id, dataToSend);
        } else {
            // 새 게시글 작성
            result = await addBoard(dataToSend);
        }

        if (result.success) {
            alert(result.message);
            setShowForm(false);
            setShowDetail(false);
            setSelectedBoard(null);
            // 목록 새로고침
            if (currentBoardType === 'notice') {
                fetchBoards('', searchKeyword, 'Y');
            } else {
                fetchBoards(currentBoardType, searchKeyword, '');
            }
        } else {
            alert(result.message);
        }
    };

    // 게시글 삭제
    const handleDeleteBoard = async (boardId) => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            const result = await removeBoard(boardId);
            if (result.success) {
                alert(result.message);
                setShowDetail(false);
                setSelectedBoard(null);
            } else {
                alert(result.message);
            }
        }
    };

    // 목록으로 돌아가기
    const handleCancel = () => {
        setShowForm(false);
        setShowDetail(false);
        setSelectedBoard(null);
        setReplies([]);
        setEditingReplyId(null);
        setEditingReplyContent('');
        setNewReplyContent('');
        setRepliesError(null);
    };

    // 게시판 타입 변경
    const handleChangeBoardType = (boardType) => {
        setCurrentBoardType(boardType);
        setSearchKeyword('');
    };

    // 검색 관련 핸들러들
    const handleSearchInputChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleSearch = () => {
        // 검색은 이미 useEffect에서 처리됨
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleResetSearch = () => {
        setSearchKeyword('');
    };

    // 댓글 관련 핸들러들
    const handleEditReply = (reply) => {
        setEditingReplyId(reply.reply_id);
        setEditingReplyContent(reply.content);
    };

    const handleSaveEditedReply = async (replyId) => {
        if (!user?.user_uuid) {
            alert('로그인한 사용자 정보를 찾을 수 없습니다.');
            return;
        }
        try {
            const result = await updateReply(replyId, { 
                content: editingReplyContent,
                user_id: user.user_uuid 
            });
            if (result.success) {
                const updatedReplies = await getRepliesByBoardId(selectedBoard.board_id);
                if (updatedReplies.success) {
                    setReplies(updatedReplies.data);
                }
                setEditingReplyId(null);
                setEditingReplyContent('');
            } else {
                console.error('댓글 수정 실패:', result.message);
                alert('댓글 수정에 실패했습니다: ' + result.message);
            }
        } catch (err) {
            console.error('댓글 수정 실패:', err);
            alert('댓글 수정 중 오류가 발생했습니다.');
        }
    };

    const handleCancelEditReply = () => {
        setEditingReplyId(null);
        setEditingReplyContent('');
    };

    const handleDeleteReply = async (replyId) => {
        if (!user?.user_uuid) {
            alert('로그인한 사용자 정보를 찾을 수 없습니다.');
            return;
        }
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            try {
                const result = await deleteReply(replyId);
                if (result.success) {
                    const updatedReplies = await getRepliesByBoardId(selectedBoard.board_id);
                    if (updatedReplies.success) {
                        setReplies(updatedReplies.data);
                    }
                } else {
                    console.error('댓글 삭제 실패:', result.message);
                    alert('댓글 삭제에 실패했습니다: ' + result.message);
                }
            } catch (err) {
                console.error('댓글 삭제 실패:', err);
                alert('댓글 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleAddReply = async () => {
        if (!newReplyContent.trim()) return;
        if (!user?.user_uuid) {
            alert('로그인한 사용자 정보를 찾을 수 없습니다.');
            return;
        }
        try {
            const result = await createReply(selectedBoard.board_id, { 
                content: newReplyContent,
                user_id: user.user_uuid 
            });
            if (result.success) {
                const updatedReplies = await getRepliesByBoardId(selectedBoard.board_id);
                if (updatedReplies.success) {
                    setReplies(updatedReplies.data);
                }
                setNewReplyContent('');
            } else {
                console.error('댓글 추가 실패:', result.message);
                alert('댓글 작성에 실패했습니다: ' + result.message);
            }
        } catch (err) {
            console.error('댓글 추가 실패:', err);
            alert('댓글 작성 중 오류가 발생했습니다.');
        }
    };

    const handleReplyInputFocus = () => {
        // 로그인 체크 등의 로직이 필요하다면 여기에 추가
    };

    // selectedBoard가 변경될 때 selectedReview 업데이트
    useEffect(() => {
        if (selectedBoard) {
            setShowDetail(true);
            setShowForm(false);
        }
    }, [selectedBoard]);

    return {
        // 상태
        user,
        showForm,
        showDetail,
        currentBoardType,
        searchKeyword,
        replies,
        repliesLoading,
        repliesError,
        editingReplyId,
        editingReplyContent,
        newReplyContent,
        myBoards,
        selectedBoard,
        loading,
        error,
        
        // 게시글 관련 핸들러
        handleSelectBoard,
        handleNewBoardClick,
        handleEditBoardClick,
        handleSaveBoard,
        handleDeleteBoard,
        handleCancel,
        handleChangeBoardType,
        
        // 검색 관련 핸들러
        handleSearchInputChange,
        handleSearch,
        handleKeyPress,
        handleResetSearch,
        
        // 댓글 관련 핸들러
        handleEditReply,
        handleSaveEditedReply,
        handleCancelEditReply,
        handleDeleteReply,
        handleAddReply,
        handleReplyInputFocus,
        
        // 상태 설정 함수
        setNewReplyContent,
        setEditingReplyContent,
        fetchBoards,
    };
};
