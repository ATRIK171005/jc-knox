import { motion } from 'framer-motion';
import { useState } from 'react';

export interface NavigationIndicatorProps {
  items?: string[];
  activeIndex?: number | null;
  onClick?: (index: number) => void;
}

const NavigationIndicator = (props: NavigationIndicatorProps) => {
  const { items = [], activeIndex = null, onClick } = props;
  const [hoverIndex, setHoverIndex] = useState<null | number>(null);

  const getScale = (val: number) =>
    hoverIndex === null
      ? 0.4
      : Math.max(1 - 0.2 * Math.abs(val - hoverIndex), 0.4);

  const handleClick = (index: number) => {
    onClick?.(index);
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div
          key={index}
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
              {item}
            </motion.span>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default NavigationIndicator;
