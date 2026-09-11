"use client";

import React from "react";
import { LuSearch, LuFilter, LuX } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface Game {
  id: string;
  name: string;
}

interface EventFiltersProps {
  categories: Category[];
  games: Game[];
  selectedCategories: string[];
  onCategoryChange: (id: string) => void;
  selectedGames: string[];
  onGameChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hideFilters?: boolean;
  hideSearch?: boolean;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  categories,
  games,
  selectedCategories,
  onCategoryChange,
  selectedGames,
  onGameChange,
  searchQuery,
  onSearchChange,
  hideFilters = false,
  hideSearch = false,
}) => {
  return (
    <div className={cn("space-y-8 mb-12", hideSearch && "mb-8")}>
      {/* Search Bar */}
      {!hideSearch && (
        <div className="relative max-w-2xl mx-auto animate-fade-in-up animation-delay-200 bg-gray-950/60 backdrop-blur-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <LuSearch className="h-5 w-5 text-white" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un événement, un jeu, un lieu..."
            className="block w-full pl-11 pr-12 py-4 bg-gray-950/60 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-theme/50 focus:border-theme transition-all font-rajdhani font-semibold text-lg hover:border-white/20"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
            >
              <LuX className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Categories Filter */}
      {!hideFilters && (
        <>
          <div className="space-y-4 animate-fade-in-up animation-delay-300">
            <div className="flex items-center gap-2 text-theme2 mb-2">
              <LuFilter size={18} />
              <span className="font-rajdhani font-bold uppercase tracking-wider text-sm">
                Nos différents événements
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onCategoryChange("all")}
                className={cn(
                  "px-6 py-2 rounded-xl font-rajdhani font-bold uppercase tracking-wider text-sm transition-all duration-300 border-2",
                  selectedCategories.length === 0
                    ? "bg-theme border-theme text-gray-950"
                    : "bg-transparent border-white/10 text-white hover:border-theme/50"
                )}
              >
                Tous les types
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    "px-6 py-2 rounded-xl font-rajdhani font-bold uppercase tracking-wider text-sm transition-all duration-300 border-2",
                    selectedCategories.includes(category.id)
                      ? "bg-theme border-theme text-gray-950"
                      : "bg-transparent border-white/10 text-white hover:border-theme/50"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Games Filter */}
          <div className="space-y-4 animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-2 text-theme2 mb-2">
              <span className="font-rajdhani font-bold uppercase tracking-wider text-sm">
                Filtrer par jeu
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onGameChange("all")}
                className={cn(
                  "px-5 py-2 rounded-xl font-rajdhani font-medium text-sm transition-all duration-300 border",
                  selectedGames.length === 0
                    ? "bg-white/10 border-white text-white"
                    : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                )}
              >
                Tous les jeux
              </button>
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => onGameChange(game.id)}
                  className={cn(
                    "px-5 py-2 rounded-xl font-rajdhani font-medium text-sm transition-all duration-300 border",
                    selectedGames.includes(game.id)
                      ? "bg-white/10 border-white text-white"
                      : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                  )}
                >
                  {game.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EventFilters;
