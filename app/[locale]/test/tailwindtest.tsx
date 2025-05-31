"use client";

import React from "react";

export default function TailwindTest() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind Test Page</h1>
      <p className="text-gray-700 mb-6">
        This page is testing if Tailwind CSS is working properly.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-green-800 text-xl font-semibold">Test Box 1</h2>
          <p className="text-green-700">This should have a green background.</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow">
          <h2 className="text-purple-800 text-xl font-semibold">Test Box 2</h2>
          <p className="text-purple-700">This should have a purple background.</p>
        </div>
      </div>
      <button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Test Button
      </button>
    </div>
  );
}
