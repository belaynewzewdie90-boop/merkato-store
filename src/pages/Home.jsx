import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Welcome to Merkato Store
      </h1>
      <p className="text-gray-600 max-w-md mb-8">
        Discover top Ethiopian products with responsive, fast configurations right
        at Our Customers.
      </p>
      <Link
        to="/products"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow transition-all"
      >
        Currently Products
      </Link>
    </div>
  );
}
