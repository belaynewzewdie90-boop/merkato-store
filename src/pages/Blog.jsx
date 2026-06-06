import React from "react";

export default function Blog() {
  const recentProjects = [
    {
      id: 1,
      title: "E-Commerce Website",
      description: "Built a full-stack shopping platform with cart and checkout features.",
      date: "June 2026",
    },
    {
      id: 2,
      title: "Food Delivery App",
      description: "React-based UI for ordering and tracking food in real time.",
      date: "May 2026",
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "Personal portfolio showcasing projects and skills.",
      date: "April 2026",
    },
  ];

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      <p className="text-gray-600 mb-8">
        Latest updates and recent projects I've worked on.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <span className="text-sm text-blue-500 mt-3 block">
              {project.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}