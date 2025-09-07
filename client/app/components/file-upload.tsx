'use client';
import * as React from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const FileUploadComponent: React.FC = () => {
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = React.useState<string>('');

  const handleFileUploadButtonClick = () => {
    if (uploadStatus === 'uploading') return;
    
    const el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', 'application/pdf');
    el.addEventListener('change', async (ev) => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          // Validate file type
          if (file.type !== 'application/pdf') {
            setUploadStatus('error');
            setUploadMessage('Please select a PDF file');
            setTimeout(() => {
              setUploadStatus('idle');
              setUploadMessage('');
            }, 3000);
            return;
          }

          // Validate file size (10MB limit)
          if (file.size > 10 * 1024 * 1024) {
            setUploadStatus('error');
            setUploadMessage('File size must be less than 10MB');
            setTimeout(() => {
              setUploadStatus('idle');
              setUploadMessage('');
            }, 3000);
            return;
          }

          setUploadStatus('uploading');
          setUploadMessage('Uploading and processing...');

          try {
            const formData = new FormData();
            formData.append('pdf', file);

            const response = await fetch('http://localhost:8000/upload/pdf', {
              method: 'POST',
              body: formData,
            });

            const result = await response.json();

            if (response.ok) {
              setUploadStatus('success');
              setUploadMessage(`Successfully uploaded: ${result.filename}`);
              setTimeout(() => {
                setUploadStatus('idle');
                setUploadMessage('');
              }, 3000);
            } else {
              setUploadStatus('error');
              setUploadMessage(result.error || 'Upload failed');
              setTimeout(() => {
                setUploadStatus('idle');
                setUploadMessage('');
              }, 3000);
            }
          } catch (error) {
            setUploadStatus('error');
            setUploadMessage('Failed to upload file. Please try again.');
            setTimeout(() => {
              setUploadStatus('idle');
              setUploadMessage('');
            }, 3000);
          }
        }
      }
    });
    el.click();
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="w-8 h-8 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Upload className="w-8 h-8" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'success':
        return 'border-green-500 bg-green-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'uploading':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-white bg-slate-900';
    }
  };

  return (
    <div className={`shadow-2xl flex justify-center items-center p-6 rounded-lg border-2 transition-colors ${getStatusColor()}`}>
      <div
        onClick={handleFileUploadButtonClick}
        className={`flex justify-center items-center flex-col cursor-pointer ${
          uploadStatus === 'uploading' ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="mb-4">
          {getStatusIcon()}
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${
          uploadStatus === 'idle' ? 'text-white' : 'text-gray-800'
        }`}>
          {uploadStatus === 'idle' ? 'Upload PDF File' : 
           uploadStatus === 'uploading' ? 'Processing...' :
           uploadStatus === 'success' ? 'Upload Complete!' : 'Upload Failed'}
        </h3>
        {uploadMessage && (
          <p className={`text-sm text-center ${
            uploadStatus === 'idle' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {uploadMessage}
          </p>
        )}
        {uploadStatus === 'idle' && (
          <p className="text-sm text-gray-300 text-center mt-2">
            Click to select a PDF file
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;