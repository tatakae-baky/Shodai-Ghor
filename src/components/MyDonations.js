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
    <div className="w-full">
      <h1 className="text-3xl font-normal text-center text-[#333F72] mb-4">My Donations</h1>
      {isLoading ? (
        <p>Loading donations...</p>
      ) : donations.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#EAD4B7]">
              <th className="border font-normal border-[#EAD4B7] p-3 text-[#333F72]">Item Name</th>
              <th className="border font-normal border-[#EAD4B7] p-3 text-[#333F72]">Quantity</th>
              <th className="border font-normal border-[#EAD4B7] p-3 text-[#333F72]">Donation Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td className="border font-normal border-[#EAD4B7] p-3 text-[#E56E0C] font-semibold">{donation.name}</td>
                <td className="border border-[#EAD4B7] p-3 text-center">{donation.quantity}</td>
                <td className="border border-[#EAD4B7] p-3 text-center">
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