import React from 'react';
import { FiShoppingCart, FiSearch } from 'react-icons/fi';

const Header = ({ selectedCategory, setSelectedCategory }) => {
  //  defined categories matching 
  const categories = ["Electronics", "Fashion", "Home & Living", "Groceries", "Beauty"];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Navbar Containment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a href="/" className="text-2xl font-black tracking-tight text-orange-600 flex-shrink-0">
          MERKATO<span className="text-gray-900 font-medium text-lg ml-1">STORE</span>
        </a>

        {/* Unified Search and Category Options Block */}
        <div className="flex-1 max-w-xl mx-4 hidden md:flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-full text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiSearch size={18} />
            </div>
          </div>

          {/* Integrated Category Select Option Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-100 border-t border-b border-r border-gray-300 text-gray-700 text-sm rounded-r-full font-semibold px-4 py-2 outline-none cursor-pointer hover:bg-gray-200 transition-all h-[38px]"
          >
            <option value="All">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Cart Icon Notification Action Trigger Container */}
        <div className="flex items-center gap-4 text-gray-600">
          <button className="p-2 hover:text-orange-600 relative transition-colors" aria-label="Cart">
            <FiShoppingCart size={22} />
            <span className="absolute top-1 right-1 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;