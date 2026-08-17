
import React, { useState, useEffect } from 'react';

interface BackgroundCarouselProps {
  images: string[];
  interval?: number;
}

const BackgroundCarousel: React.FC<BackgroundCarouselProps> = ({
  images,
  interval = 60000 // Default to 1 minute
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [images.length, interval]);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gray-900/50" /> {/* Overlay to darken the background images */}
    </div>
  );
};

export default BackgroundCarousel;
