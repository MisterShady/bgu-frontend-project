import React, { useState, SyntheticEvent } from 'react';
import Placeholder from './Placeholder';

interface ImageWrapperProps {
    src: string;
    alt: string;
    className?: string;
}

const ImageWrapper = ({ src, alt, className }: ImageWrapperProps) => {
    const [isError, setIsError] = useState(false);

    const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        setIsError(true);
        console.error('Image loading error:', event);
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
