
import React, { useState } from 'react';
import FilterIcon from './icons/FilterIcon';

export interface Filters {
    searchQuery: string;
    beds: number;
    baths: number;
    minPrice: string;
    maxPrice: string;
}

interface FilterComponentProps {
    onFilterChange: (filters: Filters) => void;
    initialFilters: Filters;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilterChange, initialFilters }) => {
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [isOpen, setIsOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        // Apply text search immediately
        if (name === 'searchQuery') {
            onFilterChange(newFilters);
        }
    };

    const handleApplyFilters = () => {
        onFilterChange(filters);
        setIsOpen(false); // Close on apply
    };
    
    const handleClearFilters = () => {
        const clearedFilters = {
            searchQuery: '',
            beds: 0,
            baths: 0,
            minPrice: '',
            maxPrice: '',
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    }
    
    const selectClass = "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm";
    const inputClass = "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm";

    return (
        <div className="w-full md:w-[400px] bg-gray-900/80 backdrop-blur-sm p-3 rounded-b-lg z-10">
             <div className="flex items-center gap-2">
                <input
                    type="text"
                    name="searchQuery"
                    placeholder="Search by location, agent, agency..."
                    value={filters.searchQuery}
                    onChange={handleInputChange}
                    className={`${inputClass} flex-grow`}
                    aria-label="Search properties"
                />
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
                    aria-label="Toggle Filters"
                    aria-expanded={isOpen}
                >
                    <FilterIcon />
                </button>
             </div>
            
            {isOpen && (
                <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="beds" className="block text-xs font-medium text-gray-400 mb-1">Min Beds</label>
                            <select id="beds" name="beds" value={filters.beds} onChange={handleInputChange} className={selectClass}>
                                <option value="0">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="baths" className="block text-xs font-medium text-gray-400 mb-1">Min Baths</label>
                            <select id="baths" name="baths" value={filters.baths} onChange={handleInputChange} className={selectClass}>
                                <option value="0">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>
                    </div>
                    <div>
                         <label className="block text-xs font-medium text-gray-400 mb-1">Price Range (in Lakhs)</label>
                         <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={handleInputChange}
                                className={inputClass}
                                aria-label="Minimum Price in Lakhs"
                            />
                             <input
                                type="number"
                                name="maxPrice"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={handleInputChange}
                                className={inputClass}
                                aria-label="Maximum Price in Lakhs"
                            />
                         </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button onClick={handleClearFilters} className="px-4 py-1.5 text-sm font-semibold text-gray-300 hover:text-white transition">
                            Clear
                        </button>
                        <button onClick={handleApplyFilters} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition text-sm">
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterComponent;
