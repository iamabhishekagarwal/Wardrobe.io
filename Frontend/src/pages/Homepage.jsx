import {React,useEffect,useState} from 'react';
import Navbar from '../components/navbar/Navbar'; // Assuming Navbar is already present
import image1 from '../assets/image1.webp'; // Add your own image path
import Typewriter from '../components/Typewriter'; // Include this file as a component
import axiosInstance from '../api/AxiosInstance';
import Footer from '../components/footer/footer';
const Homepage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axiosInstance.get('/wardrobeItems/getAllItems')
      .then(response => {
        setItems(response.data); // Set the items array to the fetched data
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }, []);
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${image1})` }}
      >
        <div className="absolute inset-0 bg-gray-900 opacity-30"></div> {/* Softer Gradient Overlay */}
        <div className="container mx-auto px-6 text-center z-10">
          <h2 className="text-6xl font-bold mb-6 text-gray-50 leading-tight drop-shadow-lg">
            <Typewriter text="Simplify Your Wardrobe. Promote Sustainability." speed={70} />
          </h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Organize your wardrobe, track usage, and make sustainable choices to reduce overconsumption and maximize the value of your items.
          </p>
          <a
            onClick={() => {
              document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 cursor-pointer"
          >
            Get Started
          </a>
        </div>
      </section>
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <h3 className="text-5xl font-extrabold text-center mb-16 text-green-600 leading-tight">
            Wardrobe Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {items.map(item => (
              <div key={item.id} className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2">
                <img src={`http://localhost:5172${item.imageUrl}`} alt={item.name} className="mb-4 w-full h-64 object-cover rounded-md" />
                <h4 className="text-2xl font-bold mb-2 text-green-600">{item.name}</h4>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
                <p className="text-sm text-gray-600">Category: {item.category}</p>
                <p className="text-sm text-gray-600">Color: {item.color}</p>
                <div className="flex mt-4 space-x-2">
                  {item.tags.map(tag => (
                    <span key={tag.id} className="text-xs bg-green-200 text-green-800 py-1 px-3 rounded-full">
                      {tag.tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>     
      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-100 relative">
        <div className="container mx-auto px-6">
          <h3 className="text-5xl font-extrabold text-center mb-16 text-green-600 tracking-tight leading-tight">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Feature 1 */}
            <div className="bg-white p-10 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2">
              <h4 className="text-2xl font-bold mb-4 text-green-600">Wardrobe Organization</h4>
              <p className="text-gray-700 leading-relaxed">
                Easily categorize and organize your wardrobe to ensure that your favorite outfits and accessories are always at hand.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-10 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2">
              <h4 className="text-2xl font-bold mb-4 text-green-600">Track Usage</h4>
              <p className="text-gray-700 leading-relaxed">
                Monitor how often you wear each item, ensuring you get the most out of your wardrobe and avoid unnecessary purchases.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-10 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-2">
              <h4 className="text-2xl font-bold mb-4 text-green-600">Sustainability Insights</h4>
              <p className="text-gray-700 leading-relaxed">
                Learn how your fashion choices impact the environment and receive tips on how to shop and live more sustainably.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="container mx-auto px-6">
          <h3 className="text-5xl font-extrabold text-center mb-16 text-green-600 leading-tight">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2">
              <h4 className="text-2xl font-bold mb-4 text-green-600">Step 1: Upload & Organize</h4>
              <p className="text-gray-700 leading-relaxed">
                Add your clothing, accessories, and other items to your virtual wardrobe and organize them into categories.
              </p>
            </div>
            {/* Step 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2">
              <h4 className="text-2xl font-bold mb-4 text-green-600">Step 2: Track Your Usage</h4>
              <p className="text-gray-700 leading-relaxed">
                Track how often you wear each item and identify which items you can reuse, donate, or recycle.
              </p>
            </div>
            {/* Step 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2">
              <h4 className="text-2xl font-bold mb-4 text-green-600">Step 3: Receive Sustainable Suggestions</h4>
              <p className="text-gray-700 leading-relaxed">
                Get personalized recommendations to reduce your fashion footprint and make more mindful purchases.
              </p>
            </div>
            {/* Step 4 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2">
              <h4 className="text-2xl font-bold mb-4 text-green-600">Step 4: Make Informed Choices</h4>
              <p className="text-gray-700 leading-relaxed">
                Use data-driven insights to decide whether to keep, reuse, donate, or recycle items based on your needs and sustainability goals.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </div>
  );
};

export default Homepage;
