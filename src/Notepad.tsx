import React, { useState, useEffect } from 'react';
import NoteCard from './components/NoteCard'; // Import the new NoteCard component
import NoteActions from './components/NoteActions';

interface Note {
  id: string;
  content: string;
  timestamp: number;
  color: Theme; // Change color to Theme type
}

type Theme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';

const getThemeColorMap = (isDarkMode: boolean) => ({
  default: {
    primaryBg: isDarkMode ? '#FFFFFF' : '#f0f2f5',
    secondaryBg: isDarkMode ? '#FFFFFF' : '#ffffff',
    textColor: isDarkMode ? '#333333' : '#333333',
    noteBg: isDarkMode ? '#444444' : '#F5F5F5',
  },
  blue: {
    primaryBg: '#E0F2F7',
    secondaryBg: '#B3E0F2',
    textColor: '#003366',
    noteBg: '#E0F2F7',
  },
  green: {
    primaryBg: '#E6FFE6',
    secondaryBg: '#B3E6B3',
    textColor: '#004D00',
    noteBg: '#E6FFE6',
  },
  purple: {
    primaryBg: '#F2E6FF',
    secondaryBg: '#D9B3FF',
    textColor: '#4D0099',
    noteBg: '#F2E6FF',
  },
  orange: {
    primaryBg: '#FFF3E0',
    secondaryBg: '#FFE0B2',
    textColor: '#E65100',
    noteBg: '#FFF3E0',
  },
  pink: {
    primaryBg: '#FCE4EC',
    secondaryBg: '#F8BBD0',
    textColor: '#AD1457',
    noteBg: '#FCE4EC',
  },
  teal: {
    primaryBg: '#E0F7F7',
    secondaryBg: '#B2EBF2',
    textColor: '#006064',
    noteBg: '#E0F7F7',
  },
});

const Notepad: React.FC = () => {
  const [currentNote, setCurrentNote] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [selectedNoteTheme, setSelectedNoteTheme] = useState<Theme>('default'); // New state for note theme
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null); // New state to track the note being edited

  

  useEffect(() => {
    // Load notes from localStorage on component mount
    const savedNotes = localStorage.getItem('notepad-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Add an example note for July 1st
      const exampleNote = {
        id: 'example-note-1',
        content: 'This is an example note from July 1st.',
        timestamp: new Date('2025-07-01T10:00:00').getTime(),
        color: 'default',
      };
      setNotes([exampleNote]);
      localStorage.setItem('notepad-notes', JSON.stringify([exampleNote]));
    }

    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('dark-mode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save dark mode preference to localStorage whenever it changes
    if (isDarkMode) {
      localStorage.setItem('dark-mode', 'true');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('dark-mode', 'false');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Save theme preference to localStorage whenever it changes
    localStorage.setItem('app-theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const updateLocalStorage = (updatedNotes: Note[]) => {
    localStorage.setItem('notepad-notes', JSON.stringify(updatedNotes));
  };

  const handleSave = () => {
    if (currentNote.trim() === '') {
      setIsInputFocused(false); // Collapse if empty
      return;
    }

    let updatedNotes: Note[];
    if (editingNoteId) {
      // Editing existing note
      updatedNotes = notes.map((note) =>
        note.id === editingNoteId
          ? { ...note, content: currentNote, color: selectedNoteTheme }
          : note
      );
      setEditingNoteId(null); // Clear editing state
    } else {
      // Creating new note
      const newNote: Note = {
        id: Date.now().toString(), // Simple unique ID
        content: currentNote,
        timestamp: Date.now(),
        color: selectedNoteTheme, // Assign the selected theme
      };
      updatedNotes = [newNote, ...notes]; // Add new note to the top
    }

    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
    setCurrentNote(''); // Clear current note after saving
    setIsInputFocused(false); // Collapse input after saving
  };

  const handleClearAll = () => {
    setCurrentNote('');
    setIsInputFocused(false);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
  };

  const handleEditNote = (id: string, newContent: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, content: newContent } : note
    );
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
  };

  const startEditingNote = (note: Note) => {
    setCurrentNote(note.content);
    setSelectedNoteTheme(note.color);
    setEditingNoteId(note.id);
    setIsInputFocused(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTheme(e.target.value as Theme);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-4`}>
      {/* Header */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">AwsomeNote</h1>
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M3 12h1m15.325-7.757l-.707.707M5.382 18.325l-.707.707M18.325 5.382l.707-.707M5.382 5.382l.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
        </div>
      </header>

      {/* Note Input Area (Google Keep Style) */}
      <div className="w-full max-w-xl mb-8 shadow-md rounded-lg p-4 text-gray-900" style={{ backgroundColor: getThemeColorMap(isDarkMode)[selectedNoteTheme].noteBg }}>
        <textarea
          className="w-full p-2 border-none focus:outline-none resize-none overflow-hidden" style={{ backgroundColor: getThemeColorMap(isDarkMode)[selectedNoteTheme].noteBg, color: getThemeColorMap(isDarkMode)[selectedNoteTheme].textColor }}
          placeholder="Take a note..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          rows={isInputFocused || currentNote ? 3 : 1} // Expand on focus or content
          onInput={(e) => {
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
          }}
        ></textarea>
        {(isInputFocused || currentNote) && (
          <NoteActions
            selectedNoteTheme={selectedNoteTheme}
            setSelectedNoteTheme={setSelectedNoteTheme}
            handleSave={handleSave}
            handleClearAll={handleClearAll}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {/* Saved Notes Display (Masonry Layout) */}
      <div className="w-full max-w-4xl flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <p className="text-xs text-gray-500">Swipe a note to edit or delete</p>
      </div>
      <div className="w-full max-w-4xl columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes saved yet.</p>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
              onEdit={handleEditNote}
              themeColorMap={getThemeColorMap}
              isDarkMode={isDarkMode}
              onNoteClick={startEditingNote}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Notepad;
