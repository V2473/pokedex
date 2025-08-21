import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      className="border-t py-6 md:px-8 md:py-0 bg-gradient-to-t from-background to-muted/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <motion.div
          className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.p
            className="text-center text-sm leading-loose text-muted-foreground md:text-left"
            whileHover={{
              scale: 1.02,
              textShadow: '0 0 5px rgba(var(--primary), 0.3)'
            }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            © 2023 Pokédex. All rights reserved.
          </motion.p>
        </motion.div>
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
            whileHover={{
              scale: 1.05,
              y: -3,
              color: 'hsl(var(--foreground))',
              textShadow: '0 0 8px rgba(var(--primary), 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            Powered by PokéAPI
          </motion.a>
        </motion.div>
      </div>
    </motion.footer>
  );
};