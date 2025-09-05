
import React, { useState } from 'react';
import type { Reel, Realtor, Property } from '../types';

interface SubmitReelFormProps {
  onReelSubmit: (reel: Reel) => void;
}

const SubmitReelForm: React.FC<SubmitReelFormProps> = ({ onReelSubmit }) => {
  const [realtorName, setRealtorName] = useState('');
  const [agency, setAgency] = useState('');
  const [contact, setContact] = useState('');
  const [realtorType, setRealtorType] = useState<'Broker' | 'Owner'>('Broker');
  const [sourceType, setSourceType] = useState<'direct' | 'instagram'>('direct');
  const [videoUrl, setVideoUrl] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [area, setArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!realtorName || !videoUrl || !address || !price || !contact) {
        alert("Please fill all required fields.");
        setIsSubmitting(false);
        return;
    }

    const newRealtor: Realtor = {
      id: `realtor-${Date.now()}`,
      name: realtorName,
      avatarUrl: `https://i.pravatar.cc/150?u=${realtorName.replace(/\s/g, '')}`,
      agency: agency || (realtorType === 'Owner' ? 'Self-listed' : 'Independent'),
      type: realtorType,
      contact: contact,
    };

    const newProperty: Property = {
      address: address,
      price: parseInt(price) || 0,
      beds: parseInt(beds) || 0,
      baths: parseInt(baths) || 0,
      area: parseInt(area) || 0,
    };

    const newReel: Reel = {
      id: `reel-${Date.now()}`,
      videoUrl: videoUrl,
      realtor: newRealtor,
      property: newProperty,
      sourceType: sourceType,
    };
    
    // Simulate API call
    setTimeout(() => {
        console.log('Submitting new reel:', newReel);
        
        setSubmitSuccess(true);
        setTimeout(() => {
          onReelSubmit(newReel);
        }, 1500); // Wait a bit after showing success before redirecting

    }, 1000);
  };
  
  const inputClass = "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="flex justify-center items-start h-full bg-gray-900 text-white p-4 pt-20 sm:pt-24 overflow-y-auto w-full">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Share Your Property Reel</h2>
        {submitSuccess && (
          <div className="bg-green-600 text-white text-center p-3 rounded-md mb-4" role="alert">
            Reel submitted successfully! Taking you to the feed...
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="border border-gray-700 p-4 rounded-md">
            <legend className="px-2 font-semibold">Broker Details</legend>
            <div className="space-y-4">
              <div>
                <label htmlFor="realtorName" className="block text-sm font-medium text-gray-400 mb-1">Your Name *</label>
                <input type="text" id="realtorName" value={realtorName} onChange={(e) => setRealtorName(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="agency" className="block text-sm font-medium text-gray-400 mb-1">Agency Name</label>
                <input type="text" id="agency" value={agency} onChange={(e) => setAgency(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-400 mb-1">Contact Number *</label>
                <input type="tel" id="contact" value={contact} onChange={(e) => setContact(e.target.value)} className={inputClass} placeholder="+91 12345 67890" required />
              </div>
              <div>
                <label htmlFor="realtorType" className="block text-sm font-medium text-gray-400 mb-1">You are a... *</label>
                <select id="realtorType" value={realtorType} onChange={(e) => setRealtorType(e.target.value as 'Broker' | 'Owner')} className={inputClass} required>
                  <option value="Broker">Broker</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>
          </fieldset>
          
          <fieldset className="border border-gray-700 p-4 rounded-md">
            <legend className="px-2 font-semibold">Property Details</legend>
            <div className="space-y-4">
               <div>
                <label htmlFor="sourceType" className="block text-sm font-medium text-gray-400 mb-1">Video Source *</label>
                <select id="sourceType" value={sourceType} onChange={(e) => setSourceType(e.target.value as 'direct' | 'instagram')} className={inputClass} required>
                  <option value="direct">Direct Video Link</option>
                  <option value="instagram">Instagram Reel Link</option>
                </select>
              </div>
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-400 mb-1">
                  {sourceType === 'direct' ? 'Direct Video URL *' : 'Instagram Reel URL *'}
                </label>
                <input type="url" id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={inputClass} placeholder={sourceType === 'direct' ? "e.g., https://assets.mixkit.co/.../video.mp4" : "e.g., https://www.instagram.com/reel/..."} required />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Property Address *</label>
                <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} placeholder="e.g., DLF Phase 5, Gurgaon" required />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-1">Price (in Rupees) *</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="e.g., 52000000" required min="0" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="beds" className="block text-sm font-medium text-gray-400 mb-1">Beds</label>
                  <input type="number" id="beds" min="0" value={beds} onChange={(e) => setBeds(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="baths" className="block text-sm font-medium text-gray-400 mb-1">Baths</label>
                  <input type="number" id="baths" min="0" value={baths} onChange={(e) => setBaths(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-400 mb-1">Area (sqft)</label>
                  <input type="number" id="area" min="0" value={area} onChange={(e) => setArea(e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </fieldset>
          
          <button type="submit" disabled={isSubmitting || submitSuccess} className="w-full mt-6 py-3 px-4 bg-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isSubmitting ? 'Submitting...' : 'Submit Reel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReelForm;