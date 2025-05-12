import React from "react";

const Image = ({ src, alt, className, size = "w-10 h-10" }) => {
  return (
    <div className={`relative overflow-hidden ${size} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};

export default Image;
