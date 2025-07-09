import React, { useState } from 'react';
import { HiOutlineCheckCircle, HiOutlineBell } from 'react-icons/hi';

interface NoteActionsProps {
  handleSave: () => void;
  handleClearAll: () => void;
  handleBold: () => void;
  handleItalic: () => void;
  handlePaste: () => void; // New prop for paste functionality
  handleToggleChecklist: () => void;
  handleSetReminder: () => void;
  selectedNoteTheme: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';
  setSelectedNoteTheme: (theme: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal') => void;
}

type Theme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';

const NoteActions: React.FC<NoteActionsProps> = ({
  handleSave,
  handleClearAll,
  handleBold,
  handleItalic,
  handlePaste, // Destructure new prop
  handleToggleChecklist,
  handleSetReminder,
  selectedNoteTheme,
  setSelectedNoteTheme,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);

  const themes: Theme[] = ['default', 'blue', 'green', 'purple', 'orange', 'pink', 'teal'];

  const getThemeColor = (theme: Theme) => {
    switch (theme) {
      case 'blue': return '#A7D9F2';
      case 'green': return '#B3E6B3';
      case 'purple': return '#D9B3FF';
      case 'orange': return '#FFDAB9';
      case 'pink': return '#FFB6C1';
      case 'teal': return '#AFEEEE';
      default: return '#F5F5DC';
    }
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await handleSave();
    setIsSaving(false);
  };

  return (
    <div className="p-4 rounded-lg mt-2">
      <div className="relative flex justify-center mb-4 space-x-2">
        <button
          onClick={() => setShowColorPalette(!showColorPalette)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-colors duration-200"
          aria-label="Toggle Color Palette"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.586a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 0012.586 9h-2.172a1 1 0 00-.707.293L6.293 12.586A1 1 0 016 13.293V17a2 2 0 002 2h2.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0017.414 21H17" />
          </svg>
        </button>
        <button
          onClick={handleBold}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-colors duration-200 font-bold"
          aria-label="Bold"
        >
          B
        </button>
        <button
          onClick={handleItalic}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-colors duration-200 italic"
          aria-label="Italic"
        >
          I
        </button>
        <button
          onClick={handlePaste}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-colors duration-200"
          aria-label="Paste"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </button>
        <button
          onClick={handleToggleChecklist}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-colors duration-200"
          aria-label="Toggle Checklist"
        >
          <HiOutlineCheckCircle className="h-6 w-6" />
        </button>
        <button
          onClick={handleSetReminder}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-colors duration-200"
          aria-label="Set Reminder"
        >
          <HiOutlineBell className="h-6 w-6" />
        </button>
        
      </div>
      {showColorPalette && (
        <div className="absolute z-10 flex justify-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg mt-2">
          {themes.map((themeOption) => (
            <button
              key={themeOption}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none ${selectedNoteTheme === themeOption ? 'ring-2 ring-offset-2 ring-blue-500 shadow-soft-glow' : 'border-transparent hover:shadow-md'}`}
              style={{ backgroundColor: getThemeColor(themeOption) }}
              onClick={() => {
                setSelectedNoteTheme(themeOption);
                setShowColorPalette(false); // Close palette after selection
              }}
            >
              {selectedNoteTheme === themeOption && (
                <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-row justify-center space-x-2 mt-2">
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