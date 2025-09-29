"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * Loader spinner for async states.
 */
export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
      </svg>
      {label}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Error banner to show request failures.
 */
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-md border border-red-200 bg-red-50 text-red-800 text-sm">
      {message}
    </div>
  );
}
