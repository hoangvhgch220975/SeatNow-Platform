import React from 'react';
import { motion } from 'framer-motion';

/**
 * @file PageTransition.jsx
 * @description Wrapper component for page transitions using framer-motion.
 */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1], // ease-out-expo
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.2,
      ease: [0.25, 1, 0.70, 1],
    },
  },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-grow flex flex-col w-full"
      onAnimationStart={() => window.scrollTo(0, 0)}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;

