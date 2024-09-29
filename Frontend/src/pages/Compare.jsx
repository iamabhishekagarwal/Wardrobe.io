import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import axiosInstance from '../api/AxiosInstance';

function Compare() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [databaseImages, setDatabaseImages] = useState([]);
  const [imageUrl , setImageUrl] = useState(undefined);
  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    if (file) {
      const reader = new FileReader();
      const fileName = file.name;
  
      // Fetch labels and dominant colors after reading the file
      fetchLabel(file);
  
      console.log(fileName);
      reader.onloadend = () => {
        setUploadedImage(reader.result); // Display the image in your app
      };
      reader.readAsDataURL(file); // Read the file as a data URL for preview purposes
    }
  };
  
  // Function to send the image as FormData to the backend
  const fetchLabel = async (file) => {
    const formData = new FormData();
    formData.append("image", file); // Append the image file with key "image"
  
    try {
      const response = await axiosInstance.post("/user/item/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Needed for file uploads
        },
      });
  
      // Log the labels and dominant colors from the server response
      console.log(response.data)
      console.log("Image Labels: ", response.data.labels);
      console.log("Dominant Colors: ", response.data.dominantColors);
      Compare(response.data);
      
    } catch (error) {
      console.log("Error uploading image", error);
    }
  };
  
  const Compare = async(data) =>{
    try{
    const compareData = {
        "userId" : 1,
        "visionResponse" : data
      }
      const response2 = await axiosInstance.post("/user/compare-images",compareData,{
        headers:{
            "Content-Type" : 'application/json'
        }
      })
      if(response2.data[0].imageUrl !== undefined){
        setImageUrl(response2.data[0].imageUrl)
      }
      console.log(response2.data[0].imageUrl)
    }
    catch(e){
        console.log("Error comparing images "+e);
    }

  }

  // Fetch database images (placeholder)
  const fetchDatabaseImages = async () => {
    try {
      const response = await fetch('/api/getDatabaseImages'); // Replace with actual API
      const data = await response.json();
      setDatabaseImages(data.images);
    } catch (error) {
      console.error('Error fetching database images:', error);
    }
  };

  useEffect(() => {
    fetchDatabaseImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar></Navbar>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-black text-center font-bold mb-2">Compare Image</h1>

        {/* Upload Section */}
        <div className="pt-4 flex justify-center mb-8">
          <label
            htmlFor="upload-button"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer transition-all"
          >
            Upload Image
          </label>
          <input
            id="upload-button"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Display Uploaded Image */}
        {uploadedImage && (
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-xl font-semibold mb-4">Uploaded Image:</h2>
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full max-w-xs h-auto rounded-lg shadow-lg border border-gray-300"
            />
          </div>
        )}

        {/* Display Database Images */}
        <h2 className="text-2xl font-semibold text-center mb-6">Database Image</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {databaseImages.length > 0 ? (
            databaseImages.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={image.url}
                  alt={`Database Image ${index + 1}`}
                  className="w-full h-40 object-cover"
                />
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500">
  {imageUrl === undefined ? (
    <div>No image found in the database</div>
  ) : (
    <div className="flex justify-center">
      <img
        src={`http://localhost:5172${imageUrl}`}
        alt="Compared Image"
        className="w-full max-w-xs h-auto rounded-lg shadow-lg border border-gray-300"
      />
    </div>
  )}
</div>

          )}
        </div>
      </div>
    </div>
  );
}

export default Compare;