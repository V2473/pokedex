'use client';

import React from 'react';
import { Header, Footer, MainContainer } from '@/components/layout';
import { Background3D } from '@/components/backgrounds';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export default function TypesPage() {
  const pokemonTypes = [
    { name: 'normal', color: 'bg-gray-400' },
    { name: 'fire', color: 'bg-red-500' },
    { name: 'water', color: 'bg-blue-500' },
    { name: 'electric', color: 'bg-yellow-400' },
    { name: 'grass', color: 'bg-green-500' },
    { name: 'ice', color: 'bg-blue-300' },
    { name: 'fighting', color: 'bg-red-600' },
    { name: 'poison', color: 'bg-purple-500' },
    { name: 'ground', color: 'bg-yellow-600' },
    { name: 'flying', color: 'bg-indigo-400' },
    { name: 'psychic', color: 'bg-pink-500' },
    { name: 'bug', color: 'bg-green-600' },
    { name: 'rock', color: 'bg-yellow-700' },
    { name: 'ghost', color: 'bg-purple-600' },
    { name: 'dragon', color: 'bg-indigo-600' },
    { name: 'dark', color: 'bg-gray-800' },
    { name: 'steel', color: 'bg-gray-500' },
    { name: 'fairy', color: 'bg-pink-400' },
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background relative">
        <Background3D />
        <div className="relative z-10">
          <Header />
          <MainContainer>
            <div className="space-y-6">
              <div className="text-center py-6">
                <h1 className="text-4xl font-bold transform-gpu hover:scale-105 transition-transform duration-300">Pokémon Types</h1>
                <p className="text-muted-foreground mt-2 transform-gpu hover:scale-105 transition-transform duration-300">
                  Explore Pokémon by their types
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pokemonTypes.map((type) => (
                  <div
                    key={type.name}
                    className={`${type.color} rounded-lg p-6 text-center text-white font-bold capitalize transform-gpu hover:scale-105 transition-transform duration-300 cursor-pointer`}
                  >
                    {type.name}
                  </div>
                ))}
              </div>
            </div>
          </MainContainer>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}