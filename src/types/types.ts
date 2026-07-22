import type { JSONContent } from "@tiptap/vue-3";

export enum DocumentType {
  body = "body",
  heading2 = "heading2",
  heading3 = "heading3"
}

export interface ContentBlock {
  type: DocumentType;
  text: string;
  content: JSONContent[]; // Recursive definition for nested content blocks
}

export interface Citation {
  id: string;
  name: string;
  pageNumber?: string;
  type: CitationType;
}

export enum CitationType {

  Book = 'Book',
  Article = 'Article',
  Website = 'Website',
  NoAuthor = 'NoAuthor'
}

export interface DocumentItem {
  id: string;
  fileTitle: string;
  fileIcon: string;
  headerName: string;
  title: string;
  name: string;
  professor: string;
  course: string;
  dueDate: string;
  content: ContentBlock[];
  citations: Citation[];
}

export enum SaveState {
  Idle = 'idle',
  Saving = 'saving',
  Saved = 'saved',
  OldSaved = 'oldSaved',
  Error = 'error',
}

