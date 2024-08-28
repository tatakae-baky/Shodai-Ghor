import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import MarketplaceItem from '../components/MarketplaceItem';

const MarketPlacePage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'marketplace'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const marketplaceItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(marketplaceItems);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => (
          <MarketplaceItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MarketPlacePage;