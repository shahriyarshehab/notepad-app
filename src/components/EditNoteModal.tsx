import React, { useState, useEffect } from 'react';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: {
    id: string;
    title: string;
    content: string;
    color: Theme;
  };
  onSave: (id: string, title: string, content: string, color: Theme) => void;
}

type Theme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';

const getTextColorClass = (theme: Theme, themeMode: string): string => {
  const colorMap: { [key: string]: { light: string; dark: string } } = {
    blue: { light: 'text-blue-800', dark: 'text-blue-200' },
    green: { light: 'text-green-800', dark: 'text-green-200' },
    purple: { light: 'text-purple-800', dark: 'text-purple-200' },
    orange: { light: 'text-orange-800', dark: 'text-orange-200' },
    pink: { light: 'text-pink-800', dark: 'text-pink-200' },
    teal: { light: 'text-teal-800', dark: 'text-teal-200' },
    default: { light: 'text-gray-800', dark: 'text-gray-200' },
  };
  return colorMap[theme][themeMode] || colorMap[theme].light; // Fallback to light if themeMode is unexpected
};

const getRingColorClass = (theme: Theme): string => {
  switch (theme) {
    case 'blue':
      return 'ring-blue-700';
    case 'green':
      return 'ring-green-700';
    case 'purple':
      return 'ring-purple-700';
    case 'orange':
      return 'ring-orange-700';
    case 'pink':
      return 'ring-pink-700';
    case 'teal':
      return 'ring-teal-700';
    case 'default':
    default:
      return 'ring-gray-700';
  }
};

const EditNoteModal: React.FC<EditNoteModalProps> = ({ isOpen, onClose, note, onSave }) => {
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [selectedColor, setSelectedColor] = useState<Theme>(note.color);

  useEffect(() => {
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setSelectedColor(note.color);
  }, [note]);

  if (!isOpen) return null;

  const themes: Theme[] = ['default', 'blue', 'green', 'purple', 'orange', 'pink', 'teal'];

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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
      <div className="p-6 rounded-lg shadow-xl w-full max-w-md m-4 animate-fade-in transform transition-all duration-300 note-card" data-theme={selectedColor} data-theme-mode={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
        <input
          type="text"
          className="w-full p-2 mb-4 text-2xl font-bold border-b-2 border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none text-gray-900 dark:text-gray-100"
          placeholder="Title"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <textarea
          className={`w-full p-2 mb-4 h-48 border-2 border-gray-300 dark:border-gray-700 rounded-md bg-transparent focus:outline-none resize-none ${getTextColorClass(selectedColor, document.documentElement.classList.contains('dark') ? 'dark' : 'light')}`}
          placeholder="Take a note..."
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
        <div className="flex justify-center space-x-2 mb-4">
          {themes.map((themeOption) => (
            <button
              key={themeOption}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ease-in-out transform hover:scale-110 focus:outline-none ${selectedColor === themeOption ? `ring-4 ring-offset-2 ${getRingColorClass(themeOption)} shadow-soft-glow` : 'border-transparent hover:shadow-md'}`}
              style={{ backgroundColor: getThemeColor(themeOption) }}
              onClick={() => setSelectedColor(themeOption)}
            >
              {selectedColor === themeOption && (
                <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 rounded-md transition-colors duration-200 text-white"
            style={{ backgroundColor: 'var(--clear-button-bg)' }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md transition-colors duration-200 text-white"
            style={{ backgroundColor: 'var(--accent-color)', '--tw-ring-color': 'var(--accent-color)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--button-hover-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-color)'}
            onClick={() => onSave(note.id, editedTitle, editedContent, selectedColor)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;