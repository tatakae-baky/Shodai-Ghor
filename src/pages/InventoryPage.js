import React from 'react';
import Inventory from '../components/Inventory';

const InventoryPage = () => {
  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <Inventory />
    </div>
  );
};

export default InventoryPage;