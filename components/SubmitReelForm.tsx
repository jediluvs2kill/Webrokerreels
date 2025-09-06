
import React, { useState, useEffect } from 'react';
import type { Reel, Property, Realtor } from '../types';

interface SubmitReelFormProps {
  onAddReel: (reelData: Omit<Reel, 'id' | 'createdAt' | 'submittedBy' | 'likes' | 'dislikes'>) => Promise<void>;
  currentUserProfile: Realtor;
}

const SubmitReelForm: React.FC<SubmitReelFormProps> = ({ onAddReel, currentUserProfile }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [videoUrl, setVideoUrl] = useState('');
  const [property, setProperty] = useState<Property>({
    address: '',
    price: 0,
    beds: 0,
    baths: 0,
    sqft: 0,
  });
  const [realtor, setRealtor] = useState<Realtor>(currentUserProfile);

  useEffect(() => {
    // Keep form in sync if the profile data changes
    setRealtor(currentUserProfile);
  }, [currentUserProfile]);

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProperty(prev => ({ ...prev, [name]: name === 'address' ? value : Number(value) }));
  };
  
  const handleRealtorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRealtor(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if(!videoUrl || !property.address || !property.price || !realtor.name || !realtor.contact) {
        setError("Please fill out all required fields.");
        return;
    }

    setIsSubmitting(true);
    try {
        await onAddReel({
            videoUrl,
            sourceType: 'instagram',
            property,
            realtor,
        });
        // Parent component will handle view change
    } catch (err) {
        console.error("Submission failed", err);
        setError("Failed to submit reel. Please try again.");
        setIsSubmitting(false);
    }
  };
  
  const inputClass = "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="flex justify-center items-start h-full bg-gray-900 text-white p-4 pt-20 sm:pt-24 overflow-y-auto w-full">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Share a Real Estate Reel</h2>
        <p className="text-center text-gray-400 mb-6">Follow the steps to add a new listing to the feed.</p>
        
        {error && (
          <div className="bg-red-600 text-white text-center p-3 rounded-md mb-4" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
             <fieldset className="border border-gray-700 p-4 rounded-md animate-fade-in">
                <legend className="px-2 font-semibold text-lg">Step 1: Reel Information</legend>
                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-400 mb-1">Instagram Reel URL *</label>
                  <input type="url" id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={inputClass} placeholder="https://www.instagram.com/reel/..." required />
                </div>
             </fieldset>
          )}

          {step === 2 && (
             <fieldset className="border border-gray-700 p-4 rounded-md animate-fade-in">
                <legend className="px-2 font-semibold text-lg">Step 2: Property Details</legend>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">Address / Location *</label>
                    <input type="text" id="address" name="address" value={property.address} onChange={handlePropertyChange} className={inputClass} placeholder="e.g., Vasant Vihar, New Delhi" required />
                  </div>
                   <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-1">Price (in Rupees) *</label>
                    <input type="number" id="price" name="price" value={property.price || ''} onChange={handlePropertyChange} className={inputClass} placeholder="e.g., 35000000" required />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="beds" className="block text-sm font-medium text-gray-400 mb-1">Beds *</label>
                        <input type="number" id="beds" name="beds" value={property.beds || ''} onChange={handlePropertyChange} className={inputClass} required />
                      </div>
                      <div>
                        <label htmlFor="baths" className="block text-sm font-medium text-gray-400 mb-1">Baths *</label>
                        <input type="number" id="baths" name="baths" value={property.baths || ''} onChange={handlePropertyChange} className={inputClass} required />
                      </div>
                      <div>
                        <label htmlFor="sqft" className="block text-sm font-medium text-gray-400 mb-1">Area (sqft) *</label>
                        <input type="number" id="sqft" name="sqft" value={property.sqft || ''} onChange={handlePropertyChange} className={inputClass} required />
                      </div>
                  </div>
                </div>
             </fieldset>
          )}

          {step === 3 && (
            <fieldset className="border border-gray-700 p-4 rounded-md animate-fade-in">
              <legend className="px-2 font-semibold text-lg">Step 3: Your Information</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Your Name *</label>
                  <input type="text" id="name" name="name" value={realtor.name} onChange={handleRealtorChange} className={inputClass} required />
                </div>
                <div>
                  <label htmlFor="agency" className="block text-sm font-medium text-gray-400 mb-1">Agency Name</label>
                  <input type="text" id="agency" name="agency" value={realtor.agency} onChange={handleRealtorChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-400 mb-1">Contact Number *</label>
                  <input type="tel" id="contact" name="contact" value={realtor.contact} onChange={handleRealtorChange} className={inputClass} placeholder="+91 12345 67890" required />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-1">You are a... *</label>
                  <select id="type" name="type" value={realtor.type} onChange={handleRealtorChange} className={inputClass} required>
                    <option value="Broker">Broker</option>
                    <option value="Owner">Owner</option>
                  </select>
                </div>
              </div>
            </fieldset>
          )}

          <div className="flex items-center gap-4 pt-4">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="w-full py-3 px-4 bg-gray-600 font-semibold rounded-lg shadow-md hover:bg-gray-700 transition">
                Back
              </button>
            )}
            {step < 3 && (
              <button type="button" onClick={nextStep} className="w-full py-3 px-4 bg-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
                Next
              </button>
            )}
            {step === 3 && (
              <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-green-600 font-semibold rounded-lg shadow-md hover:bg-green-700 transition disabled:bg-gray-500">
                {isSubmitting ? 'Submitting...' : 'Submit Reel'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReelForm;