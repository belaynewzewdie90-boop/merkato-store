import { Link } from "react-router-dom";
import { FiPackage, FiTruck, FiShield, FiHeadphones } from "react-icons/fi";

const features = [
  {
    icon: FiPackage,
    title: "Quality Products",
    desc: "Curated selection of authentic Ethiopian goods, from traditional crafts to modern essentials.",
  },
  {
    icon: FiTruck,
    title: "Fast Delivery",
    desc: "Reliable shipping across the country with real-time tracking on every order.",
  },
  {
    icon: FiShield,
    title: "Secure Shopping",
    desc: "Protected payments and hassle-free returns so you can shop with confidence.",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Support",
    desc: "Our dedicated team is always ready to help with any questions or concerns.",
  },
];

const stats = [
  { value: "5K+", label: "Happy Customers" },
  { value: "1K+", label: "Products" },
  { value: "50+", label: "Cities Covered" },
  { value: "99%", label: "Satisfaction Rate" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] text-center px-6 py-20">
        <div className="glass-card rounded-2xl p-10 md:p-16 max-w-3xl w-full animate-glow">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Welcome to{" "}
            <span className="text-orange-500">Merkato Store</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your trusted marketplace for authentic Ethiopian products.
            Discover handpicked goods delivered straight to your door with
            speed and care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]"
            >
              Browse Products
            </Link>
            <Link
              to="/services"
              className="glass-dark text-gray-700 hover:text-orange-600 font-semibold py-3.5 px-8 rounded-xl transition-all hover:scale-[1.02]"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Why Shop With Us?
          </h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-14 text-lg">
            We bring the best of Ethiopia to your doorstep with quality and trust.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-8 text-center group hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-5 group-hover:bg-orange-200 transition-colors">
                  <f.icon className="text-2xl text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto glass rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-orange-500 mb-2">{s.value}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="glass-card rounded-2xl p-10 md:p-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto mb-8">
            Join hundreds of satisfied customers and explore our curated collection today.
          </p>
          <Link
            to="/products"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
