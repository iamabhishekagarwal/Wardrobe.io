import {React,useState,useEffect}  from 'react';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import { HeroParallax } from '../components/ui/Parallax';
import axiosInstance from '../api/AxiosInstance';

const Homepage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axiosInstance.get('/wardrobeItems/getAllItems')
      .then(response => {
        setItems(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      
      <HeroParallax products={items} />
    </div>
  );
};

export default Homepage;
