import { useState } from 'react';
import { documentsAPI } from '../services/api.js';

export default function DocumentUploader({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'txt'].includes(ext)) {
      setError('Only PDF and TXT files are allowed');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('document', file);
      const { data } = await documentsAPI().upload(formData);
      onUploadSuccess(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="p-4 border-b border-gray-700">
      <label className="block mb-2 text-sm font-medium text-gray-300">Upload document</label>
      <input
        type="file"
        accept=".pdf,.txt"
        onChange={handleFile}
        disabled={uploading}
        className="block w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
      />
      {uploading && <p className="text-sm text-blue-400 mt-1">Uploading...</p>}
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
}
