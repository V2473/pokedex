'use client';

import React from 'react';
import { Header, Footer, MainContainer } from '@/components/layout';
import { Background3D } from '@/components/backgrounds';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { useFavoritesStore } from '@/stores';
import { PokemonCard } from '@/components/pokemon';

export default function FavoritesPage() {
  const { favoritePokemon } = useFavoritesStore();

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background relative">
        <Background3D />
        <div className="relative z-10">
          <Header />
          <MainContainer>
            <div className="space-y-6">
              <div className="text-center py-6">
                <h1 className="text-4xl font-bold transform-gpu hover:scale-105 transition-transform duration-300">Favorite Pokémon</h1>
                <p className="text-muted-foreground mt-2 transform-gpu hover:scale-105 transition-transform duration-300">
                  Your favorite Pokémon collection
                </p>
              </div>

              {favoritePokemon.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No favorite Pokémon yet.</p>
                  <p className="text-muted-foreground mt-2">Start exploring and add some favorites!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoritePokemon.map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                  ))}
                </div>
              )}
            </div>
          </MainContainer>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}