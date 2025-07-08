import React, { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    timestamp: number;
    color: Theme;
  };
  onDelete: (id: string) => void;
  onNoteClick: (note: { id: string; title: string; content: string; timestamp: number; color: Theme; }) => void;
  themeMode: string;
  selectedForSwipe: boolean;
  onSelectForSwipe: (noteId: string) => void;
}

type Theme = 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onNoteClick, themeMode, selectedForSwipe, onSelectForSwipe }) => {
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
      <div {...(selectedForSwipe ? swipeHandlers : {})} className={`note-card shadow-md rounded-xl p-4 relative break-inside-avoid-column ${selectedForSwipe ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`} style={noteStyle} data-theme={note.color} data-theme-mode={themeMode}>
        {note.title && <h3 className="text-lg font-bold mb-1">{note.title}</h3>}
        <textarea
          className="w-full p-0 mb-2 border-none focus:outline-none resize-none overflow-hidden bg-transparent"
          value={note.content}
          rows={1}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          readOnly={true}
          onClick={handleClick}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {formatTimestamp(note.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default NoteCard;