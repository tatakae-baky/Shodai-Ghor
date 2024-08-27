import React, { useState } from 'react';

const AddItemModal = ({ addItem, onClose }) => {
  const [itemData, setItemData] = useState({
    name: '',
    quantity: '',
    purchaseDate: '',
    expiryDate: '',
  });

  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addItem(itemData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={itemData.name}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={itemData.quantity}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="date"
            name="purchaseDate"
            placeholder="Purchase Date"
            value={itemData.purchaseDate}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="date"
            name="expiryDate"
            placeholder="Expiry Date"
            value={itemData.expiryDate}
            onChange={handleChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add to Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;