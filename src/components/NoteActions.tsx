import React, { useEffect, useState } from 'react';

interface NoteActionsProps {
  selectedNoteTheme: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';
  setSelectedNoteTheme: (theme: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal') => void;
  handleSave: () => void;
  handleClearAll: () => void;
  isDarkMode: boolean;
}

type Theme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';

const NoteActions: React.FC<NoteActionsProps> = ({
  selectedNoteTheme,
  setSelectedNoteTheme,
  handleSave,
  handleClearAll,
  isDarkMode,
}) => {

  const themes: Theme[] = ['default', 'blue', 'green', 'purple', 'orange', 'pink', 'teal'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-2">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {themes.map((theme) => (
            <button
              key={theme}
              className={`w-6 h-6 rounded-full border-2 ${selectedNoteTheme === theme ? 'border-blue-500' : 'border-transparent'}`}
              style={{ backgroundColor: getThemeColor(theme) }}
              onClick={() => setSelectedNoteTheme(theme)}
            />
          ))}
        </div>
        <div className="flex">
          <button
            className="px-4 py-2 text-gray-900 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            onClick={handleSave}
          >
            Close
          </button>
          <button
            className="px-4 py-2 text-gray-900 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={handleClearAll}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

const getThemeColor = (theme: Theme) => {
  switch (theme) {
    case 'blue':
      return '#B3E0F2';
    case 'green':
      return '#B3E6B3';
    case 'purple':
      return '#D9B3FF';
    case 'orange':
      return '#FFE0B2';
    case 'pink':
      return '#F8BBD0';
    case 'teal':
      return '#B2EBF2';
    default:
      return '#F5F5F5';
  }
};

export default NoteActions;
