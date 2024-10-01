import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import axiosInstance from '../api/AxiosInstance';
import { useAuth0 } from '@auth0/auth0-react';

function Compare() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [databaseImages, setDatabaseImages] = useState([]);
  const [imageUrl , setImageUrl] = useState(undefined);
  const {isAuthenticated,user} = useAuth0();
  const [userID,setUserID] = useState(undefined);
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
      if (msg=="User verified successfully") {
        console.log(response.data.id)
        setUserID(response.data.id); 
      }
      else{
        try{
          const response2 = await axiosInstance.post('/user/signup',
            {
              email: user.email,
              name: user.given_name ,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response.data.id)
        }
        catch(e){
          console.log("error sending req to signup")
        }
      }
      
    } catch (error) {
      console.error("Error fetching user id : ", error);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      checkUser();
    }  
  })
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
        "userId" : userID,
        "visionResponse" : data
      }
      console.log(compareData)
      const response2 = await axiosInstance.post("/user/compare-images",compareData,{
        headers:{
            "Content-Type" : 'application/json'
        }
      })
      console.log(response2.data[0].imageUrl)
      if(response2.data[0].imageUrl !== undefined){
        setImageUrl(response2.data[0].imageUrl)
      }
      console.log(response2.data[0].imageUrl)
    }
    catch(e){
        console.log("Error comparing images "+e);
    }

  }
  return (
  <>
      <Navbar />
      {isAuthenticated?<><div className="min-h-screen bg-gray-100">
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
        src={`https://wardrobe-io.onrender.com${imageUrl}`}
        alt="Compared Image"
        className="w-full max-w-xs h-auto rounded-lg shadow-lg border border-gray-300"
      />
    </div>
  )}
</div>

          )}
        </div>
      </div>
    </div></>:<div className="flex items-center justify-center h-screen">
  <p className="text-center">Login to access this page</p>
</div>}
    
    </>
  );
}

export default Compare;