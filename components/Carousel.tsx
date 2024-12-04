'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wrap } from 'popmotion';
import { IconLeftArrow, IconRightArrow } from '@/lib/icons';
import Link from 'next/link';

// Type for props
type CarouselProps = {
  images: string[];
};

// Animation variants for the carousel images
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

// Utility function to calculate swipe power
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

// Carousel Component
const Carousel = ({ images }: CarouselProps) => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

  // Wrapping the page index to stay within bounds
  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="carousel flex flex-col items-center max-w-md my-24 mx-auto space-y-4">
      <div className="carousel-content relative flex justify-center items-center w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <Link
            title="לחץ לפתיחת תמונה גדולה"
            href={images[imageIndex]}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-center"
          >
            <motion.img
              key={page}
              src={images[imageIndex]}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="w-full object-cover rounded-lg"
              alt={`Carousel image ${imageIndex + 1}`}
            />
          </Link>
        </AnimatePresence>
      </div>
      <CarouselControls paginate={paginate} />
    </div>
  );
};

// Carousel Controls as a separate component for better separation of concerns
type CarouselControlsProps = {
  paginate: (newDirection: number) => void;
};

const CarouselControls = ({ paginate }: CarouselControlsProps) => (
  <div className="controls flex justify-between w-full px-6">
    <button
      aria-label="Previous image"
      className="carousel-prev flex justify-center items-center select-none cursor-pointer font-bold text-lg z-10 hover:scale-105 transition-transform duration-300 ease-in-out"
      onClick={() => paginate(-1)}
    >
      <IconRightArrow className="w-10 h-10 fill-slate-900 dark:fill-slate-300 dark:bg-slate-800 rounded-full hover:fill-slate-700 dark:hover:fill-slate-500" />
    </button>
    <button
      aria-label="Next image"
      className="carousel-next flex justify-center items-center select-none cursor-pointer font-bold text-lg z-10 hover:scale-105 transition-transform duration-300 ease-in-out"
      onClick={() => paginate(1)}
    >
      <IconLeftArrow className="w-10 h-10 fill-slate-900 dark:fill-slate-300 dark:bg-slate-800 rounded-full hover:fill-slate-700 dark:hover:fill-slate-500" />
    </button>
  </div>
);

export default Carousel;