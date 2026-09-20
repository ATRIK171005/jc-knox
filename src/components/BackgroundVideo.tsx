"use client";
import React, { useEffect, useRef } from 'react';

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 1. Force attributes for maximum browser compatibility
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;

    // 2. Attempt to play immediately
    const attemptPlay = async () => {
      try {
        await video.play();
        console.log("Video playing successfully");
      } catch (error) {
        console.warn("Autoplay blocked. Waiting for user interaction.");
        // Fallback: Play on first click anywhere on the page
        const playOnInteraction = () => {
          video.play().then(() => {
            window.removeEventListener('click', playOnInteraction);
            window.removeEventListener('touchstart', playOnInteraction);
          }).catch(console.error);
        };
        window.addEventListener('click', playOnInteraction);
        window.addEventListener('touchstart', playOnInteraction);
      }
    };

    attemptPlay();
  }, []);

  return (
    <div className="absolute inset-0 -z-20 w-full h-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover opacity-100"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260624_210218_173f8eba-17ff-4e27-972b-d128af25bf49.mp4"
      />
    </div>
  );
}
