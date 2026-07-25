import { CitationType } from '@/types/types';
import type { Citation } from '@/types/types';

export interface CitationFieldDefinition {
  key: 'author' | 'title' | 'year' | 'publisher' | 'containerTitle' | 'url' | 'pageNumber';
  label: string;
  placeholder: string;
}

const fieldMap: Record<CitationType, CitationFieldDefinition[]> = {
  [CitationType.Book]: [
    { key: 'author', label: 'Author', placeholder: 'Author' },
    { key: 'title', label: 'Book Title', placeholder: 'Book title' },
    { key: 'publisher', label: 'Publisher', placeholder: 'Publisher' },
    { key: 'year', label: 'Year', placeholder: 'Year' },
  ],
  [CitationType.Article]: [
    { key: 'author', label: 'Author', placeholder: 'Author' },
    { key: 'title', label: 'Article Title', placeholder: 'Article title' },
    { key: 'containerTitle', label: 'Container Title', placeholder: 'Journal or website title' },
    { key: 'year', label: 'Year', placeholder: 'Year' },
    { key: 'pageNumber', label: 'Page Number(s)', placeholder: 'Page number(s)' },
  ],
  [CitationType.Website]: [
    { key: 'author', label: 'Author', placeholder: 'Author' },
    { key: 'title', label: 'Page Title', placeholder: 'Page title' },
    { key: 'publisher', label: 'Website Name', placeholder: 'Website name' },
    { key: 'year', label: 'Year', placeholder: 'Year' },
    { key: 'url', label: 'URL', placeholder: 'https://' },
  ],
  [CitationType.Video]: [
    { key: 'author', label: 'Creator', placeholder: 'Creator or channel' },
    { key: 'title', label: 'Title', placeholder: 'Title' },
    { key: 'publisher', label: 'Publisher', placeholder: 'Platform or publisher' },
    { key: 'year', label: 'Year', placeholder: 'Year' },
    { key: 'url', label: 'URL', placeholder: 'https://' },
  ],
  [CitationType.Other]: [
    { key: 'author', label: 'Author', placeholder: 'Author' },
    { key: 'title', label: 'Title', placeholder: 'Title' },
    { key: 'publisher', label: 'Publisher', placeholder: 'Publisher' },
    { key: 'year', label: 'Year', placeholder: 'Year' },
  ],
};

export function getRequiredMlaFields(type: Citation['type']): CitationFieldDefinition[] {
  return fieldMap[type] ?? fieldMap[CitationType.Other];
}

function formatAuthor(value?: string): string | null {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed.includes(',')) {
    return trimmed;
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) {
    return trimmed;
  }

  const [firstName, ...rest] = parts;
  return `${rest.join(' ')}, ${firstName}`;
}

function getAuthorLastName(value?: string): string | null {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed.includes(',')) {
    return trimmed.split(',')[0]?.trim() || null;
  }

  const parts = trimmed.split(/\s+/);
  return parts[parts.length - 1] || null;
}

function getShortTitle(value?: string): string | null {
  if (!value?.trim()) {
    return null;
  }

  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return null;
  }

  return words.slice(0, 3).join(' ');
}

export function buildMlaCitation(citation: Partial<Citation> & Pick<Citation, 'type'>): string {
  const type = citation.type ?? CitationType.Other;
  const author = formatAuthor(citation.author);
  const title = citation.title?.trim();
  const year = citation.year?.trim();
  const publisher = citation.publisher?.trim();
  const containerTitle = citation.containerTitle?.trim();
  const pageNumber = citation.pageNumber?.trim();
  const url = citation.url?.trim();

  switch (type) {
    case CitationType.Book: {
      const mainParts = [author, title, publisher && year ? `${publisher}, ${year}` : publisher || year].filter(Boolean);
      return `${mainParts.join('. ')}.`;
    }
    case CitationType.Article: {
      const articleParts = [
        author,
        title,
        containerTitle,
        publisher && year ? `${publisher}, ${year}` : publisher || year,
        pageNumber ? `pp. ${pageNumber}` : null,
      ].filter(Boolean);
      return `${articleParts.join('. ')}.`;
    }
    case CitationType.Website: {
      const websiteParts = [
        author,
        title,
        publisher,
        year,
        url,
      ].filter(Boolean);
      return `${websiteParts.join('. ')}.`;
    }
    case CitationType.Video: {
      const videoParts = [author, title, publisher, year, url].filter(Boolean);
      return `${videoParts.join('. ')}.`;
    }
    case CitationType.Other:
    default: {
      const otherParts = [author, title, publisher && year ? `${publisher}, ${year}` : publisher || year].filter(Boolean);
      return `${otherParts.join('. ')}.`;
    }
  }
}

export function buildMlaInlineCitation(citation: Partial<Citation>): string {
  const authorLastName = getAuthorLastName(citation.author);
  const title = getShortTitle(citation.title);
  const pageNumber = citation.pageNumber?.trim();

  const sourcePart = authorLastName ?? (title ? `\"${title}\"` : null);
  if (!sourcePart && !pageNumber) {
    return '';
  }

  if (!sourcePart) {
    return `(${pageNumber})`;
  }

  if (!pageNumber) {
    return `(${sourcePart})`;
  }

  return `(${sourcePart} ${pageNumber})`;
}
