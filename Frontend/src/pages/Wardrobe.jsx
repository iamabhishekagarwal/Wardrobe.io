import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Navbar from "../components/navbar/Navbar";

const initialWardrobeData = [];

// Context for 3D mouse interaction
const MouseEnterContext = createContext(undefined);

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (!context) {
    throw new Error('useMouseEnter must be used within a MouseEnterProvider');
  }
  return context;
};

export const CardContainer = ({ children, className }) => {
  const containerRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 10;
    const y = (e.clientY - top - height / 2) / 10;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    containerRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={`py-10 flex flex-wrap justify-center ${className}`}
        style={{ perspective: '1000px' }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="transition-all duration-200 ease-linear"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({ children, className }) => {
  return (
    <div className={`h-80 w-80 mx-4 my-6 [transform-style:preserve-3d] ${className}`}>
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = 'div',
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const ref = useRef(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
    }
  };

  return (
    <Tag
      ref={ref}
      className={`w-full h-full transition-transform duration-300 ease-linear bg-white shadow-lg rounded-lg p-6 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

const Wardrobe = () => {
  const [wardrobeData, setWardrobeData] = useState(initialWardrobeData);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const imageUrl = URL.createObjectURL(file);
      const newWardrobeItem = {
        id: wardrobeData.length + 1,
        img: imageUrl,
        title: 'New Item',
        author: 'User',
      };
      setTimeout(() => {
        setWardrobeData([...wardrobeData, newWardrobeItem]);
        setIsUploading(false);
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-0">
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-4xl text-center font-bold mb-8">Explore Your Wardrobe</h1>

        <div className="text-center mb-6">
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-300 rounded-lg font-semibold"
          >
            {isUploading ? 'Uploading...' : 'Upload New Item'}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wardrobeData.map((data) => (
            <CardContainer key={data.id}>
              <CardBody>
                <CardItem>
                  <Link to={`/wardrobe/${data.id}`} className="flex flex-col h-full">
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-800">{data.title}</h3>
                      <p className="text-sm text-gray-600">{data.author}</p>
                    </div>
                  </Link>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;
