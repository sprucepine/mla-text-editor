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
}

export enum SaveState {
  Idle = 'idle',
  Saving = 'saving',
  Saved = 'saved',
  OldSaved = 'oldSaved',
  Error = 'error',
}

