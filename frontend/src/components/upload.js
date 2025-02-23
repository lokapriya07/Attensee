import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function UploadVideo() {
  const { section, subject } = useParams(); // Get parameters from URL
  const [uploadStatus, setUploadStatus] = useState(null); // State to track upload status
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setErrorMessage("No file selected. Please choose a file to upload.");
      return;
    }

    // Validate file type (e.g., allow only video files)
    const validTypes = ["video/mp4", "video/avi", "video/mov", "video/mkv"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload a valid video file.");
      return;
    }

    // Validate file size (e.g., limit to 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setErrorMessage("File is too large. Please upload a file smaller than 100MB.");
      return;
    }

    setErrorMessage(null); // Clear previous errors
    setUploadStatus("Uploading...");

    // Create a FormData object to send the file and additional data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", section);
    formData.append("subject", subject);

    try {
      // Replace the URL with your actual backend endpoint
      const response = await fetch("https://your-backend-url/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("File uploaded successfully!");
      } else {
        const errorData = await response.json();
        setErrorMessage(`Upload failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("An error occurred while uploading the file. Please try again.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Video</h2>
      <p>
        Section: <strong>{section}</strong>
      </p>
      <p>
        Subject: <strong>{subject}</strong>
      </p>
      <input type="file" onChange={handleFileUpload} />
      {uploadStatus && <p style={{ color: "green" }}>{uploadStatus}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
