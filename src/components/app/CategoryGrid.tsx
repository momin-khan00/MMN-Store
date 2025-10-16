// src/components/app/CategoryGrid.tsx
import React from 'react';
import Link from 'next/link';

const CategoryGrid: React.FC = () => {
  const categories = [
    { name: 'Games', icon: '🎮', color: 'bg-red-500' },
    { name: 'Productivity', icon: '💼', color: 'bg-blue-500' },
    { name: 'Social', icon: '👥', color: 'bg-green-500' },
    { name: 'Entertainment', icon: '🎬', color: 'bg-purple-500' },
    { name: 'Education', icon: '📚', color: 'bg-yellow-500' },
    { name: 'Tools', icon: '🔧', color: 'bg-gray-500' },
    { name: 'Lifestyle', icon: '🌟', color: 'bg-pink-500' },
    { name: 'Finance', icon: '💰', color: 'bg-indigo-500' },
    { name: 'Health & Fitness', icon: '💪', color: 'bg-orange-500' },
    { name: 'Photography', icon: '📷', color: 'bg-teal-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Link key={category.name} href={`/apps?category=${category.name.toLowerCase().replace(' & ', '-')}`}>
          <a className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
            <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <span className="text-2xl">{category.icon}</span>
            </div>
            <h3 className="font-medium text-gray-800">{category.name}</h3>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
