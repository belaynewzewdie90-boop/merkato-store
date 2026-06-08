import { Link } from "react-router-dom";
import { FiTarget, FiEye, FiHeart, FiShield, FiStar, FiUsers } from "react-icons/fi";

const values = [
  {
    icon: FiHeart,
    title: "Authenticity",
    desc: "We source only genuine Ethiopian products, ensuring every item tells a story of quality and tradition.",
  },
  {
    icon: FiShield,
    title: "Trust",
    desc: "Secure transactions, transparent policies, and reliable service you can count on every time.",
  },
  {
    icon: FiStar,
    title: "Excellence",
    desc: "From product selection to delivery, we strive for the highest standards in everything we do.",
  },
  {
    icon: FiUsers,
    title: "Community",
    desc: "We support local artisans and businesses, building a marketplace that uplifts the entire community.",
  },
];

const timeline = [
  { year: "2020", event: "Merkato Store was founded with a vision to connect Ethiopian artisans with customers nationwide." },
  { year: "2021", event: "Expanded to 10+ cities, reaching hundreds of happy customers across the country." },
  { year: "2023", event: "Launched our online platform, making it easier than ever to shop authentic Ethiopian products." },
  { year: "2025", event: "Grew to over 1,000 products and 5,000 satisfied customers with 99% satisfaction rate." },
];

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-20">
        <div className="glass-card rounded-2xl p-10 md:p-16 max-w-3xl w-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            About{" "}
            <span className="text-orange-500">Merkato Store</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We are on a mission to bring the best of Ethiopia to your doorstep —
            connecting you with authentic products, local artisans, and a
            shopping experience built on trust and quality.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Story
          </h2>
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <p className="text-gray-600 leading-relaxed mb-6">
              Merkato Store was born from a simple idea: make Ethiopian products
              accessible to everyone. The name "Merkato" draws inspiration from
              the famous Merkato market in Addis Ababa — one of the largest open-air
              markets in Africa — symbolizing a vibrant, diverse, and authentic
              marketplace.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              What started as a small initiative has grown into a trusted
              e-commerce platform serving thousands of customers nationwide. We
              partner directly with local artisans, craftsmen, and producers to
              bring you products that reflect the rich heritage and craftsmanship
              of Ethiopia.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every order you place supports local communities and helps preserve
              traditional skills for generations to come. We are more than just a
              store — we are a bridge between Ethiopian makers and the world.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-8 md:p-10 text-center">
            <FiTarget className="text-4xl text-orange-500 mx-auto mb-5" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide a seamless, trustworthy platform where customers can
              discover and purchase authentic Ethiopian products while empowering
              local artisans and businesses to reach a wider audience.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-8 md:p-10 text-center">
            <FiEye className="text-4xl text-orange-500 mx-auto mb-5" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become the leading e-commerce destination for Ethiopian products,
              recognized globally for quality, authenticity, and exceptional
              customer experience.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Journey
          </h2>
          <div className="space-y-6">
            {timeline.map((t, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                <div className="text-2xl font-black text-orange-500 min-w-24">{t.year}</div>
                <p className="text-gray-600 leading-relaxed">{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            What We Stand For
          </h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-14 text-lg">
            Our core values guide everything we do.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-8 text-center group hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-5 group-hover:bg-orange-200 transition-colors">
                  <v.icon className="text-2xl text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="glass-card rounded-2xl p-10 md:p-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience the Merkato Difference
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto mb-8">
            Explore our curated collection of authentic Ethiopian products.
          </p>
          <Link
            to="/products"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
