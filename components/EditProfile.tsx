
import React, { useState, useEffect } from 'react';
import type { Realtor } from '../types';

interface EditProfileProps {
  currentUser: Realtor;
  onUpdateProfile: (updatedData: Realtor) => void;
  onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ currentUser, onUpdateProfile, onCancel }) => {
  const [formData, setFormData] = useState<Realtor>(currentUser);

  useEffect(() => {
    setFormData(currentUser);
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
  };
  
  const inputClass = "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="flex justify-center items-start h-full bg-gray-900 text-white p-4 pt-20 sm:pt-24 overflow-y-auto w-full">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Edit Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="border border-gray-700 p-4 rounded-md">
            <legend className="px-2 font-semibold">Your Information</legend>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Your Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="agency" className="block text-sm font-medium text-gray-400 mb-1">Agency Name</label>
                <input type="text" id="agency" name="agency" value={formData.agency} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-400 mb-1">Contact Number *</label>
                <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} className={inputClass} placeholder="+91 12345 67890" required />
              </div>
               <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-400 mb-1">Avatar URL</label>
                <input type="url" id="avatarUrl" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-1">You are a... *</label>
                <select id="type" name="type" value={formData.type} onChange={handleChange} className={inputClass} required>
                  <option value="Broker">Broker</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>
          </fieldset>
          
          <div className="flex items-center gap-4 pt-4">
             <button type="button" onClick={onCancel} className="w-full py-3 px-4 bg-gray-600 font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
                Cancel
             </button>
             <button type="submit" className="w-full py-3 px-4 bg-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition">
                Save Changes
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
