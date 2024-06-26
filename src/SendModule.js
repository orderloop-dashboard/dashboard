// src/SendModule.js
import React, {useState, useEffect} from "react";

function SendModule() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await window.electron.dbQuery(
        "SELECT * FROM availability",
        []
      );
      console.log("response ==>", response);
      setItems(response);
    };
    fetchItems();
  }, []);

  const handleToggleAvailability = async (item) => {
    const newAvailability = item.available === 1 ? 0 : 1;
    await window.electron.dbQuery(
      "UPDATE availability SET available = ? WHERE id = ?",
      [newAvailability, item.id]
    );
    setItems(
      items.map((i) =>
        i.id === item.id ? {...i, available: newAvailability} : i
      )
    );
  };

  return (
    <div>
      <h2>Send Module</h2>
      {items.map((item) => (
        <div key={item.id}>
          <span>{item.item_name}</span>
          <input
            type="checkbox"
            checked={item.available === 1}
            onChange={() => handleToggleAvailability(item)}
          />
        </div>
      ))}
    </div>
  );
}

export default SendModule;
