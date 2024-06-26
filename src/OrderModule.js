// src/OrderModule.js
import React, {useState} from "react";

function OrderModule() {
  const [itemCount, setItemCount] = useState("");
  const [itemName, setItemName] = useState("");

  const handleAddOrder = async () => {
    await window.electron.dbQuery(
      "INSERT INTO orders (item_count, item_name) VALUES (?, ?)",
      [itemCount, itemName]
    );
    setItemCount("");
    setItemName("");
  };

  return (
    <div>
      <h2>Order Module</h2>
      <input
        type="number"
        value={itemCount}
        onChange={(e) => setItemCount(e.target.value)}
        placeholder="Number of Items"
      />
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Item Name"
      />
      <button onClick={handleAddOrder}>Add Order</button>
    </div>
  );
}

export default OrderModule;
