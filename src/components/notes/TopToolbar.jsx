import React from 'react';
import { ChevronRight } from 'lucide-react';

const TopToolbar = () => {
    return (
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
                <button className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Save
                </button>
                <button className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Export
                </button>
                <div className="relative">
                    <button className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1">
                        <span>Edit</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
                <div className="relative">
                    <button className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1">
                        <span>View</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
                <button className="px-4 py-1 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    Summary
                </button>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">English</span>
            </div>
        </div>
    );
};

export default TopToolbar;
