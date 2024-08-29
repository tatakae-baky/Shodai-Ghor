import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, getDoc, getDocs, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const RequestsPage = () => {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('incoming');
    const { user } = useAuth();

    const fetchRequests = useCallback(async (requestsQuery, setRequests) => {
        try {
            const querySnapshot = await getDocs(requestsQuery);
            const requests = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
                const requestData = { id: docSnapshot.id, ...docSnapshot.data() };
                const donationDocRef = doc(db, 'alldonations', requestData.donationId);
                const donationDocSnap = await getDoc(donationDocRef);
                const donationData = donationDocSnap.exists() ? donationDocSnap.data() : {};
                return { 
                    ...requestData, 
                    donationDetails: donationData,
                    purchaseDate: donationData.purchaseDate ? (donationData.purchaseDate.toDate ? donationData.purchaseDate.toDate() : new Date(donationData.purchaseDate)) : null,
                    expiryDate: donationData.expiryDate ? (donationData.expiryDate.toDate ? donationData.expiryDate.toDate() : new Date(donationData.expiryDate)) : null
                };
            }));
            setRequests(requests);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setError("Failed to process requests. Please try again.");
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        const requestsRef = collection(db, 'requests');

        const incomingQuery = query(
            requestsRef,
            where('donorId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );

        const outgoingQuery = query(
            requestsRef,
            where('requesterId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );

        const unsubscribeIncoming = onSnapshot(incomingQuery, 
            () => fetchRequests(incomingQuery, setIncomingRequests),
            (err) => {
                console.error("Error fetching incoming requests:", err);
                setError("Failed to load incoming requests. Please try again.");
            }
        );

        const unsubscribeOutgoing = onSnapshot(outgoingQuery, 
            () => fetchRequests(outgoingQuery, setOutgoingRequests),
            (err) => {
                console.error("Error fetching outgoing requests:", err);
                setError("Failed to load outgoing requests. Please try again.");
            }
        );

        setIsLoading(false);

        return () => {
            unsubscribeIncoming();
            unsubscribeOutgoing();
        };
    }, [user, fetchRequests]);

    const handleAcceptRequest = async (request) => {
        try {
            const requestRef = doc(db, 'requests', request.id);
            const donationRef = doc(db, 'alldonations', request.donationId);
            const requesterItemsRef = collection(db, 'users', request.requesterId, 'items');

            
            await addDoc(requesterItemsRef, {
                name: request.itemName,
                quantity: request.quantity,
                purchaseDate: request.purchaseDate ? serverTimestamp() : null,
                expiryDate: request.expiryDate ? serverTimestamp() : null,
                receivedDate: serverTimestamp()
            });
            await updateDoc(requestRef, { status: 'accepted' });
            await deleteDoc(donationRef);

            const donorDonationRef = doc(db, 'users', user.uid, 'mydonations', request.donationId);
            await deleteDoc(donorDonationRef);

            alert('Request accepted and item transferred successfully!');
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Failed to accept request and transfer item. Please try again.');
        }
    };

    const handleRejectRequest = async (request) => {
        try {
            const requestRef = doc(db, 'requests', request.id);
            await updateDoc(requestRef, { status: 'rejected' });
            alert('Request rejected successfully!');
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Failed to reject request. Please try again.');
        }
    };

    const formatDate = (date) => {
        if (date && date.toDate instanceof Function) {
            return date.toDate().toLocaleDateString();
        } else if (date instanceof Date) {
            return date.toLocaleDateString();
        }
        return 'N/A';
    };

    const renderRequestsList = (requests, isIncoming) => (
        <ul className="space-y-4">
            {requests.map((request) => (
                <li key={request.id} className="bg-white p-4 rounded shadow">
                    <p><strong>Item:</strong> {request.itemName || 'N/A'}</p>
                    <p><strong>Quantity:</strong> {request.quantity || 'N/A'}</p>
                    <p><strong>Expiry Date:</strong> {formatDate(request.expiryDate)}</p>
                    <p><strong>Purchase Date:</strong> {formatDate(request.purchaseDate)}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                    <p><strong>Message:</strong> {request.message}</p>
                    <p><strong>Date:</strong> {formatDate(request.timestamp)}</p>
                    {isIncoming && request.status === 'pending' && (
                        <div className="mt-2">
                            <button
                                onClick={() => handleAcceptRequest(request)}
                                className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleRejectRequest(request)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Reject
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    const TabButton = ({ label, isActive, onClick }) => (
        <button
            className={`px-4 py-2 font-semibold ${
                isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } rounded-t-lg`}
            onClick={onClick}
        >
            {label}
        </button>
    );

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Requests</h1>
            
            <div className="mb-4">
                <TabButton
                    label="Incoming Requests"
                    isActive={activeTab === 'incoming'}
                    onClick={() => setActiveTab('incoming')}
                />
                <TabButton
                    label="Outgoing Requests"
                    isActive={activeTab === 'outgoing'}
                    onClick={() => setActiveTab('outgoing')}
                />
            </div>

            {isLoading ? (
                <p>Loading requests...</p>
            ) : (
                <div className="bg-white p-4 rounded-b-lg shadow">
                    {activeTab === 'incoming' && (
                        <>
                            <h2 className="text-xl font-semibold mb-4">Incoming Requests</h2>
                            {incomingRequests.length > 0 ? (
                                renderRequestsList(incomingRequests, true)
                            ) : (
                                <p>No incoming requests at the moment.</p>
                            )}
                        </>
                    )}
                    {activeTab === 'outgoing' && (
                        <>
                            <h2 className="text-xl font-semibold mb-4">Outgoing Requests</h2>
                            {outgoingRequests.length > 0 ? (
                                renderRequestsList(outgoingRequests, false)
                            ) : (
                                <p>No outgoing requests at the moment.</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default RequestsPage;