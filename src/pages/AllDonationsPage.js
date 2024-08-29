import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const AllDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setError(null);
      const allDonationsRef = collection(db, 'alldonations');
      const q = query(
        allDonationsRef,
        where('donorId', '!=', user.uid),
        orderBy('donorId'),
        orderBy('donationDate', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const donationsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            donationDate: doc.data().donationDate?.toDate(),
            purchaseDate: doc.data().purchaseDate instanceof Date ? doc.data().purchaseDate : new Date(doc.data().purchaseDate),
            expiryDate: doc.data().expiryDate instanceof Date ? doc.data().expiryDate : new Date(doc.data().expiryDate)
          }));
          setDonations(donationsData);
          setIsLoading(false);
        },
        (err) => {
          console.error("Error fetching donations:", err);
          setError(err.message);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  if (error) {
    return <div className="w-full p-4">Error: {error}</div>;
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">All Donations</h1>
      {isLoading ? (
        <p>Loading donations...</p>
      ) : donations.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Donation Date</th>
              <th className="border p-2">Purchased On</th>
              <th className="border p-2">Expiry Date</th>
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
                <td className="border p-2">
                  {donation.purchaseDate ? donation.purchaseDate.toLocaleDateString() : 'N/A'}
                </td>
                <td className="border p-2">
                  {donation.expiryDate ? donation.expiryDate.toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No donations available at the moment.</p>
      )}
    </div>
  );
};

export default AllDonationsPage;