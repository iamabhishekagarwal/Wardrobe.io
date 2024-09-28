import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const HeroParallax = ({
    products,
  title = "Explore Our Collection",
}) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]), // Adjusted here
    springConfig
  );
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  // Parallax effect for the dynamic title
  const titleTranslateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-100, 0]), springConfig);
  const titleOpacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, 1]), springConfig);

  // Split products into two equal rows
  const half = Math.ceil(products.length / 2);
  const firstRow = products.slice(0, half);
  const secondRow = products.slice(half);

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />

      {/* Parallax effect for the title */}
      <motion.h1
        style={{
          translateY: titleTranslateY,
          opacity: titleOpacity,
        }}
        className="text-6xl font-bold text-center text-gray-900 mb-20"
      >
        {title}
      </motion.h1>

      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        {/* First Row */}
        <motion.div className="flex space-x-10 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>

        {/* Second Row */}
        <motion.div className="flex space-x-10 mb-20" style={{ translateX: translateXReverse }}>
          {secondRow.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const Header = () => (
  <div className="container mx-auto px-4 text-center mb-16">
    <h2 className="text-6xl font-bold mb-6 text-gray-900 leading-tight drop-shadow-lg">New Arrivals</h2>
    <p className="text-xl text-semibold text-gray-700 max-w-2xl mx-auto leading-relaxed">
      Discover our latest collection of sustainable fashion pieces designed to make you look good while reducing your environmental impact.
    </p>
  </div>
);

const ProductCard = ({ product, translate }) => (
  <motion.div
    style={{ translateX: translate }}
    className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow w-80 p-6"
    initial={{ opacity: 0, y: 50 }} // Entry animation: start invisible and below
    animate={{ opacity: 1, y: 0 }} // Animate to visible and in place
    exit={{ opacity: 0, y: 50 }} // Exit animation: fade out and move down
    transition={{ duration: 0.5 }} // Smooth transition of 0.5 seconds
  >
    <div className="mb-4">
      <img src={`http://localhost:5172${product.imageUrl}`} alt={product.title} className="rounded-lg object-cover w-full h-48" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{product.title}</h3> {/* Light text for title */}
    <p className="text-gray-300">{product.description}</p> {/* Lighter text for description */}
    <div className="mt-4">
      <a href={product.href} className="inline-block text-teal-400 hover:underline font-semibold text-lg">
        Learn More
      </a>
    </div>
  </motion.div>
);
