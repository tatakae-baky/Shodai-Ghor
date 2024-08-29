import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, where, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import RequestModal from '../components/RequestModal';

const AllDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [userRequests, setUserRequests] = useState({});
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
        async (querySnapshot) => {
          const donationsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            donationDate: doc.data().donationDate?.toDate(),
            purchaseDate: doc.data().purchaseDate ? new Date(doc.data().purchaseDate.seconds * 1000) : null,
            expiryDate: doc.data().expiryDate ? new Date(doc.data().expiryDate.seconds * 1000) : null
          }));
          setDonations(donationsData);

          const requestsRef = collection(db, 'requests');
          const userRequestsQuery = query(requestsRef, where('requesterId', '==', user.uid));
          const userRequestsSnapshot = await getDocs(userRequestsQuery);
          const userRequestsData = {};
          userRequestsSnapshot.forEach(doc => {
            userRequestsData[doc.data().donationId] = doc.data().status;
          });
          setUserRequests(userRequestsData);

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

  const handleRequest = (donation) => {
    setSelectedDonation(donation);
  };

  const handleCloseModal = () => {
    setSelectedDonation(null);
  };

  const handleSubmitRequest = async (message, donation) => {
    try {
      const requestsRef = collection(db, 'requests');
      await addDoc(requestsRef, {
        donationId: donation.id,
        donorId: donation.donorId,
        requesterId: user.uid,
        itemName: donation.name,
        quantity: donation.quantity,
        expiryDate: donation.expiryDate ? serverTimestamp() : null,
        purchaseDate: donation.purchaseDate ? serverTimestamp() : null,
        message: message,
        status: 'pending',
        timestamp: serverTimestamp(),
      });
      setSelectedDonation(null);
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to send request. Please try again.');
    }
  }; 

  const getRequestButtonText = (donationId) => {
    const status = userRequests[donationId];
    if (status === 'pending') return 'Pending';
    if (status === 'accepted') return 'Accepted';
    if (status === 'rejected') return 'Rejected';
    return 'Request';
  };

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
              <th className="border p-2">Action</th>
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
                <td className="border p-2">
                  <button
                    onClick={() => handleRequest(donation)}
                    className={`px-4 py-2 rounded ${
                      userRequests[donation.id]
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    disabled={!!userRequests[donation.id]}
                  >
                    {getRequestButtonText(donation.id)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No donations available at the moment.</p>
      )}
      {selectedDonation && (
        <RequestModal
          donation={selectedDonation}
          onClose={handleCloseModal}
          onSubmit={(message) => handleSubmitRequest(message, selectedDonation)}
        />
      )}
    </div>
  );
};

export default AllDonationsPage;