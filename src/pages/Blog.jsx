import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiUser, FiArrowRight } from "react-icons/fi";

const posts = [
  {
    id: 1,
    title: "The Art of Ethiopian Coffee: A Journey from Bean to Cup",
    excerpt: "Discover the rich tradition of Ethiopian coffee culture and how we source the finest beans directly from local farmers.",
    author: "Merkato Team",
    date: "June 5, 2026",
    readTime: "5 min read",
    category: "Culture",
  },
  {
    id: 2,
    title: "5 Traditional Ethiopian Crafts You Need in Your Home",
    excerpt: "From handwoven textiles to pottery, explore the beautiful craftsmanship that makes Ethiopian decor truly unique.",
    author: "Merkato Team",
    date: "May 28, 2026",
    readTime: "4 min read",
    category: "Lifestyle",
  },
  {
    id: 3,
    title: "A Complete Guide to Shopping Online Safely in Ethiopia",
    excerpt: "Tips and best practices for secure online shopping — from payment protection to trusted sellers.",
    author: "Merkato Team",
    date: "May 20, 2026",
    readTime: "6 min read",
    category: "Guides",
  },
  {
    id: 4,
    title: "Supporting Local Artisans: Why It Matters More Than Ever",
    excerpt: "Learn how your purchases help sustain traditional skills and empower communities across Ethiopia.",
    author: "Merkato Team",
    date: "May 12, 2026",
    readTime: "4 min read",
    category: "Community",
  },
  {
    id: 5,
    title: "What to Look for When Buying Authentic Ethiopian Products Online",
    excerpt: "Not sure how to spot genuine goods? We break down the key signs of quality and authenticity.",
    author: "Merkato Team",
    date: "May 4, 2026",
    readTime: "5 min read",
    category: "Guides",
  },
  {
    id: 6,
    title: "Behind the Scenes: How We Prepare Your Order for Delivery",
    excerpt: "A peek into our packing and shipping process to ensure every order arrives perfect and on time.",
    author: "Merkato Team",
    date: "April 25, 2026",
    readTime: "3 min read",
    category: "Behind the Scenes",
  },
];

const categories = ["All", "Culture", "Lifestyle", "Guides", "Community", "Behind the Scenes"];

export default function Blog() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="glass-card rounded-2xl p-10 md:p-16 max-w-3xl w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Our <span className="text-orange-500">Blog</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stories, guides, and insights from the Merkato community —
            exploring Ethiopian culture, craftsmanship, and the art of mindful
            shopping.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 pb-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              className="glass-dark text-sm font-semibold text-gray-600 hover:text-orange-500 px-5 py-2 rounded-full transition-all hover:bg-white/20"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="glass-card rounded-2xl p-6 group hover:bg-white/20 transition-all duration-300 flex flex-col"
            >
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-3">
                {post.category}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-white/20">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <FiUser className="text-orange-400" size={12} />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-orange-400" size={12} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="text-orange-400" size={12} />
                    {post.readTime}
                  </span>
                </div>
                <FiArrowRight className="text-orange-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-20 text-center">
        <div className="glass-card rounded-2xl p-10 md:p-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stay in the Loop
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto mb-8">
            Get the latest stories and updates delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-xl glass-dark text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
