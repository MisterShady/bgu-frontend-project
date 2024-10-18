// ImageWrapper.tsx
import React, { useState } from 'react';
import Placeholder from './Placeholder';

interface ImageWrapperProps {
    src: string;
    alt: string;
    className?: string;
}

// вместо этого лучше писать const ImageWrapper = ({ src, alt, className }: ImageWrapperProps) => {
const ImageWrapper: React.FC<ImageWrapperProps> = ({ src, alt, className }) => {
    const [isError, setIsError] = useState(false);

    const handleImageError = () => {
        setIsError(true);
    };

    return (
        <div>
            {isError ? (
                <Placeholder />
            ) : (
                <img src={src} alt={alt} className={className} onError={handleImageError} />
            )}
        </div>
    );
};

export default ImageWrapper;
