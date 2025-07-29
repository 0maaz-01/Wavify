import React, { useState, useEffect, useRef } from 'react';
import { videos } from '../constants';



const SimpleVideoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);



  // Initialize video refs
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos.length]);

  // Auto-advance to next video when current one ends
  useEffect(() => {
    const currentVideo = videoRefs.current[currentSlide];
    if (!currentVideo) return;

    const handleEnded = () => {
      const nextIndex = (currentSlide + 1) % videos.length;
      setCurrentSlide(nextIndex);
    };

    currentVideo.addEventListener('ended', handleEnded);

    return () => {
      currentVideo.removeEventListener('ended', handleEnded);
    };
  }, [currentSlide, videos.length]);

  // Auto-play current video when it becomes active
  useEffect(() => {
    const currentVideo = videoRefs.current[currentSlide];
    if (currentVideo) {
      currentVideo.play().catch(() => {
        // Handle autoplay restrictions silently
      });
    }
  }, [currentSlide]);

  // Intersection Observer to play/pause based on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRefs.current[currentSlide];
          if (video) {
            if (entry.isIntersecting) {
              video.play().catch(() => {
                // Handle autoplay restrictions silently
              });
            } else {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [currentSlide]);

  return (
    <div 
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-black"
    >
      {/* Video Container */}
      <div className="relative w-full h-full    ">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`absolute inset-0 transition-opacity duration-500   ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <video
              ref={el => videoRefs.current[index] = el}
              src={video.src}
              poster={video.poster}
              className="w-full h-full object-cover   "
              muted
              playsInline
              preload={index === currentSlide ? 'auto' : 'metadata'}
              loop
            />
          </div>
        ))}
      </div>

      {/* Simple Title Overlay */}
      <div className="absolute   w-full top-[60vh] 2xl:left-[30vw]        playfair-font       bg-gradient-to-b from-black/70 to-transparent">
        <div className="p-8 text-white            ">
          <h2 className="text-2xl md:text-4xl font-bold mb-2   lg:mb-8">
            {videos[currentSlide].title}
          </h2>
          <p className=" opacity-90 text-xl">
            {videos[currentSlide].description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleVideoSlider;