import React from 'react';
import { motion } from 'framer-motion';

export const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
        animate={{
          background: [
            'linear-gradient(to bottom right, hsl(var(--primary) / 0.05), transparent, hsl(var(--secondary) / 0.05))',
            'linear-gradient(to bottom right, hsl(var(--secondary) / 0.05), transparent, hsl(var(--primary) / 0.05))',
            'linear-gradient(to bottom right, hsl(var(--primary) / 0.05), transparent, hsl(var(--secondary) / 0.05))',
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />

      {/* Floating 3D orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-xl"
          style={{
            width: Math.random() * 200 + 50,
            height: Math.random() * 200 + 50,
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* 3D Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--foreground) / 0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Pokemon silhouettes */}
      {['Pikachu', 'Charmander', 'Squirtle', 'Bulbasaur'].map((pokemon, i) => (
        <motion.div
          key={pokemon}
          className="absolute text-6xl opacity-5"
          style={{
            top: `${20 + i * 20}%`,
            right: `${5 + i * 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 1.5,
          }}
        >
          {pokemon === 'Pikachu' && '⚡'}
          {pokemon === 'Charmander' && '🔥'}
          {pokemon === 'Squirtle' && '💧'}
          {pokemon === 'Bulbasaur' && '🌱'}
        </motion.div>
      ))}

      {/* 3D Depth layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent opacity-20" />
    </div>
  );
};