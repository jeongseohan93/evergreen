import React from 'react';

const SharedMessageBox = ({ message, onConfirm, onCancel, type = 'alert' }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center border border-[#306f65]">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#306f65] text-white rounded-md hover:bg-[#58bcb5] transition-colors duration-200 font-medium"
          >
            확인
          </button>
          {type === 'confirm' && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 font-medium"
            >
              취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedMessageBox;
