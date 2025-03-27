// components/verification/SimpleVerification.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const SimpleVerification = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState('document');
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Handle document upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile(file);
  };
  
  // Handle document submit
  const handleDocumentSubmit = () => {
    if (!uploadedFile) return;
    
    onSubmit({
      type: 'document',
      filename: uploadedFile.name
    });
    
    // Reset the file input
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-900">Verify with Document</h2>
      
      <div className="mb-4">
        <label 
          htmlFor="document-upload" 
          className="block w-full p-4 border-2 border-dashed border-indigo-300 rounded-lg text-center cursor-pointer hover:bg-indigo-50"
        >
          {uploadedFile ? (
            <span className="text-indigo-700">
              {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </span>
          ) : (
            <>
              <span className="text-indigo-500 block mb-2">📄 Upload a document to verify</span>
              <span className="text-gray-500 text-sm">PDF, DOCX, JPG, PNG</span>
            </>
          )}
        </label>
        <input 
          id="document-upload" 
          type="file" 
          className="hidden" 
          accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleDocumentSubmit}
        disabled={!uploadedFile}
        className={`w-full py-3 rounded-lg ${uploadedFile ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
      >
        Verify Document
      </motion.button>
      
      <div className="mt-6 p-3 bg-indigo-50 rounded-lg">
        <p className="text-sm text-indigo-800">
          Upload a document to have its claims verified against our fact-checking database.
        </p>
      </div>
    </div>
  );
};

export default SimpleVerification;