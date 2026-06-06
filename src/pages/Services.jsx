export default function Service() {
  const services = [
    {
      id: 1,
      title: "Fast Delivery",
      description:
        "We deliver products quickly across Addis Ababa and surrounding areas.",
      icon: "🚚",
    },
    {
      id: 2,
      title: "Cash on Delivery",
      description:
        "Pay only when your order arrives safely at your location.",
      icon: "💵",
    },
    {
      id: 3,
      title: "24/7 Customer Support",
      description:
        "Our support team is available anytime to help with your orders.",
      icon: "📞",
    },
    {
      id: 4,
      title: "Quality Guarantee",
      description:
        "All products are carefully selected to ensure the highest quality.",
      icon: "✅",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold">
          Our Services
        </span>

        <h1 className="text-4xl font-extrabold mt-4 text-gray-900">
          Why Shop With Merkato Store?
        </h1>

        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          We provide reliable services to ensure a smooth and enjoyable shopping
          experience for every customer.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center"
          >
            <div className="text-5xl mb-4">{service.icon}</div>

            <h3 className="font-bold text-xl text-gray-800 mb-2">
              {service.title}
            </h3>

            <p className="text-gray-500 text-sm">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-orange-500 text-white rounded-3xl p-10 text-center">
        <h2 className="text-3xl font-bold mb-3">
          Ready to Start Shopping?
        </h2>

        <p className="mb-6 text-orange-100">
          Browse our collection of authentic Ethiopian products today.
        </p>

        <a
          href="/products"
          className="bg-white text-orange-500 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Explore Products
        </a>
      </div>
    </div>
  );
}