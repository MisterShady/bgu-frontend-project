import React from "react";
import "./FlyingImage.css";

interface FlyingImageProps {
  imageUrl: string;
  title: string;
}

const FlyingImage: React.FC<FlyingImageProps> = ({ imageUrl, title }) => {
  return (
    <div className="flying-image">
      <img src={imageUrl} alt={title} />
    </div>
  );
};

export default FlyingImage;
