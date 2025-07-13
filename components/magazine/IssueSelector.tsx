"use client";

import { useState } from "react";

interface MagazineIssue {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  date: string;
  category: string;
  author?: string;
  tags?: string[];
}

interface IssueSelectorProps {
  issues: MagazineIssue[];
  selectedIssue: MagazineIssue | null;
  onIssueChange: (issue: MagazineIssue | null) => void;
  locale: string;
  selectIssueText: string;
}

export default function IssueSelector({
  issues,
  selectedIssue,
  onIssueChange,
  selectIssueText,
}: IssueSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label
        htmlFor="issue-selector"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {selectIssueText}
      </label>

      <div className="relative">
        <button
          id="issue-selector"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-gray-400 transition-colors"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby="issue-selector-label"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedIssue?.coverImage}
                alt={selectedIssue?.title}
                className="w-10 h-12 object-cover rounded border mr-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/magazine/placeholder.svg";
                }}
              />
              <div className="mx-2 text-start">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedIssue?.title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {selectedIssue?.date}
                </p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
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
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg border border-gray-200 overflow-auto focus:outline-none">
            <ul role="listbox" className="py-1">
              {issues.map((issue) => (
                <li
                  key={issue.id}
                  role="option"
                  aria-selected={issue.id === selectedIssue?.id}
                  className={`relative cursor-pointer select-none py-3 px-4 hover:bg-emerald-50 transition-colors ${
                    issue.id === selectedIssue?.id
                      ? "bg-emerald-100 text-emerald-900"
                      : "text-gray-900"
                  }`}
                  onClick={() => {
                    onIssueChange(issue);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <img
                      src={issue.coverImage}
                      alt={issue.title}
                      className="w-8 h-10 object-cover rounded border mr-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/magazine/placeholder.svg";
                      }}
                    />
                    <div className="mx-2 text-start">
                      <p className="text-sm font-medium truncate">
                        {issue.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {issue.description}
                      </p>
                      <p className="text-xs text-gray-400">{issue.date}</p>
                    </div>
                    {issue.id === selectedIssue?.id && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-5" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
