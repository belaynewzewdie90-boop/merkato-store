import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        About Us
      </h1>
      <p className="text-gray-600 max-w-md mb-8">
        Merkato Store is an innovative e-commerce platform designed to provide a seamless shopping experience for customers looking to purchase a wide range of products online. 
        The name "Merkato" is Center of market reflecting the website's goal of creating a virtual marketplace that connects buyers with sellers.
      </p>
      <Link
        to="/products"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow transition-all"
      >
       Go to Products
      </Link>
    </div>
  );
}
