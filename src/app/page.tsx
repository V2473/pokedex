'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Header, Footer, MainContainer } from '@/components/layout';
import { PokemonGrid } from '@/components/pokemon';
import { Background3D } from '@/components/backgrounds';
import { useUIStore } from '@/stores';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Pokemon } from '@/types';

// Dynamically import PokemonModal with code splitting
const PokemonModal = dynamic(
  () => import('@/components/pokemon/PokemonModal').then((mod) => mod.PokemonModal),
  {
    loading: () => <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">Loading...</div>,
    ssr: false
  }
);

export default function Home() {
  const { modal, closeModal } = useUIStore();

  // Type guard to check if modal data is a Pokemon
  const isPokemonData = (data: unknown): data is Pokemon => {
    return data !== null && typeof data === 'object' && 'id' in data && 'name' in data;
  };

  // Render the modal only if conditions are met
  const renderPokemonModal = () => {
    if (modal.isOpen && modal.content === 'pokemon' && modal.data && isPokemonData(modal.data)) {
      return (
        <PokemonModal
          pokemon={modal.data}
          isOpen={modal.isOpen}
          onClose={closeModal}
        />
      );
    }
    return null;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background relative">
        {/* 3D Background */}
        <Background3D />

        {/* Content */}
        <div className="relative z-10">
          <Header />
          <MainContainer>
            <div className="space-y-6">
              <div className="text-center py-6">
                <h1 className="text-4xl font-bold transform-gpu hover:scale-105 transition-transform duration-300">Pokédex</h1>
                <p className="text-muted-foreground mt-2 transform-gpu hover:scale-105 transition-transform duration-300">
                  Explore the world of Pokémon
                </p>
              </div>
              <PokemonGrid />
            </div>
          </MainContainer>
          <Footer />
        </div>

        {/* Pokemon Modal */}
        {renderPokemonModal()}
      </div>
    </ThemeProvider>
  );
}
