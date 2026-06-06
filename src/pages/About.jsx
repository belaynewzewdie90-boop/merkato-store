import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        About Us
      </h1>
      <p className="text-gray-600 max-w-md mb-8">
        We are Developers from group 1 
      </p>
      <Link
        to="/products"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow transition-all"
      >
        Move to Products
      </Link>
    </div>
  );
}
