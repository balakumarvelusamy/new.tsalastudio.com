"use client";
import React, { useState } from 'react';

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    placeholderSrc?: string;
}

const BlurImage: React.FC<BlurImageProps> = ({
    src,
    alt,
    className,
    placeholderSrc = '/images/offerbanner.jpg',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Main Image */}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                onLoad={() => setIsLoaded(true)}
                {...props}
            />

            {/* Placeholder Image (absolute positioned on top, fades out) */}
            <img
                src={placeholderSrc}
                alt="Loading..."
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                aria-hidden="true"
            />
        </div>
    );
};

export default BlurImage;
