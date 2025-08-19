import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import Hero from '../components/Hero.jsx';
import Footer from '../components/Footer.jsx';

const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Features Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Choose Netflix Clone?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the best of streaming with our feature-rich platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Unlimited Entertainment",
                description: "Access thousands of movies and TV shows from various genres",
                icon: "🎬"
              },
              {
                title: "Personalized Experience",
                description: "Get recommendations based on your viewing history and preferences",
                icon: "✨"
              },
              {
                title: "Watch Anywhere",
                description: "Stream on your phone, tablet, laptop, and TV",
                icon: "📱"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-netflix-red">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to watch? Enter your email to create or restart your membership.
            </h2>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-block bg-white text-netflix-red font-semibold px-8 py-4 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started
              </Link>
            )}
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
