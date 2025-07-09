import React, { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { FaThumbtack } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    timestamp: number;
    color: Theme;
    isPinned: boolean;
    isFavorite: boolean;
    isTrashed: boolean;
  };
  onDelete: (id: string) => void;
  onNoteClick: (note: { id: string; title: string; content: string; timestamp: number; color: Theme; }) => void;
  themeMode: string;
  selectedForSwipe: boolean;
  onSelectForSwipe: (noteId: string) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

type Theme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';

const processCustomColors = (text: string): string => {
  const colorMap: { [key: string]: string } = {
    r: 'red',
    b: 'blue',
    g: 'green',
    y: 'yellow',
    p: 'purple',
    k: 'pink',
    i: 'indigo',
    gr: 'gray',
    bl: 'black',
    w: 'white',
  };

  return text.replace(/\[c-([a-z]+)\](.*?)\[c\]/g, (match, colorCode, content) => {
    const colorName = colorMap[colorCode] || 'black'; // Default to black if color code not found
    return `<span class="text-${colorName}-500">${content}</span>`;
  });
};

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

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onNoteClick, themeMode, selectedForSwipe, onSelectForSwipe, onTogglePin, onToggleFavorite }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const noteCardRef = useRef<HTMLDivElement>(null);

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      const maxSwipe = noteCardRef.current ? noteCardRef.current.offsetWidth / 3 : 100; // Limit swipe to 1/3 of card width
      setSwipeOffset(Math.max(-maxSwipe, Math.min(maxSwipe, eventData.deltaX)));
      setIsSwiping(true);
    },
    onSwipedLeft: (eventData) => {
      if (noteCardRef.current) {
        const cardWidth = noteCardRef.current.offsetWidth;
        if (Math.abs(eventData.deltaX) > cardWidth * 0.5 || Math.abs(eventData.velocity) > 0.5) {
          setIsDeleting(true); // Trigger the deletion animation
          setTimeout(() => {
            onDelete(note.id);
          }, 300); // Allow time for the animation to play
        } else {
          setSwipeOffset(0); // Snap back if not enough swipe
        }
      }
      setIsSwiping(false);
    },
    onSwipedRight: (eventData) => {
      if (noteCardRef.current) {
        const cardWidth = noteCardRef.current.offsetWidth;
        if (eventData.deltaX > cardWidth * 0.5 || eventData.velocity > 0.5) {
          onNoteClick(note);
        } else {
          setSwipeOffset(0); // Snap back if not enough swipe
        }
      }
      setIsSwiping(false);
    },
    onSwipedAborted: () => {
      setSwipeOffset(0);
      setIsSwiping(false);
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const noteStyle = {
    transform: `translateX(${swipeOffset}px)`,
    transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
  };

  const handleClick = () => {
    if (selectedForSwipe) {
      onNoteClick(note);
    } else {
      onSelectForSwipe(note.id);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return "just now";
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days === 1) {
      return "yesterday";
    } else if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (weeks < 4) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div ref={noteCardRef} className={`note-card-wrapper relative overflow-hidden rounded-xl mb-4 ${isDeleting ? 'animate-delete-card' : ''}`}>
      {/* Background for swipe actions */}
      <div className="absolute top-0 left-0 h-full w-full flex justify-between items-center">
        {/* Edit Action (Right Swipe) */}
        <div className="bg-green-500 h-full flex items-center rounded-l-xl px-4" style={{ opacity: Math.max(0, swipeOffset / 80), willChange: 'opacity' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
          </svg>
        </div>
        {/* Delete Action (Left Swipe) */}
        <div className="bg-red-500 h-full flex items-center rounded-r-xl px-4" style={{ opacity: Math.max(0, -swipeOffset / 80), willChange: 'opacity' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </div>

      {/* The actual note card that moves */}
      <div {...swipeHandlers} className={`note-card shadow-md rounded-xl p-4 relative break-inside-avoid-column ${selectedForSwipe ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`} style={noteStyle} data-theme={note.color} data-theme-mode={themeMode}>
        {note.title && <h3 className="text-lg font-bold mb-1">{note.title}</h3>}
        <div
          className={`w-full p-0 mb-2 border-none focus:outline-none resize-none overflow-hidden bg-transparent ${getTextColorClass(note.color, themeMode)}`}
          onClick={handleClick}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{processCustomColors(note.content)}</ReactMarkdown>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimestamp(note.timestamp)}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}
              className={`p-1 rounded-full ${note.isPinned ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors duration-200`}
              aria-label="Toggle Pin"
            >
              <FaThumbtack className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(note.id); }}
              className={`p-1 rounded-full ${note.isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors duration-200`}
              aria-label="Toggle Favorite"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {/* Trash icon at bottom right */}
        {note.isTrashed && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="absolute bottom-2 right-2 p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors duration-200"
            aria-label="Delete Permanently"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;