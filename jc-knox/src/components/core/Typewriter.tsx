"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export default function Typewriter({ text, speed = 100, delay = 0, className = "" }: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const type = () => {
      if (displayText.length < text.length) {
        setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1));
        }, speed);
      } else {
        setIsComplete(true);
      }
    };
    timeoutId = setTimeout(type, delay);
    const interval = setInterval(() => {
      if (displayText.length < text.length) {
        setDisplayText(prev => prev + text[prev.length]);
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [text, speed, delay]);

  return (
    <div className={className}>
      <span className="relative">
        {displayText}
        {!isComplete && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle"
          />
        )}
      </span>
    </div>
  );
}
