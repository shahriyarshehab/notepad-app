export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  folder: string;
  isPinned: boolean;
  isFavorite: boolean;
  isTrashed: boolean;
  deletedAt?: string; // Timestamp when the note was moved to trash
  type: 'text' | 'checklist';
  checklistItems?: ChecklistItem[];
  color: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'teal';
  reminder?: string; // ISO 8601 date string for reminder
  animate?: boolean;
}
