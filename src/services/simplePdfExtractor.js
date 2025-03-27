// services/simplePdfExtractor.js

/**
 * A simple PDF text extractor that doesn't require external PDF.js worker configuration
 * This uses a basic approach to extract some text from PDF files
 * Note: This is not as comprehensive as a full PDF.js implementation
 * 
 * @param {File} file - The PDF file to extract text from
 * @returns {Promise<string>} - Promise resolving to extracted text
 */
export const extractBasicPdfText = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
        reject("Not a valid PDF file");
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Basic PDF text extraction
          // This is a simplified approach that won't work for all PDFs
          // but can extract some text without requiring the PDF.js worker
          let pdfText = '';
          let textChunks = [];
          
          // Look for text objects in the PDF
          // This is a very basic implementation that works for some PDFs
          const pdfString = new TextDecoder().decode(uint8Array);
          
          // Extract text between "BT" (Begin Text) and "ET" (End Text) markers
          const textMarkers = pdfString.match(/BT[\s\S]+?ET/g) || [];
          
          textMarkers.forEach(marker => {
            // Extract text objects with Tj or TJ operators
            const textObjects = marker.match(/\((.*?)\)[\s]*(Tj|TJ)/g) || [];
            textObjects.forEach(obj => {
              // Extract the text content
              const match = obj.match(/\((.*?)\)/);
              if (match && match[1]) {
                textChunks.push(decodePdfText(match[1]));
              }
            });
          });
          
          // If we found some text
          if (textChunks.length > 0) {
            pdfText = textChunks.join(' ');
          } else {
            pdfText = "Could not extract detailed text from this PDF. It may be scanned or have security restrictions.";
          }
          
          const result = `Document Analysis: ${file.name}\n\n${pdfText}`;
          resolve(result);
        } catch (error) {
          reject(`Error extracting PDF text: ${error.message}`);
        }
      };
      
      reader.onerror = () => {
        reject("Error reading PDF file");
      };
      
      reader.readAsArrayBuffer(file);
    });
  };
  
  /**
   * Decode PDF text which may contain escape sequences and special characters
   * @param {string} text - The encoded PDF text
   * @returns {string} - Decoded text
   */
  const decodePdfText = (text) => {
    // Handle some common PDF text encodings
    return text
      // Replace octal character codes
      .replace(/\\(\d{3})/g, (match, octal) => {
        return String.fromCharCode(parseInt(octal, 8));
      })
      // Replace hex character codes
      .replace(/\\([0-9a-fA-F]{2})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      })
      // Replace escape sequences
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')');
  };