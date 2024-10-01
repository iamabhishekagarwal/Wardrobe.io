"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import axiosInstance from "../api/AxiosInstance";
import { CardContainer, CardBody, CardItem } from "../components/ui/CardContainer"; 
import Typewriter from '../components/Typewriter'; 
import image1 from '../assets/image1.webp'; 
import { useAuth0 } from "@auth0/auth0-react";

const Homepage = () => {
  const [items, setItems] = useState([]);
  const [userID, setUserID] = useState(undefined);
  const { isAuthenticated, user } = useAuth0();

  async function checkUser() {
    try {
      const response = await axiosInstance.post(
        "/user/signin",
        {
          email: user.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const msg = response.data.msg;
      if (msg === "User verified successfully") {
        setUserID(response.data.id); 
      } else {
        try {
          const response2 = await axiosInstance.post('/user/signup',
            {
              email: user.email,
              name: user.given_name,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setUserID(response2.data.id);
        } catch (e) {
          console.log("Error signing up: " + e);
        }
      }
    } catch (error) {
      console.error("Error fetching user id: ", error);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      checkUser();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (userID) {
      axiosInstance
        .post("/wardrobeItems/getItems",{userId: userID})
        .then((response) => {
          setItems(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching items:", error);
        });
    }
  }, [userID]);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${image1})` }}
      >
        <div className="absolute inset-0 bg-gray-900 opacity-30"></div>
        <div className="container mx-auto px-6 text-center z-10">
          <h2 className="text-6xl font-bold mb-6 text-gray-50 leading-tight drop-shadow-lg">
            <Typewriter text="Simplify Your Wardrobe. Promote Sustainability." speed={70} />
          </h2>
          <p className="text-xl mb-8 text-semibold text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Organize your wardrobe, track usage, and make sustainable choices to reduce overconsumption and maximize the value of your items.
          </p>
          <a
            onClick={() => {
              document.getElementById('wardrobe-section').scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105 cursor-pointer"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Watch Your Wardrobe Section */}
      <section id="wardrobe-section" className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-5xl font-extrabold mb-16 text-green-600 leading-tight">
            Watch Your Wardrobe
          </h3>
          
          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.length > 0 ? (
              items.map((item) => (
                <CardContainer key={item.id} containerClassName="mx-auto">
                  <CardBody className="bg-white shadow-lg rounded-lg">
                    {/* Image */}
                    <CardItem className="rounded-t-lg">
                      <img
                        src={import.meta.env.IMAGE_API+item.imageUrl}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    </CardItem>
                    {/* Title */}
                    <CardItem className="p-4">
                      <h2 className="text-xl font-semibold">{item.name}</h2>
                    </CardItem>
                    {/* Description */}
                    <CardItem className="px-4 pb-4">
                      <p className="text-gray-500">{item.description}</p>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              ))
            ) : (
              <p>No items found</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
