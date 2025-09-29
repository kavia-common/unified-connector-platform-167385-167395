import React from "react";

export default function NotFound() {
  return (
    <main className="main">
      <section className="card" role="alert" aria-live="assertive">
        <header className="mb-2">
          <h1 className="text-xl font-semibold">404 – Page Not Found</h1>
          <p className="text-sm text-gray-600">The page you’re looking for doesn’t exist.</p>
        </header>
      </section>
    </main>
  );
}
