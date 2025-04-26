import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ImageCheck = () => {
  // Image moderation states
  const [selectedFile, setSelectedFile] = useState(null);
  const [moderationResult, setModerationResult] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [error, setError] = useState(null);

  // Handle image file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setModerationResult(null);
      setError(null);
    }
  };
  
  // Handle image moderation submission
  const handleImageModeration = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }
    
    setIsProcessingImage(true);
    
    const formData = new FormData();
    formData.append('media', selectedFile);
    formData.append('models', 'genai');
    
    // Use optional chaining to avoid errors if env variables aren't defined
    const apiUser = import.meta.env?.VITE_API_USER;
    const apiSecret = import.meta.env?.VITE_API_SECRET;
    const apiImageUrl = import.meta.env?.VITE_API_IMAGE;
    
    if (apiUser) formData.append('api_user', apiUser);
    if (apiSecret) formData.append('api_secret', apiSecret);
    
    try {
      const response = await axios.post(apiImageUrl || '/api/image-check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setModerationResult(response.data);
      setError(null);
      setIsProcessingImage(false);
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
      setIsProcessingImage(false);
    }
  };

  return (
    <div className="p-1">
      <div className="border-2 border-dashed border-indigo-200 rounded-lg p-4 text-center mb-4">
        <input
          type="file"
          id="image-upload"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        <motion.label 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          htmlFor="image-upload"
          className="cursor-pointer block"
        >
          {selectedFile ? (
            <div className="text-indigo-600 mb-2">
              {selectedFile.name}
              <span className="text-gray-500 text-sm ml-2">
                ({Math.round(selectedFile.size / 1024)} KB)
              </span>
            </div>
          ) : (
            <div>
              <motion.div 
                className="text-5xl mb-3"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >📷</motion.div>
              <div className="text-indigo-600 font-medium">Click to upload an image</div>
              <div className="text-sm text-gray-500 mt-2">Check if an image is AI-generated or real</div>
              <div className="mt-3 text-xs text-gray-400">Supported formats: JPG, PNG, GIF, WebP</div>
            </div>
          )}
        </motion.label>
      </div>
      
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-2">Image preview:</p>
            <div className="bg-gray-100 rounded-lg p-2 flex justify-center">
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                className="max-h-60 rounded shadow-sm"
              />
            </div>
          </div>
          
          <motion.button
            whileHover={{ backgroundColor: isProcessingImage ? "#9ca3af" : "#4338ca" }}
            whileTap={{ scale: isProcessingImage ? 1 : 0.98 }}
            onClick={handleImageModeration}
            disabled={isProcessingImage}
            className={`w-full py-3 rounded-lg ${isProcessingImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-md transition-colors flex items-center justify-center font-medium`}
          >
            {isProcessingImage ? (
              <>
                <motion.div 
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                Analyzing Image...
              </>
            ) : (
              <>Detect AI-Generated Content</>
            )}
          </motion.button>
        </motion.div>
      )}
      
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {moderationResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Image Analysis Result</h3>
            
            <div className="mb-5">
              <div className="text-sm text-gray-600 mb-1">AI Generated Score:</div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${(moderationResult?.type?.ai_generated * 100).toFixed(0) || 0}%` }}
                  transition={{ duration: 1, type: "spring" }}
                  className={`h-full ${moderationResult?.type?.ai_generated > 0.5 ? 'bg-red-500' : 'bg-green-500'}`}
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0%</span>
                <span className="font-medium">{(moderationResult?.type?.ai_generated * 100).toFixed(2) || 0}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`p-3 rounded-lg text-center font-bold ${
                moderationResult?.type?.ai_generated > 0.5 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}
            >
              <div className="text-2xl mb-2">
                {moderationResult?.type?.ai_generated > 0.5 
                  ? '⚠️ AI-Generated Content Detected' 
                  : '✅ Likely Real Image'}
              </div>
              <div className="text-sm font-normal">
                {moderationResult?.type?.ai_generated > 0.5 
                  ? 'This image shows signs of being created by AI tools' 
                  : 'This image appears to be authentic and not AI-generated'}
              </div>
            </motion.div>
            
            {/* Additional explanation */}
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="mb-2">
                <span className="font-medium">What this means: </span> 
                Our AI detection model has analyzed various features in this image to determine if it was created by AI tools like DALL-E, Midjourney, or Stable Diffusion.
              </p>
              <p>
                {moderationResult?.type?.ai_generated > 0.7 
                  ? 'This image has strong indicators of AI generation, such as unnatural patterns, strange details in faces or hands, or unusual textures.' 
                  : moderationResult?.type?.ai_generated > 0.5
                    ? 'This image has some indicators of AI generation, but the result is not completely definitive.'
                    : 'This image has characteristics consistent with natural photos or traditionally created images.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageCheck;