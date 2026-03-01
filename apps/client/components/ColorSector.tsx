import React from "react";

interface IColorSelector {
  colors: string[];
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  selectedColor: string;
}

const ColorSector: React.FC<IColorSelector> = ({
  colors,
  selectedColor,
  setSelectedColor,
}) => {
  return (
    <div className="mt-10">
      <h4 className="text-xs text-gray-500">Color</h4>
      <div className="flex flex-wrap gap-2 mt-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 border-2 border-white ${selectedColor === color ? "outline outline-gray-800" : ""}`}
            style={{ backgroundColor: color }}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ColorSector;
