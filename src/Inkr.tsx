import React, { useState, useEffect, useRef } from 'react';
import NoteCard from './components/NoteCard';
import NoteActions from './components/NoteActions';
import EditNoteModal from './components/EditNoteModal';

import { HiSortAscending, HiSortDescending, HiHeart } from 'react-icons/hi';
import { FaThumbtack } from 'react-icons/fa';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  color: Theme;
  isPinned: boolean;
  isFavorite: boolean;
  isTrashed: false,
        animate: true,
}

type Theme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';

const Inkr: React.FC<{ theme: string }> = ({ theme }) => {
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [currentNote, setCurrentNote] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [selectedNoteTheme, setSelectedNoteTheme] = useState<Theme>('default');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [lastDeletedNote, setLastDeletedNote] = useState<Note | null>(null);
  const [lastDeletedNoteIndex, setLastDeletedNoteIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [selectedNoteIdForSwipe, setSelectedNoteIdForSwipe] = useState<string | null>(null); // New state for swipe selection
  
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest'); // 'newest' or 'oldest'
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [currentMode, setCurrentMode] = useState<number>(0); // 0: All Newest, 1: All Oldest, 2: Fav Newest, 3: Pinned Newest
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('inkr-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => {
        setActionMessage('');
      }, 1000); // Message disappears after 1 second
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currentNote]);

  const updateLocalStorage = (updatedNotes: Note[]) => {
    localStorage.setItem('inkr-notes', JSON.stringify(updatedNotes));
  };

  const handleSave = () => {
    if (currentNote.trim() === '') {
      setIsInputFocused(false);
      return;
    }

    let updatedNotes: Note[];
    if (editingNoteId) {
      updatedNotes = notes.map((note) =>
        note.id === editingNoteId
          ? { ...note, title: currentTitle, content: currentNote, color: selectedNoteTheme } // Use currentTitle here
          : note
      );
      setEditingNoteId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: currentTitle, // Use currentTitle here
        content: currentNote,
        timestamp: Date.now(),
        color: selectedNoteTheme,
        isPinned: false,
        isFavorite: false,
        isTrashed: false,
        animate: true,
      };
      updatedNotes = [newNote, ...notes];
    }

    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
    setCurrentNote('');
    setCurrentTitle(''); // Clear currentTitle
    setIsInputFocused(false);
  };

  const handleClearAll = () => {
    setCurrentNote('');
    setCurrentTitle(''); // Clear currentTitle
    setIsInputFocused(false);
  };

  const handleEditNote = (id: string, title: string, content: string, color: Theme) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, title, content, color } : note
    );
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
    setIsModalOpen(false);
    setNoteToEdit(null);
  };

  const openEditModal = (note: Note) => {
    setNoteToEdit(note);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setNoteToEdit(null);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, isTrashed: true } : note
    );
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
    setSnackbarMessage('Note moved to trash.');
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 5000);
  };

  const handlePermanentDelete = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
  };

  const handleUndoDelete = () => {
    if (lastDeletedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === lastDeletedNote.id ? { ...note, isTrashed: false } : note
      );
      setNotes(updatedNotes);
      updateLocalStorage(updatedNotes);
      setShowSnackbar(false);
      setLastDeletedNote(null);
    }
  };

  const handleTogglePin = (id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    );
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
  };

  const handleToggleFavorite = (id: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    );
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
  };

  const applyFormatting = (prefix: string, suffix: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      let newText = text;
      let newStart = start;
      let newEnd = end;

      const selectedText = text.substring(start, end);

      // Check if formatting already exists and toggle it off
      if (selectedText.startsWith(prefix) && selectedText.endsWith(suffix)) {
        newText = text.substring(0, start) + selectedText.substring(prefix.length, selectedText.length - suffix.length) + text.substring(end);
        newStart = start;
        newEnd = end - prefix.length - suffix.length;
      } else {
        // Apply formatting
        newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
        newStart = start + prefix.length;
        newEnd = end + prefix.length;
      }

      setCurrentNote(newText);

      // Manually set selection after state update
      // This needs to be done after the DOM updates, which React handles internally
      // for controlled components. A direct assignment after setCurrentNote often works.
      textarea.selectionStart = newStart;
      textarea.selectionEnd = newEnd;
    }
  };

  const handleBold = () => {
    applyFormatting('**', '**');
  };

  const handleItalic = () => {
    applyFormatting('*', '*');
  };

  const handlePaste = async () => {
    if (textareaRef.current) {
      try {
        const text = await navigator.clipboard.readText();
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = textarea.value.substring(0, start) + text + textarea.value.substring(end);
        setCurrentNote(newText);

        // Move cursor to the end of the pasted text
        setTimeout(() => {
          textarea.selectionStart = start + text.length;
          textarea.selectionEnd = start + text.length;
        }, 0);
      } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        setActionMessage('Failed to paste from clipboard.');
      }
    }
  };

  const handleSelectNoteForSwipe = (noteId: string) => {
    setSelectedNoteIdForSwipe(noteId);
  };

  const startEditingNote = (note: Note) => {
    if (selectedNoteIdForSwipe === note.id) {
      openEditModal(note);
      setSelectedNoteIdForSwipe(null); // Deselect after opening modal
    } else {
      setSelectedNoteIdForSwipe(note.id);
    }
  };

  

  const handleToggleSortFilterMode = () => {
    setCurrentMode((prevMode) => {
      const nextMode = (prevMode + 1) % 4; // Cycle through 0, 1, 2, 3
      let message = '';

      // Reset all filters first
      setShowFavoritesOnly(false);
      setShowPinnedOnly(false);

      switch (nextMode) {
        case 0:
          setSortOrder('newest');
          message = 'Showing: All Notes (Newest First)';
          break;
        case 1:
          setSortOrder('oldest');
          message = 'Showing: All Notes (Oldest First)';
          break;
        case 2:
          setShowFavoritesOnly(true);
          setSortOrder('newest');
          message = 'Showing: Favorites Only (Newest First)';
          break;
        case 3:
          setShowPinnedOnly(true);
          setSortOrder('newest');
          message = 'Showing: Pinned Only (Newest First)';
          break;
      }
      setActionMessage(message);
      return nextMode;
    });
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
      <header className="w-full max-w-2xl flex justify-between items-center mb-8">
        <div className="relative flex items-center">
          <div className="flex items-baseline">
            <h1 className="text-5xl font-bold font-poppins mr-2 text-gray-800 dark:text-white"><span className="inkr-i">I</span><span className="inkr-n">n</span><span className="inkr-k">k</span><span className="inkr-r">r</span></h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-handwritten">
              <span style={{ color: 'var(--moto-color-1)' }}>I</span>
              <span style={{ color: 'var(--moto-color-2)' }}>n</span>
              <span style={{ color: 'var(--moto-color-3)' }}>k</span>
              <span style={{ color: 'var(--moto-color-4)' }}> </span>
              <span style={{ color: 'var(--moto-color-5)' }}>Y</span>
              <span style={{ color: 'var(--moto-color-6)' }}>o</span>
              <span style={{ color: 'var(--moto-color-7)' }}>u</span>
              <span style={{ color: 'var(--moto-color-1)' }}>r</span>
              <span style={{ color: 'var(--moto-color-2)' }}> </span>
              <span style={{ color: 'var(--moto-color-3)' }}>T</span>
              <span style={{ color: 'var(--moto-color-4)' }}>h</span>
              <span style={{ color: 'var(--moto-color-5)' }}>o</span>
              <span style={{ color: 'var(--moto-color-6)' }}>u</span>
              <span style={{ color: 'var(--moto-color-7)' }}>g</span>
              <span style={{ color: 'var(--moto-color-1)' }}>h</span>
              <span style={{ color: 'var(--moto-color-2)' }}>t</span>
              <span style={{ color: 'var(--moto-color-3)' }}>s</span>
              <span style={{ color: 'var(--moto-color-4)' }}>.</span>
            </p>
          </div>
        </div>
      </header>

      <div className="w-full max-w-xl mb-8 shadow-lg rounded-xl p-4 sm:p-6 transition-all duration-300 note-card" data-theme={selectedNoteTheme} data-theme-mode={theme}>
        {isInputFocused && (
          <input
            type="text"
            className="w-full p-2 mb-2 text-xl font-bold border-b-2 border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none"
            placeholder="Title"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
          />
        )}
        <textarea
          ref={textareaRef}
          className="w-full p-3 sm:p-4 border-none focus:outline-none resize-none text-base sm:text-lg bg-inherit"
          placeholder="Take a note..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          rows={1}
          style={{ minHeight: '4rem', maxHeight: '20vh', overflowY: 'auto' }}
        ></textarea>
        {(isInputFocused || currentNote || currentTitle) && (
          <NoteActions
            selectedNoteTheme={selectedNoteTheme}
            setSelectedNoteTheme={setSelectedNoteTheme}
            handleSave={handleSave}
            handleClearAll={handleClearAll}
            handleBold={handleBold}
            handleItalic={handleItalic}
            handlePaste={handlePaste}
          />
        )}
      </div>

      <div className="w-full max-w-xl mb-4 flex justify-between items-center">
        <button
          onClick={() => setShowSearchInput(!showSearchInput)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-colors duration-200"
          aria-label="Toggle Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        {showSearchInput && (
          <input
            type="text"
            placeholder="Search notes..."
            className="flex-grow ml-2 p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
        <button
          onClick={handleToggleSortFilterMode}
          className={`p-2 rounded-full ${showFavoritesOnly ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'} focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-colors duration-200 ml-2`}
          aria-label="Toggle Sort and Filter"
        >
          {/* Icon changes based on currentMode */}
          {currentMode === 0 && (
            <HiSortDescending className="h-6 w-6" />
          )}
          {currentMode === 1 && (
            <HiSortAscending className="h-6 w-6" />
          )}
          {currentMode === 2 && (
            <HiHeart className="h-6 w-6" />
          )}
          {currentMode === 3 && (
            <FaThumbtack className="h-6 w-6" />
          )}
        </button>
      </div>
      <div className="w-full max-w-4xl flex items-center justify-center mb-4">
        <p className="text-xs text-gray-400 dark:text-gray-600">Swipe left to delete, right to edit.</p>
      </div>
      {actionMessage && (
        <div className="w-full max-w-4xl flex justify-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 animate-fade-in-down">{actionMessage}</p>
        </div>
      )}
      {notes.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No notes saved yet.</p>
      ) : (
        <>
          {(() => {
            const filteredAndSortedNotes = notes
              .filter(note => !note.isTrashed && (!showFavoritesOnly || note.isFavorite) && (!showPinnedOnly || note.isPinned))
              .filter(note => note.content.toLowerCase().includes(searchQuery.toLowerCase()))
              .sort((a, b) => {
                if (sortOrder === 'newest') {
                  return b.timestamp - a.timestamp;
                } else {
                  return a.timestamp - b.timestamp;
                }
              });

            const pinnedNotes = filteredAndSortedNotes.filter(note => note.isPinned);
            const otherNotes = filteredAndSortedNotes.filter(note => !note.isPinned);

            return (
              <>
                {pinnedNotes.length > 0 && (
                  <div className="w-full max-w-4xl mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Pinned</h2>
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                      {pinnedNotes.map((note) => (
                        <div key={note.id} className={`animate-fade-in-up ${note.animate ? 'animate-bounce-in' : ''}`}>
                          <NoteCard
                            note={note}
                            onDelete={handleDeleteNote}
                            onNoteClick={startEditingNote}
                            themeMode={theme}
                            selectedForSwipe={selectedNoteIdForSwipe === note.id}
                            onSelectForSwipe={handleSelectNoteForSwipe}
                            onTogglePin={handleTogglePin}
                            onToggleFavorite={handleToggleFavorite}
                            onPermanentDelete={handlePermanentDelete}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {otherNotes.length > 0 && (
                  <div className="w-full max-w-4xl">
                    {pinnedNotes.length > 0 && (
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 mt-4">Others</h2>
                    )}
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
                      {otherNotes.map((note) => (
                        <div key={note.id} className={`animate-fade-in-up ${note.animate ? 'animate-bounce-in' : ''}`}>
                          <NoteCard
                            note={note}
                            onDelete={handleDeleteNote}
                            onNoteClick={startEditingNote}
                            themeMode={theme}
                            selectedForSwipe={selectedNoteIdForSwipe === note.id}
                            onSelectForSwipe={handleSelectNoteForSwipe}
                            onTogglePin={handleTogglePin}
                            onToggleFavorite={handleToggleFavorite}
                            onPermanentDelete={handlePermanentDelete}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </>
      )}

      {showSnackbar && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow-lg flex items-center animate-fade-in-up">
          {snackbarMessage}
          {lastDeletedNote && (
            <button onClick={handleUndoDelete} className="ml-4 font-bold text-blue-400 hover:text-blue-300">Undo</button>
          )}
        </div>
      )}

      {noteToEdit && (
        <EditNoteModal
          isOpen={isModalOpen}
          onClose={closeEditModal}
          note={noteToEdit}
          onSave={handleEditNote}
        />
      )}
    </div>
  );
}

export default Inkr;