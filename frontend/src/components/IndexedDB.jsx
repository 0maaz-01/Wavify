import React, { useState, useRef } from 'react';

// IndexedDB utility functions
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ChunkDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    // Create object store if it doesn't exist
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('chunks')) {
        db.createObjectStore('chunks', { keyPath: 'id' });
      }
    };
  });
};

const storeChunk = async (db, chunk, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chunks'], 'readwrite');
    const store = transaction.objectStore('chunks');
    const request = store.put({ id, data: chunk });
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

const getAllChunks = async (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chunks'], 'readonly');
    const store = transaction.objectStore('chunks');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const clearAllChunks = async (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chunks'], 'readwrite');
    const store = transaction.objectStore('chunks');
    const request = store.clear();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};




const IndexedDB = () => {
  const [status, setStatus] = useState('Ready to process files');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [hasStoredChunks, setHasStoredChunks] = useState(false);
  const fileInputRef = useRef(null);

  // Constants
  const CHUNK_SIZE = 1024 * 1024; // 1 MB chunks

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type
    });

    setStatus(`Selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    setProgress(0);
    setHasStoredChunks(false);
  };

  const processFile = async () => {
    if (!fileInfo) {
      setStatus('Please select a file first');
      return;
    }

    const file = fileInputRef.current.files[0];
    setIsProcessing(true);
    setProgress(0);

    try {
      // Open IndexedDB connection
      const db = await openDatabase();
      
      // Clear existing chunks first
      await clearAllChunks(db);
      setStatus('Cleared previous chunks from database');

      // Calculate total number of chunks
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      
      // Process file in chunks
      for (let chunkId = 0; chunkId < totalChunks; chunkId++) {
        const start = chunkId * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        
        // Create chunk from file slice
        const chunk = file.slice(start, end);
        
        // Convert chunk to ArrayBuffer for storage
        const arrayBuffer = await chunk.arrayBuffer();
        
        // Store chunk in IndexedDB
        await storeChunk(db, chunkId, arrayBuffer);
        
        // Update progress
        const progressPercent = ((chunkId + 1) / totalChunks) * 100;
        setProgress(progressPercent);
        setStatus(`Storing chunk ${chunkId + 1} of ${totalChunks}`);
        
        // Small delay to allow UI updates
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      setStatus(`Successfully stored ${totalChunks} chunks in IndexedDB`);
      setHasStoredChunks(true);
      
    } catch (error) {
      console.error('Error processing file:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const reassembleAndDownload = async () => {
    if (!hasStoredChunks) {
      setStatus('No chunks stored. Please process a file first.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Open IndexedDB connection
      const db = await openDatabase();
      
      // Retrieve all chunks
      setStatus('Retrieving chunks from IndexedDB...');
      const chunks = await getAllChunks(db);
      
      // Sort chunks by ID to ensure correct order
      chunks.sort((a, b) => a.id - b.id);
      
      setStatus(`Retrieved ${chunks.length} chunks, reassembling file...`);
      
      // Convert ArrayBuffers back to Blobs and combine them
      const blobParts = chunks.map(chunk => new Blob([chunk.data]));
      const reassembledBlob = new Blob(blobParts, { type: fileInfo.type });
      
      // Create download link
      const url = URL.createObjectURL(reassembledBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `reassembled_${fileInfo.name}`;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up URL
      URL.revokeObjectURL(url);
      
      setStatus(`Successfully downloaded reassembled file: ${fileInfo.name}`);
      setProgress(100);
      
    } 
    catch (error) {
      console.error('Error reassembling file:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearDatabase = async () => {
    try {
      const db = await openDatabase();
      await clearAllChunks(db);
      setStatus('Cleared all chunks from database');
      setHasStoredChunks(false);
      setProgress(0);
    } 
    catch (error) {
      console.error('Error clearing database:', error);
      setStatus(`Error clearing database: ${error.message}`);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          
          {/* File Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select File to Process
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-medium
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100
                         cursor-pointer"
            />
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status Message */}
          <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-blue-800 text-sm">
              <span className="font-medium">Status:</span> {status}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={processFile}
              disabled={!fileInfo || isProcessing}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                         hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition-colors duration-200"
            >
              {isProcessing ? 'Processing...' : 'Split & Store in IndexedDB'}
            </button>

            <button
              onClick={reassembleAndDownload}
              disabled={!hasStoredChunks || isProcessing}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg
                         hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition-colors duration-200"
            >
              {isProcessing ? 'Processing...' : 'Reassemble & Download'}
            </button>

            <button
              onClick={clearDatabase}
              disabled={isProcessing}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg
                         hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                         transition-colors duration-200"
            >
              Clear Database
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default IndexedDB;