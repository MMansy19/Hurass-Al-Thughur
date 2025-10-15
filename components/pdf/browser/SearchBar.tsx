"use client";

import { ChangeEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder: string;
  searchLabel: string;
  categories?: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categoryLabel?: string;
  allCategoriesLabel?: string;
}

export function SearchBar({
  searchTerm,
  setSearchTerm,
  placeholder,
  searchLabel,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  categoryLabel = "Category",
  allCategoriesLabel = "All Categories",
}: SearchBarProps) {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border rounded-lg pl-10 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
          aria-label={searchLabel}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Category Selector */}
      {categories.length > 0 && (
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full p-3 border rounded-lg bg-white focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50 appearance-none pr-10"
            aria-label={categoryLabel}
          >
            <option value="">{allCategoriesLabel}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
