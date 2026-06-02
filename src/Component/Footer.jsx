import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright Text */}
        <p className="text-sm text-gray-500 order-2 md:order-1 text-center md:text-left">
          &copy; {new Date().getFullYear()} Merkato Store. All rights reserved.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 order-1 md:order-2">
          <a
            href="/about"
            className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
          >
            About
          </a>
          <a
            href="/contact"
            className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
          >
            Contact
          </a>
          <a
            href="/privacy"
            className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
