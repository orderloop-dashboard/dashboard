// src/ListModule.js
import React, {useState, useEffect} from "react";

function ListModule() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const response = await window.electron.dbQuery("SELECT * FROM items", []);
      setItems(response);
    };
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    await window.electron.dbQuery("INSERT INTO items (item_name) VALUES (?)", [
      newItemName,
    ]);

    // Fetch the newly added item to get its ID

    // Add the new item to the availability table and set it as available
    await window.electron.dbQuery(
      "INSERT INTO availability (item_name, available) VALUES (?, ?)",
      [newItemName, 1]
    );

    setNewItemName("");
    const response = await window.electron.dbQuery("SELECT * FROM items", []);
    setItems(response);
  };

  const handleRemoveItem = async (itemId) => {
    const item = await window.electron.dbQuery(
      "SELECT * FROM items WHERE id = ?",
      [itemId]
    );
    await window.electron.dbQuery("DELETE FROM items WHERE id = ?", [itemId]);
    await window.electron.dbQuery(
      "DELETE FROM availability WHERE item_name = ?",
      [item[0].item_name]
    );
    const response = await window.electron.dbQuery("SELECT * FROM items", []);
    setItems(response);
  };

  return (
    <div>
      <h2>List Module</h2>
      <input
        type="text"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        placeholder="New Item Name"
      />
      <button onClick={handleAddItem}>Add Item</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.item_name}
            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListModule;
