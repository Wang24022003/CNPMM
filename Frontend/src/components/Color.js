import React, { useState } from "react";

const Color = ({ colorData, setColor }) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorClick = (color) => {
    setSelectedColor(color._id);
    setColor(color);
  };

  return (
    <>
      <div className="color-selection">
        <span>Color: {selectedColor ? colorData.find(color => color._id === selectedColor)?.title : "None"}</span>
        <ul className="colors ps-0">
          {colorData &&
            colorData.map((item, index) => (
              <li
                key={index}
                onClick={() => handleColorClick(item)}
                style={{
                  backgroundColor: item.title,
                  border: selectedColor === item._id ? "2px solid black" : "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "inline-block",
                  cursor: "pointer",
                  margin: "0 5px",
                }}
              ></li>
            ))}
        </ul>
        {selectedColor && <button onClick={() => { setSelectedColor(null); setColor(null); }}>× Clear</button>}
      </div>
    </>
  );
};

export default Color;
