
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Cpu, Monitor, Keyboard, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Cpu className="text-blue-600 h-8 w-8" />
              <span className="text-2xl font-black text-gray-900 tracking-tighter">TECHCORE</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Laptops</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Desktops</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Custom Build</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Deals</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/admin/login" className="text-sm text-gray-500 hover:text-gray-700">Admin Portal</Link>
              <button className="p-2 text-gray-600 hover:text-blue-600 relative">
                <ShoppingCart />
                <span className="absolute top-0 right-0 h-4 w-4 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-900 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://picsum.photos/1920/1080?gaming" alt="bg" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left">
          <div className="lg:flex items-center justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                Next-Gen <span className="text-blue-500">Computing</span> for Professionals
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-xl">
                Custom built workstations, high-end gaming rigs, and premium accessories delivered to your doorstep.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  Shop Now <ArrowRight size={20} />
                </button>
                <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                  Custom Configurator
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Popular Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Laptops', img: 'https://picsum.photos/400/500?laptop', count: '120+ Items' },
            { title: 'Graphics Cards', img: 'https://picsum.photos/400/500?gpu', count: '45 Items' },
            { title: 'Peripherals', img: 'https://picsum.photos/400/500?keyboard', count: '300+ Items' },
          ].map((cat, idx) => (
            <div key={idx} className="group relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <span className="text-blue-400 font-semibold mb-2">{cat.count}</span>
                <h3 className="text-2xl font-bold text-white mb-4">{cat.title}</h3>
                <button className="w-fit px-4 py-2 bg-white text-gray-900 rounded-md font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  View Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 py-12 border-y">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <h4 className="font-bold text-lg mb-1">Fast Delivery</h4>
            <p className="text-sm text-gray-500">24-hour shipping</p>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-lg mb-1">Official Warranty</h4>
            <p className="text-sm text-gray-500">Authorized dealer</p>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-lg mb-1">24/7 Support</h4>
            <p className="text-sm text-gray-500">Expert tech advice</p>
          </div>
          <div className="text-center">
            <h4 className="font-bold text-lg mb-1">Easy Returns</h4>
            <p className="text-sm text-gray-500">30-day policy</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
