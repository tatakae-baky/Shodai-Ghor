import React from 'react';

const ConfirmationModal = ({ item, onConfirm, onCancel, action }) => {
  const isDelete = action === 'delete';
  const title = isDelete ? 'Confirm Deletion' : 'Confirm Donation';
  const message = `Are you sure you want to ${isDelete ? 'delete' : 'donate'} "${item.name}"?`;
  const confirmButtonColor = isDelete ? 'bg-red-500' : 'bg-green-500';
  const confirmButtonText = isDelete ? 'Delete' : 'Donate';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`${confirmButtonColor} text-white px-4 py-2 rounded`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;