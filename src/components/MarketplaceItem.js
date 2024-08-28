import React from "react";
const MarketplaceItem = ({ item }) => {
  return (
    <div className="bg-neutral-50 rounded-lg shadow-lg border-4 border-black">
      <div className="p-9 bg-orange-200 rounded-t-lg text-center">
        <p className="text-lg">Item Name</p>
        <h1 className="text-4xl font-bold">{item.name}</h1>
      </div>
      <table className="w-full border-t-4 border-black text-left">
        <tbody>
          <tr>
            <td className="px-4 py-2 border font-bold">QUANTITY</td>
            <td className="px-4 py-2 border text-center">{item.quantity}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border font-bold">PURCHASED ON</td>
            <td className="px-4 py-2 border text-center">{item.purchaseDate}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border font-bold">EXPIRED ON</td>
            <td className="px-4 py-2 border text-center">{item.expiryDate}</td>
          </tr>
        </tbody>
      </table>
      <div className="p-4 text-center">
        <button className="bg-red-400 text-red-950 font-bold rounded-md py-2 px-4 w-full">
          DELETE
        </button>
      </div>
    </div>
  );
};

export default MarketplaceItem;