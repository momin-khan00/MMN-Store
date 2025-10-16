import type { NextPage } from 'next';
import FeaturedCarousel from '../components/app/FeaturedCarousel'; // Placeholder
import AppList from '../components/app/AppList'; // Placeholder

const Home: NextPage = () => {
  return (
    <div className="space-y-12">
      {/* Featured Section */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Featured Apps</h1>
        {/* <FeaturedCarousel /> */}
        <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Featured Carousel coming soon...</p>
        </div>
      </section>

      {/* Main Apps Section */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Discover Apps</h2>
        {/* <AppList /> */}
        <div className="min-h-96 bg-gray-800/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">App List coming soon...</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
