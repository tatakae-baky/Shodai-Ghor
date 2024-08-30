import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import AddItemModal from './AddItemModal';
import ConfirmationModal from './ConfirmationModal';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToDonate, setItemToDonate] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const userItemsRef = collection(db, 'users', user.uid, 'items');
      const unsubscribe = onSnapshot(userItemsRef, (querySnapshot) => {
        const itemsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            purchaseDate: data.purchaseDate ? (data.purchaseDate.toDate ? data.purchaseDate.toDate() : new Date(data.purchaseDate)) : null,
            expiryDate: data.expiryDate ? (data.expiryDate.toDate ? data.expiryDate.toDate() : new Date(data.expiryDate)) : null
          };
        });
        setItems(itemsData);
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching items:", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const addItem = async (newItem) => {
    try {
      const userItemsRef = collection(db, 'users', user.uid, 'items');
      await addDoc(userItemsRef, newItem);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const itemRef = doc(db, 'users', user.uid, 'items', itemId);
      await deleteDoc(itemRef);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const donateItem = async (item) => {
    try {
      // Removing the item from the user's inventory
      const itemRef = doc(db, 'users', user.uid, 'items', item.id);
      await deleteDoc(itemRef);

      // Adding the item to the user's donations collection in the database
      const userDonationsRef = collection(db, 'users', user.uid, 'mydonations');
      const donationData = {
        ...item,
        donationDate: serverTimestamp()
      };
      delete donationData.id; 
      await addDoc(userDonationsRef, donationData);

      // Adding the item to the 'alldonations' collection in the database
      const allDonationsRef = collection(db, 'alldonations');
      const allDonationData = {
        name: item.name,
        quantity: item.quantity,
        donationDate: serverTimestamp(),
        purchaseDate: item.purchaseDate,
        expiryDate: item.expiryDate,
        donorId: user.uid
      };
      await addDoc(allDonationsRef, allDonationData);

      setItemToDonate(null); 
    } catch (error) {
      console.error('Error donating item:', error);
      setItemToDonate(null); 
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-normal text-center text-[#333F72] mb-4">Inventory</h1>
      <div className="flex justify-start mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#333F72] text-white px-6 py-2 rounded-tl-2xl rounded-br-2xl hover:bg-opacity-90"
        >
          Add Items
        </button>
      </div>
      {isLoading ? (
        <p>Loading inventory...</p>
      ) : items.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#EAD4B7]">
              <th className="border font-normal border-[#EAD4B7] p-3 text-[#333F72]">Item Name</th>
              <th className="border font-normal border-[#EAD4B7] p-3 text-[#333F72]">Quantity</th>
              <th className="border font-normal border-[#EAD4B7] p-3 text-[#333F72]">Purchasing Date</th>
              <th className="border font-normal border-[#EAD4B7] p-3 text-[#333F72]">Expiry Date</th>
              <th className="border font-normal border-[#EAD4B7] p-3 text-[#333F72]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border border-[#EAD4B7] p-3 text-[#E56E0C] font-normal">{item.name}</td>
                <td className="border border-[#EAD4B7] p-3 text-center">{item.quantity}</td>
                <td className="border border-[#EAD4B7] p-3 text-center">
                  {item.purchaseDate ? item.purchaseDate.toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-[#EAD4B7] p-3 text-center">
                  {item.expiryDate ? item.expiryDate.toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-[#EAD4B7] p-3">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="bg-[#DB3A3A] text-white px-6 py-1 rounded-tl-2xl rounded-br-2xl hover:bg-opacity-90"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setItemToDonate(item)}
                      className="bg-[#478242] text-white px-4 py-1 rounded-tl-2xl rounded-br-2xl hover:bg-opacity-90"
                    >
                      Donate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items in inventory. Add some items to get started!</p>
      )}
      {isModalOpen && <AddItemModal addItem={addItem} onClose={() => setIsModalOpen(false)} />}
      {itemToDelete && (
        <ConfirmationModal
          item={itemToDelete}
          onConfirm={() => deleteItem(itemToDelete.id)}
          onCancel={() => setItemToDelete(null)}
          action="delete"
        />
      )}
      {itemToDonate && (
        <ConfirmationModal
          item={itemToDonate}
          onConfirm={() => donateItem(itemToDonate)}
          onCancel={() => setItemToDonate(null)}
          action="donate"
        />
      )}
    </div>
  );
};

export default Inventory;