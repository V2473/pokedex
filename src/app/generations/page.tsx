'use client';

import React from 'react';
import { Header, Footer, MainContainer } from '@/components/layout';
import { Background3D } from '@/components/backgrounds';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export default function GenerationsPage() {
  const generations = [
    { name: 'Generation I', region: 'Kanto', years: '1996-1999', color: 'bg-red-500' },
    { name: 'Generation II', region: 'Johto', years: '1999-2002', color: 'bg-blue-500' },
    { name: 'Generation III', region: 'Hoenn', years: '2002-2006', color: 'bg-green-500' },
    { name: 'Generation IV', region: 'Sinnoh', years: '2006-2010', color: 'bg-purple-500' },
    { name: 'Generation V', region: 'Unova', years: '2010-2013', color: 'bg-yellow-500' },
    { name: 'Generation VI', region: 'Kalos', years: '2013-2016', color: 'bg-pink-500' },
    { name: 'Generation VII', region: 'Alola', years: '2016-2019', color: 'bg-indigo-500' },
    { name: 'Generation VIII', region: 'Galar', years: '2019-2022', color: 'bg-gray-600' },
    { name: 'Generation IX', region: 'Paldea', years: '2022-Present', color: 'bg-orange-500' },
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
                <h1 className="text-4xl font-bold transform-gpu hover:scale-105 transition-transform duration-300">Pokémon Generations</h1>
                <p className="text-muted-foreground mt-2 transform-gpu hover:scale-105 transition-transform duration-300">
                  Explore Pokémon by their generations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generations.map((gen, index) => (
                  <div
                    key={gen.name}
                    className={`${gen.color} rounded-lg p-6 text-white transform-gpu hover:scale-105 transition-transform duration-300 cursor-pointer`}
                  >
                    <h3 className="text-xl font-bold mb-2">{gen.name}</h3>
                    <p className="text-sm opacity-90 mb-1">Region: {gen.region}</p>
                    <p className="text-sm opacity-90">Years: {gen.years}</p>
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