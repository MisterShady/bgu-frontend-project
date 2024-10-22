import React, { CSSProperties, useState } from "react";
import Placeholder1 from "./LargePlaceholder";

interface ImageWrapperProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

const ImageWrapper = ({ src, alt, className, style }: ImageWrapperProps) => {
  const [isError, setIsError] = useState(false);

  const handleImageError = () => {
    setIsError(true);
  };

  return (
    <div>
      {isError ? (
        <Placeholder1 />
      ) : (
        <img src={src} alt={alt} className={className} onError={handleImageError} style={style} />
      )}
    </div>
  );
};

export default ImageWrapper;
