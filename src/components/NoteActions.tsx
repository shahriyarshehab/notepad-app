import React, { useState } from 'react';

interface NoteActionsProps {
  selectedNoteTheme: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';
  setSelectedNoteTheme: (theme: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal') => void;
  handleSave: () => void;
  handleClearAll: () => void;
  
}

type Theme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';

const NoteActions: React.FC<NoteActionsProps> = ({
  selectedNoteTheme,
  setSelectedNoteTheme,
  handleSave,
  handleClearAll,
  
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const themes: Theme[] = ['default', 'blue', 'green', 'purple', 'orange', 'pink', 'teal'];

  const handleSaveClick = async () => {
    setIsSaving(true);
    await handleSave();
    setIsSaving(false);
  };

  return (
    <div className="p-4 rounded-lg mt-2">
      <div className="flex justify-center space-x-2 mb-4">
          {themes.map((theme) => (
            <button
              key={theme}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none ${selectedNoteTheme === theme ? 'ring-2 ring-offset-2 ring-blue-500 shadow-soft-glow' : 'border-transparent hover:shadow-md'}`}
              style={{ backgroundColor: getThemeColor(theme) }}
              onClick={() => setSelectedNoteTheme(theme)}
            >
              {selectedNoteTheme === theme && (
                <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-row justify-center space-x-2">
          <button
            className="w-full sm:w-auto px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-white"
            style={{ backgroundColor: 'var(--accent-color)', '--tw-ring-color': 'var(--accent-color)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-hover-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-color)'}
            onClick={handleSaveClick}
            disabled={isSaving}
          >
            {isSaving ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Save'
            )}
          </button>
          <button
            className="w-full sm:w-auto px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 text-white"
            style={{ backgroundColor: 'var(--clear-button-bg)' }}
            onClick={handleClearAll}
          >
            Clear
          </button>
        </div>
     </div>
  );
};

const getThemeColor = (theme: Theme) => {
  switch (theme) {
    case 'blue':
      return '#A7D9F2'; // Pastel Blue
    case 'green':
      return '#B3E6B3'; // Pastel Green
    case 'purple':
      return '#D9B3FF'; // Pastel Purple
    case 'orange':
      return '#FFDAB9'; // Pastel Orange
    case 'pink':
      return '#FFB6C1'; // Pastel Pink
    case 'teal':
      return '#AFEEEE'; // Pastel Teal
    default:
      return '#F5F5DC'; // Beige for default
  }
};

export default NoteActions;
