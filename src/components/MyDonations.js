import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const userDonationsRef = collection(db, 'users', user.uid, 'mydonations');
      const q = query(userDonationsRef, orderBy('donationDate', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const donationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          donationDate: doc.data().donationDate?.toDate()
        }));
        setDonations(donationsData);
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching donations:", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">My Donations</h1>
      {isLoading ? (
        <p>Loading donations...</p>
      ) : donations.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Donation Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td className="border p-2">{donation.name}</td>
                <td className="border p-2">{donation.quantity}</td>
                <td className="border p-2">
                  {donation.donationDate ? donation.donationDate.toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No donations yet. Start donating to see your contributions!</p>
      )}
    </div>
  );
};

export default MyDonations;