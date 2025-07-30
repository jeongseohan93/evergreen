import React from 'react';
import SharedBoardList from '@/shared/components/board/SharedBoardList';
import SharedBoardDetail from '@/shared/components/board/SharedBoardDetail';
import SharedBoardForm from '@/shared/components/board/SharedBoardForm';
import { usePostManagement } from '../api/post';

const PostManagementPage = () => {
    const {
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
    } = usePostManagement();

    return (
        <div className="p-5 max-w-7xl mx-auto font-light text-sm text-gray-800">
            {/* 게시글 목록 컴포넌트 */}
            {!showForm && !showDetail && (
                <SharedBoardList
                    boards={myBoards}
                    loading={loading}
                    error={error}
                    onDelete={handleDeleteBoard}
                    onSelectBoard={handleSelectBoard}
                    onRefresh={() => {
                        if (currentBoardType === 'notice') {
                            fetchBoards('', searchKeyword, 'Y');
                        } else {
                            fetchBoards(currentBoardType, searchKeyword, '');
                        }
                    }}
                    searchKeyword={searchKeyword}
                    onSearchInputChange={handleSearchInputChange}
                    onSearch={handleSearch}
                    onSearchKeyPress={handleKeyPress}
                    onResetSearch={handleResetSearch}
                    currentBoardType={currentBoardType}
                    onChangeBoardType={handleChangeBoardType}
                    onNewBoardClick={handleNewBoardClick}
                    hideNoticeButton={true}
                />
            )}

            {/* 게시글 작성/수정 폼 컴포넌트 */}
            {showForm && (
                <SharedBoardForm
                    initialData={selectedBoard || null}
                    onSave={handleSaveBoard}
                    onCancel={handleCancel}
                    currentUserId={user?.user_uuid}
                    currentBoardType={currentBoardType}
                    hideNoticeOption={true}
                    hideReviewOption={true}
                />
            )}

            {/* 게시글 상세 보기 컴포넌트 */}
            {showDetail && selectedBoard && (
                <SharedBoardDetail
                    selectedBoard={selectedBoard}
                    replies={replies}
                    repliesLoading={repliesLoading}
                    repliesError={repliesError}
                    editingReplyId={editingReplyId}
                    editingReplyContent={editingReplyContent}
                    newReplyContent={newReplyContent}
                    handleEditBoardClick={handleEditBoardClick}
                    handleDeleteBoard={handleDeleteBoard}
                    handleCancel={handleCancel}
                    handleEditReply={handleEditReply}
                    handleSaveEditedReply={handleSaveEditedReply}
                    handleCancelEditReply={handleCancelEditReply}
                    handleDeleteReply={handleDeleteReply}
                    handleAddReply={handleAddReply}
                    setNewReplyContent={setNewReplyContent}
                    setEditingReplyContent={setEditingReplyContent}
                    currentUser={user}
                    isAdmin={false}
                    onReplyInputFocus={handleReplyInputFocus}
                />
            )}
        </div>
    );
};

export default PostManagementPage;