import React, { useState, useEffect } from 'react';
import NoteCard from './components/NoteCard'; // Import the new NoteCard component
import NoteActions from './components/NoteActions';


interface Note {
  id: string;
  content: string;
  timestamp: number;
  color: Theme; // Change color to Theme type
  animate?: boolean; // Optional property for animation
}

type Theme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';

const getThemeColorMap = () => ({
  default: {
    primaryBg: 'var(--primary-bg)',
    secondaryBg: 'var(--secondary-bg)',
    textColor: 'var(--text-color)',
    noteBg: 'var(--note-bg)',
  },
  blue: {
    primaryBg: 'var(--primary-bg)',
    secondaryBg: 'var(--secondary-bg)',
    textColor: 'var(--text-color)',
    noteBg: 'var(--note-bg)',
  },
  green: {
    primaryBg: 'var(--primary-bg)',
    secondaryBg: 'var(--secondary-bg)',
    textColor: 'var(--text-color)',
    noteBg: 'var(--note-bg)',
  },
  purple: {
    primaryBg: 'var(--primary-bg)',
    secondaryBg: 'var(--secondary-bg)',
    textColor: 'var(--text-color)',
    noteBg: 'var(--note-bg)',
  },
  orange: {
    primaryBg: 'var(--primary-bg)',
    secondaryBg: 'var(--secondary-bg)',
    textColor: 'var(--text-color)',
    noteBg: 'var(--note-bg)',
  },
  pink: {
    primaryBg: 'var(--primary-bg)',
    secondaryBg: 'var(--secondary-bg)',
    textColor: 'var(--text-color)',
    noteBg: 'var(--note-bg)',
  },
  teal: {
    primaryBg: 'var(--primary-bg)',
    secondaryBg: 'var(--secondary-bg)',
    textColor: 'var(--text-color)',
    noteBg: 'var(--note-bg)',
  },
});

const Notepad: React.FC = () => {
  const [currentNote, setCurrentNote] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [selectedNoteTheme, setSelectedNoteTheme] = useState<Theme>('default'); // New state for note theme
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null); // New state to track the note being edited
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [lastDeletedNote, setLastDeletedNote] = useState<Note | null>(null);
  const [lastDeletedNoteIndex, setLastDeletedNoteIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

    

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  

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
    const deletedNoteIndex = notes.findIndex(note => note.id === id);
    const deletedNote = notes[deletedNoteIndex];
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
    setLastDeletedNote(deletedNote);
    setLastDeletedNoteIndex(deletedNoteIndex);
    setSnackbarMessage('Note deleted.');
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
      setLastDeletedNote(null);
      setLastDeletedNoteIndex(null);
    }, 3000); // Snackbar disappears after 3 seconds
  };

  const handleUndoDelete = () => {
    if (lastDeletedNote && lastDeletedNoteIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes.splice(lastDeletedNoteIndex, 0, lastDeletedNote);
      setNotes(updatedNotes);
      updateLocalStorage(updatedNotes);
      setShowSnackbar(false);
      setLastDeletedNote(null);
      setLastDeletedNoteIndex(null);
    }
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

  

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentTheme(e.target.value as Theme);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-4`}>
      {/* Header */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-8">
        <div className="relative flex items-center">
          <div className="relative flex items-center">
            <div className="flex items-baseline">
              <h1 className="text-5xl font-bold font-poppins mr-2"><span className="inkr-i">I</span><span className="inkr-n">n</span><span className="inkr-k">k</span><span className="inkr-r">r</span></h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-handwritten">Ink Your Thoughts.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          
        </div>
      </header>

      {/* Note Input Area (Google Keep Style) */}
      <div className="w-full max-w-xl mb-8 shadow-md rounded-xl p-4 sm:p-6 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <textarea
          className="w-full p-2 sm:p-3 border-none focus:outline-none resize-none overflow-hidden text-lg sm:text-xl bg-transparent"
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
            
          />
        )}
      </div>

      {/* Saved Notes Display (Masonry Layout) */}
      <div className="w-full max-w-xl mb-4">
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="w-full max-w-4xl flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <p className="text-xs text-gray-400 dark:text-gray-600">Swipe a note to edit or delete</p>
      </div>
      <div className="w-full max-w-4xl columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes saved yet.</p>
        ) : (
          notes
            .filter(note => note.content.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
                
                
                onNoteClick={startEditingNote}
                animate={note.animate}
                isFaded={note.id !== editingNoteId && !(note.animate)}
              />
            ))
        )}
      </div>

      {showSnackbar && (
        <div className="snackbar show">
          {snackbarMessage}
          {lastDeletedNote && (
            <button onClick={handleUndoDelete} className="snackbar-button">Undo</button>
          )}
        </div>
      )}
    </div>
  );
}

export default Notepad;
