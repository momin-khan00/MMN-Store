import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MMN Store</h3>
            <p className="text-gray-400 text-sm">
              Modern Multi-Role App Store for developers and users.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/">
                  <a className="hover:text-white">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/apps">
                  <a className="hover:text-white">Apps</a>
                </Link>
              </li>
              <li>
                <Link href="/categories">
                  <a className="hover:text-white">Categories</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Developers</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/upload">
                  <a className="hover:text-white">Upload App</a>
                </Link>
              </li>
              <li>
                <Link href="/developer/dashboard">
                  <a className="hover:text-white">Developer Dashboard</a>
                </Link>
              </li>
              <li>
                <Link href="/developer/guidelines">
                  <a className="hover:text-white">Submission Guidelines</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/help">
                  <a className="hover:text-white">Help Center</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-white">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="hover:text-white">Privacy Policy</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MMN Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
