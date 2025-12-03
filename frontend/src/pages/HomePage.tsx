import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import { IoSearchOutline, IoPricetagOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';

const HomePage: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-illini-blue text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Lost Something? Found Something?
          </h1>
          <p className="text-xl mb-8">
            The official lost and found platform for the University of Illinois community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link to="/report-lost">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Report Lost Item
                  </Button>
                </Link>
                <Link to="/report-found">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Report Found Item
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Browse Items
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* White Separator */}
      <div className="w-full h-1 bg-white"></div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-illini-blue mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-illini-orange rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <IoSearchOutline size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-illini-blue mb-2">Report & Search</h3>
              <p className="text-gray-600">
                Report lost or found items and search our extensive database to find matches
              </p>
            </div>

            <div className="text-center">
              <div className="bg-illini-orange rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <IoShieldCheckmarkOutline size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-illini-blue mb-2">Verify & Claim</h3>
              <p className="text-gray-600">
                Submit claims with verification details to prove ownership of items
              </p>
            </div>

            <div className="text-center">
              <div className="bg-illini-orange rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <IoPricetagOutline size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-illini-blue mb-2">Marketplace</h3>
              <p className="text-gray-600">
                Unclaimed items are listed in our marketplace for the community
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-illini-orange text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8">
            Join the Illini community in reuniting with lost belongings
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button variant="secondary" className="!bg-white !text-illini-orange hover:!bg-gray-100">
                Create Free Account
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;