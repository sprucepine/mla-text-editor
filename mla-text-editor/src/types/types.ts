export enum DocumentType {
  body = "body",
  heading2 = "heading2",
  heading3 = "heading3"
}

export interface ContentBlock {
  type: DocumentType;
  text: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  name: string;
  professor: string;
  course: string;
  content: ContentBlock[]; 
}

export enum SaveState {
  Idle = 'idle',
  Saving = 'saving',
  Saved = 'saved',
  OldSaved = 'oldSaved',
  Error = 'error',
}
