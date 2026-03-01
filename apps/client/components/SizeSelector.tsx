import React from "react";

interface ISizeSelector {
  sizes: string[];
  setSelectedSize: React.Dispatch<React.SetStateAction<string>>;
  selectedSize: string;
}

const SizeSelector: React.FC<ISizeSelector> = ({
  selectedSize,
  setSelectedSize,
  sizes,
}) => {
  return (
    <div className="mt-10">
      <h4 className="text-xs text-gray-500">Size</h4>
      <div className="flex flex-wrap gap-2 mt-2">
        {sizes.map((size) => (
          <button
            key={size}
            className={`px-4 py-2 bg-gray-100 rounded-md transition-colors duration-100 ${selectedSize === size ? "bg-gray-800 text-white" : ""}`}
            onClick={() => setSelectedSize(size)}
          >
            {size.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
