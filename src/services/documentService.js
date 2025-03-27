// services/documentService.js
import { analyzeSopDocument } from './sopDocumentAnalysis';

/**
 * Extracts text and analyzes various document types
 * Provides specialized analysis for SOP documents
 * 
 * @param {File} file - The uploaded file object
 * @returns {Promise} - Promise resolving to extracted text and analysis
 */
export const extractTextFromDocument = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file provided");
      return;
    }

    try {
      const fileName = file.name.toLowerCase();
      
      // Check if this is an SOP or version update document
      if ((fileName.includes('sop') || fileName.includes('standard operating procedure')) && 
          (fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.doc'))) {
        // Use specialized SOP document analysis
        analyzeSopDocument(file).then(resolve).catch(error => {
          console.warn("SOP analysis error:", error);
          // Fall back to basic analysis
          extractBasicFileInfo(file, "SOP document").then(resolve).catch(reject);
        });
      }
      // Handle different file types
      else if (fileName.endsWith('.pdf')) {
        // Basic PDF handling with minimal dependencies
        extractBasicFileInfo(file, "PDF").then(resolve).catch(reject);
      } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        extractBasicFileInfo(file, "Word document").then(resolve).catch(reject);
      } else if (fileName.endsWith('.txt')) {
        extractTextFromTxt(file).then(resolve).catch(reject);
      } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')) {
        extractBasicFileInfo(file, "Image").then(resolve).catch(reject);
      } else {
        reject(`Unsupported file type: ${file.type}. Please upload PDF, DOCX, TXT, JPG, or PNG files.`);
      }
    } catch (error) {
      reject(`Error processing file: ${error.message}`);
    }
  });
};

/**
 * Extract text from TXT files using FileReader
 * @param {File} file - The TXT file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromTxt = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        resolve(`Document Analysis: ${file.name}\n\n${text}`);
      } catch (error) {
        reject(`Error reading text file: ${error.message}`);
      }
    };
    
    reader.onerror = () => {
      reject("Error reading text file");
    };
    
    reader.readAsText(file);
  });
};

/**
 * Extract basic file information when detailed extraction isn't available
 * @param {File} file - The file
 * @param {string} fileType - The type of file ("PDF", "Word document", "Image", etc.)
 * @returns {Promise<string>} - Basic file information
 */
const extractBasicFileInfo = (file, fileType) => {
  return new Promise((resolve) => {
    // Generate analysis based on file metadata
    const fileInfo = {
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      type: file.type || `${fileType} file`,
      lastModified: new Date(file.lastModified).toLocaleString()
    };
    
    let analysisText = `Document Analysis: ${file.name}\n\n`;
    
    analysisText += `## File Information\n\n`;
    analysisText += `- **Name**: ${fileInfo.name}\n`;
    analysisText += `- **Size**: ${fileInfo.size}\n`;
    analysisText += `- **Type**: ${fileInfo.type}\n`;
    analysisText += `- **Last Modified**: ${fileInfo.lastModified}\n\n`;
    
    analysisText += `## Content Analysis\n\n`;
    analysisText += `Document content could not be fully extracted. However, based on the file name and type, this appears to be a ${fileType}`;
    
    // Add specific analysis based on document type and name
    if (file.name.toLowerCase().includes('display')) {
      analysisText += ` related to display systems or visual interfaces`;
    }
    
    if (file.name.toLowerCase().includes('version') || file.name.toLowerCase().includes('update')) {
      analysisText += ` containing version updates or change information`;
    }
    
    analysisText += `.\n\n`;
    analysisText += `For more detailed analysis, consider using the specialized analysis tools or uploading a document with machine-readable text.`;
    
    // Simulate processing time
    setTimeout(() => {
      resolve(analysisText);
    }, 500);
  });
};