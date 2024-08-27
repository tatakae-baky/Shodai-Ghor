import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import AddItemModal from './AddItemModal';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'items'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const addItem = async (newItem) => {
    try {
      await addDoc(collection(db, 'items'), {
        ...newItem,
        userId: user.uid,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'items', itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Add Item
      </button>
      {items.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Purchasing Date</th>
              <th className="border p-2">Expiry Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">{item.purchaseDate}</td>
                <td className="border p-2">{item.expiryDate}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items in inventory. Add some items to get started!</p>
      )}
      {isModalOpen && <AddItemModal addItem={addItem} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Inventory;