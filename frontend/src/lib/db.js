// IndexedDB utility functions


export const openDatabase = () => {
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



export const storeChunk = async (db, chunk, id) => {
  // chunk name add krna h

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chunks'], 'readwrite');
    const store = transaction.objectStore('chunks');
    const request = store.put({ id, data: chunk });
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};



export const getAllChunks = async (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chunks'], 'readonly');
    const store = transaction.objectStore('chunks');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};



export const clearAllChunks = async (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['chunks'], 'readwrite');
    const store = transaction.objectStore('chunks');
    const request = store.clear();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};



export const clearDatabase = async () => {
    try {
      const db = await openDatabase();
      await clearAllChunks(db);
    } 
    catch (error) {
      console.error('Error clearing database:', error);
    }
  };



export const processFile = async (chunk, number) => {   // 1

    try {
      // Open IndexedDB connection
      const db = await openDatabase();

      // Convert chunk to ArrayBuffer for storage
      const arrayBuffer = await chunk.arrayBuffer();

      // Store chunk in IndexedDB
      await storeChunk(db, arrayBuffer, number);  
    } 
    catch (error) {
      console.error('Error processing file:', error);
    } 
    finally {
      console.log('Successully Uploaded to IndexedDB')
    }
  };




const generateFileName = () => {
  const now = new Date();

  const pad = (n) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  return `${date}_${time}`;
};





export const reassembleAndDownload = async () => {

    try {
      // Open IndexedDB connection
      const db = await openDatabase();
      
      const chunks = await getAllChunks(db);
      
      // Sort chunks by ID to ensure correct order
      chunks.sort((a, b) => a.id - b.id);
      
      
      // Convert ArrayBuffers back to Blobs and combine them
      const blobParts = chunks.map(chunk => new Blob([chunk.data]));
      const reassembledBlob = new Blob(blobParts, { type: 'video/webm' }); //////
      
      // Create download link
      const url = URL.createObjectURL(reassembledBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = generateFileName();
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up URL
      URL.revokeObjectURL(url);
      
    } 
    catch (error) {
      console.error('Error reassembling file:', error);
    } 
    finally {
        console.log("True")
    }
  };