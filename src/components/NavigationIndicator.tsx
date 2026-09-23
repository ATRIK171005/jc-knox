import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';

export interface NavigationIndicatorProps {
  sections: { id: string; label: string }[];
}

const NavigationIndicator = ({ sections }: NavigationIndicatorProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [hoverIndex, setHoverIndex] = useState<null | number>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex((sec) => sec.id === entry.target.id);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const getScale = useCallback((val: number) =>
    hoverIndex === null
      ? 0.4
      : Math.max(1 - 0.2 * Math.abs(val - hoverIndex), 0.4)
  , [hoverIndex]);

  const handleClick = useCallback((index: number) => {
    const id = sections[index].id;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sections]);

  return (
    <div className="flex flex-col gap-3">
      {sections.map((sec, index) => (
        <div
          key={sec.id}
          className="relative cursor-pointer py-1"
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          onClick={() => handleClick(index)}
        >
          <motion.div
            initial={{ scale: 0.4 }}
            animate={{ scale: getScale(index) }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="h-1 w-[38px] rounded"
            style={{
              backgroundColor: activeIndex === index ? '#ffb224' : '#a0a0a0',
            }}
          />

          {hoverIndex === index ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.4, filter: 'blur(5px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.15, delay: 0.0875 }}
              className="absolute -top-0.5 left-[44px] whitespace-nowrap text-[11px]"
              style={{
                color: activeIndex === index ? '#ffb224' : '#a0a0a0',
              }}
            >
              {sec.label}
            </motion.span>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default React.memo(NavigationIndicator);
