import { useEffect, useState } from "react";
import axios from "axios";
import {
  CloudUploadIcon,
  RefreshIcon,
  CheckCircleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/solid";
import Markdown from "react-markdown";

export default function App() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 2000);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Image preview
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setText(response.data.text);
    } catch (error) {
      console.error(error);
      alert("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen overflow-auto flex ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } p-6 transition-colors duration-300`}
    >
      {/* Image Preview Section (Left Side) */}
      <div className="flex-1 flex items-center justify-center p-6">
        {preview ? (
          <div className="w-full h-full rounded-lg overflow-hidden  shadow-2xl">
            <img
              src={preview}
              alt="Uploaded preview"
              className="w-full h-full object-contain "
            />
          </div>
        ) : (
          <div
            className={`${
              darkMode ? "text-gray-400" : "text-gray-700"
            } text-center`}
          >
            <p className="text-2xl font-bold">
              Upload an image to get started!
            </p>
          </div>
        )}
      </div>

      {/* Upload and Response Section (Right Side) */}
      <div
        className={`flex-1 flex items-center justify-center ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-2xl rounded-xl p-8 transition-all duration-300`}
      >
        <div className="w-full max-w-md">
          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 cursor-pointer p-2 rounded-full bg-orange-500 hover:bg-teal-500 text-white transition-colors duration-200"
          >
            {darkMode ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>

          <h2 className="text-3xl font-bold mb-4">
            ✍️ AI Handwriting Recognition
          </h2>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>
            Convert handwritten text into digital format instantly!
          </p>

          {/* Image Upload Section */}
          <label
            className={`cursor-pointer flex flex-col items-center border-2 border-dashed ${
              darkMode
                ? "border-gray-600 bg-gray-700"
                : "border-gray-300 bg-gray-100"
            } p-5 rounded-xl mb-5 hover:border-teal-500 transition duration-200`}
          >
            <CloudUploadIcon
              className={`w-12 h-12 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } mb-2`}
            />
            <span
              className={`${
                darkMode ? "text-gray-400" : "text-gray-600"
              } font-medium cursor-pointer`}
            >
              Click to upload an image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className={`w-full flex items-center justify-center px-5 py-3 rounded-lg text-lg font-semibold transition-all cursor-pointer ${
              loading
                ? "bg-teal-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-teal-500 text-white"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshIcon className="w-6 h-6 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Upload & Convert"
            )}
          </button>

          {/* Extracted Text Section */}
          {text && (
            <div
              className={`mt-6 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              } p-5 rounded-xl text-left shadow-md`}
            >
              <h3 className="text-lg font-bold flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
                Extracted Text:
              </h3>
              <div
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mt-2 p-2 ${
                  darkMode ? "bg-gray-600" : "bg-white"
                } overflow-auto rounded-md`}
              >
                <Markdown>{text}</Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
