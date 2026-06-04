import React, { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Footer from './components/Footer';

function App() {
  // Share this single state variable between the Header dropdown and ProductList grid
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased font-sans">
      {/* Pass the state functions down as component parameters */}
      <Header selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-8 md:p-12 text-white shadow-sm mb-8">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">Welcome to Merkato Store</h1>
          <p className="text-orange-100 text-sm md:text-base max-w-md font-medium leading-relaxed">
            The easiest way to discover hot deals with quick guest checkout capabilities.
          </p>
        </div>

        {/* Product List reads from the same state variable */}
        <ProductList selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
