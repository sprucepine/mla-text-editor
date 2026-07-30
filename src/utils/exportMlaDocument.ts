import { jsPDF } from 'jspdf'
import type { JSONContent } from '@tiptap/vue-3'
import { buildMlaCitation } from '@/utils/mlaCitationGenerator'
import type { ContentBlock, DocumentItem } from '@/types/types'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function extractTextFromNode(node: JSONContent): string {
  const textParts: string[] = []

  if (typeof node.text === 'string') {
    textParts.push(node.text)
  }

  if (Array.isArray(node.content)) {
    for (const childNode of node.content) {
      textParts.push(extractTextFromNode(childNode))
    }
  }

  return textParts.join(' ').replace(/\s+/g, ' ').trim()
}

function extractBlockText(block: ContentBlock): string {
  const directText = block.text?.trim()
  if (directText) {
    return directText
  }

  return block.content
    .map((node) => extractTextFromNode(node))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatMlaDate(value?: string): string {
  if (!value?.trim()) {
    return ''
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return value.trim()
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}

type InlineStyle = {
  bold?: boolean
  italic?: boolean
  strike?: boolean
  code?: boolean
}

type StyledToken = {
  text: string
  style: InlineStyle
}

function mergeInlineStyles(baseStyle: InlineStyle, nextStyle: InlineStyle): InlineStyle {
  return {
    bold: baseStyle.bold || nextStyle.bold,
    italic: baseStyle.italic || nextStyle.italic,
    strike: baseStyle.strike || nextStyle.strike,
    code: baseStyle.code || nextStyle.code,
  }
}

function getInlineStyleFromMarks(node: JSONContent): InlineStyle {
  const style: InlineStyle = {}

  for (const mark of node.marks ?? []) {
    switch (mark.type) {
      case 'bold':
        style.bold = true
        break
      case 'italic':
        style.italic = true
        break
      case 'strike':
        style.strike = true
        break
      case 'code':
        style.code = true
        break
      default:
        break
    }
  }

  return style
}

function tokenizeStyledText(text: string, style: InlineStyle): StyledToken[] {
  return text.match(/\S+|\s+/g)?.map((segment) => ({ text: segment, style })) ?? []
}

function collectStyledTokens(node: JSONContent, inheritedStyle: InlineStyle = {}): StyledToken[] {
  if (node.type === 'hardBreak') {
    return [{ text: '\n', style: inheritedStyle }]
  }

  const currentStyle = node.text ? mergeInlineStyles(inheritedStyle, getInlineStyleFromMarks(node)) : inheritedStyle

  if (typeof node.text === 'string') {
    return tokenizeStyledText(node.text, currentStyle)
  }

  if (Array.isArray(node.content)) {
    return node.content.flatMap((childNode) => collectStyledTokens(childNode, currentStyle))
  }

  return []
}

function getCitationSortKey(citation: DocumentItem['citations'][number]): string {
  const author = citation.author?.trim()
  if (author) {
    if (author.includes(',')) {
      return author.split(',')[0]?.trim().toLowerCase() || ''
    }

    const authorParts = author.split(/\s+/).filter(Boolean)
    return (authorParts[authorParts.length - 1] || author).toLowerCase()
  }

  return (citation.title?.trim() || citation.name || '').toLowerCase()
}

function getRunningHead(documentItem: DocumentItem): string {
  const headerName = documentItem.headerName?.trim()
  if (headerName) {
    return headerName
  }

  const nameParts = documentItem.name?.trim().split(/\s+/).filter(Boolean) ?? []
  return nameParts[nameParts.length - 1] || documentItem.fileTitle?.trim() || 'Student'
}

function getFontStyle(style: InlineStyle): 'normal' | 'bold' | 'italic' | 'bolditalic' {
  if (style.bold && style.italic) {
    return 'bolditalic'
  }

  if (style.bold) {
    return 'bold'
  }

  if (style.italic) {
    return 'italic'
  }

  return 'normal'
}

function createExportFileName(documentItem: DocumentItem, extension: 'html' | 'pdf'): string {
  const fallbackName = documentItem.fileTitle?.trim() || documentItem.title?.trim() || 'mla-document'
  return `${fallbackName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'mla-document'}.${extension}`
}

function isMeaningfulCitation(citation: string): boolean {
  const normalized = citation.replace(/\s+/g, '').replace(/\./g, '')
  return normalized.length > 0
}

export function buildMlaDocumentExportHtml(documentItem: DocumentItem): string {
  const title = documentItem.title.trim() || documentItem.fileTitle.trim() || 'Untitled Document'
  const headingLines = [documentItem.name, documentItem.professor, documentItem.course, formatMlaDate(documentItem.dueDate)]
    .map((line) => line?.trim())
    .filter(Boolean)

  const bodyParagraphs = documentItem.content
    .map((block) => extractBlockText(block))
    .filter(Boolean)

  const worksCitedEntries = documentItem.citations
    .map((citation) => buildMlaCitation(citation))
    .filter((citation): citation is string => isMeaningfulCitation(citation))

  const bodyHtml = bodyParagraphs.length > 0
    ? bodyParagraphs.map((paragraph) => `<p class="body-paragraph">${escapeHtml(paragraph)}</p>`).join('\n        ')
    : '<p class="body-paragraph body-paragraph-empty">Start typing in the editor to build your MLA paper.</p>'

  const worksCitedHtml = worksCitedEntries.length > 0
    ? worksCitedEntries.map((citation) => `<p class="works-cited-entry">${escapeHtml(citation)}</p>`).join('\n        ')
    : ''

  const headingHtml = headingLines
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('\n        ')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page {
        size: letter;
        margin: 1in;
      }

      :root {
        color-scheme: light;
      }

      body {
        margin: 0;
        background: #fff;
        color: #000;
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
        line-height: 2;
      }

      .paper {
        padding: 1in;
      }

      .header {
        text-align: right;
        margin-bottom: 1rem;
      }

      .heading {
        margin-bottom: 1rem;
      }

      .title {
        text-align: center;
        margin: 0 0 1rem;
        font-size: 12pt;
        font-weight: 400;
      }

      .body-paragraph {
        margin: 0;
        text-indent: 0.5in;
      }

      .body-paragraph + .body-paragraph {
        margin-top: 0;
      }

      .body-paragraph-empty {
        text-indent: 0;
      }

      .works-cited {
        margin-top: 1in;
      }

      .works-cited-title {
        text-align: center;
        margin: 0 0 1rem;
        font-weight: 400;
      }

      .works-cited-entry {
        margin: 0;
        padding-left: 0.5in;
        text-indent: -0.5in;
      }

      .works-cited-entry + .works-cited-entry {
        margin-top: 0;
      }

      .works-cited-empty {
        text-indent: 0;
        padding-left: 0;
      }
    </style>
  </head>
  <body>
    <main class="paper">
      <section class="header">
        ${documentItem.headerName?.trim() ? `<p>${escapeHtml(documentItem.headerName.trim())}</p>` : ''}
      </section>

      <section class="heading">
        ${headingHtml}
      </section>

      <h1 class="title">${escapeHtml(title)}</h1>

      <section class="body">
        ${bodyHtml}
      </section>

      ${worksCitedEntries.length > 0 ? `
      <section class="works-cited">
        <h2 class="works-cited-title">Works Cited</h2>
        ${worksCitedHtml}
      </section>` : ''}
    </main>
  </body>
</html>`
}

export function downloadMlaDocumentExport(documentItem: DocumentItem): void {
  const html = buildMlaDocumentExportHtml(documentItem)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement('a')

  link.href = url
  link.download = createExportFileName(documentItem, 'html')
  link.rel = 'noopener'

  window.document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function exportMlaDocumentAsPdf(documentItem: DocumentItem): void {
  const pdf = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const marginLeft = 72
  const marginRight = 72
  const marginTop = 72
  const marginBottom = 72
  const headerTop = 36
  const contentWidth = pageWidth - marginLeft - marginRight
  const lineHeight = 24
  let cursorY = marginTop

  const runningHead = getRunningHead(documentItem)

  function setPage(pageNumber: number): void {
    pdf.setPage(pageNumber)
    pdf.setFont('times', 'normal')
    pdf.setFontSize(12)
  }

  function drawPageHeader(pageNumber: number): void {
    setPage(pageNumber)
    pdf.text(`${runningHead} ${pageNumber}`, pageWidth - marginRight, headerTop, { align: 'right' })
  }

  function startNewPage(): void {
    pdf.addPage()
    cursorY = marginTop
  }

  function addPageIfNeeded(nextBlockHeight: number): void {
    if (cursorY + nextBlockHeight <= pageHeight - marginBottom) {
      return
    }

    startNewPage()
  }

  function writeLines(lines: string[], options?: { align?: 'left' | 'center' | 'right' }): void {
    const align = options?.align ?? 'left'

    for (const line of lines) {
      addPageIfNeeded(lineHeight)
      pdf.text(line, marginLeft, cursorY, { align })
      cursorY += lineHeight
    }
  }

  function writeCenteredParagraph(text: string): void {
    const wrappedLines = pdf.splitTextToSize(text, contentWidth)

    for (const line of wrappedLines) {
      addPageIfNeeded(lineHeight)
      pdf.text(line, pageWidth / 2, cursorY, { align: 'center' })
      cursorY += lineHeight
    }
  }

  function writeParagraph(text: string, options?: { firstLineIndent?: number; hangingIndent?: number }): void {
    const firstLineIndent = options?.firstLineIndent ?? 0
    const hangingIndent = options?.hangingIndent ?? 0
    const wrappedLines = pdf.splitTextToSize(text, contentWidth - Math.max(firstLineIndent, hangingIndent))

    for (let lineIndex = 0; lineIndex < wrappedLines.length; lineIndex += 1) {
      const indent = lineIndex === 0 ? firstLineIndent : hangingIndent
      addPageIfNeeded(lineHeight)
      pdf.text(wrappedLines[lineIndex] ?? '', marginLeft + indent, cursorY)
      cursorY += lineHeight
    }
  }

  function measureStyledToken(token: StyledToken): number {
    pdf.setFont('times', getFontStyle(token.style))
    return pdf.getTextWidth(token.text)
  }

  function renderStyledLine(tokens: StyledToken[], x: number, y: number): void {
    let cursorX = x

    for (const token of tokens) {
      if (token.text === '\n') {
        continue
      }

      pdf.setFont('times', getFontStyle(token.style))
      pdf.text(token.text, cursorX, y)
      cursorX += measureStyledToken(token)
    }
  }

  function wrapStyledTokens(tokens: StyledToken[], maxWidth: number): StyledToken[][] {
    const lines: StyledToken[][] = []
    let currentLine: StyledToken[] = []
    let currentWidth = 0

    const pushCurrentLine = (): void => {
      if (currentLine.length > 0) {
        lines.push(currentLine)
      }
      currentLine = []
      currentWidth = 0
    }

    for (const token of tokens) {
      if (token.text === '\n') {
        pushCurrentLine()
        continue
      }

      if (/^\s+$/.test(token.text)) {
        if (currentLine.length > 0) {
          currentLine.push({ text: ' ', style: token.style })
          currentWidth += measureStyledToken({ text: ' ', style: token.style })
        }
        continue
      }

      const tokenWidth = measureStyledToken(token)
      if (currentLine.length > 0 && currentWidth + tokenWidth > maxWidth) {
        pushCurrentLine()
      }

      if (tokenWidth > maxWidth) {
        const pieces = pdf.splitTextToSize(token.text, maxWidth) as string[]

        for (const piece of pieces) {
          const pieceToken = { text: piece, style: token.style }
          const pieceWidth = measureStyledToken(pieceToken)

          if (currentLine.length > 0 && currentWidth + pieceWidth > maxWidth) {
            pushCurrentLine()
          }

          currentLine.push(pieceToken)
          currentWidth += pieceWidth
        }

        continue
      }

      currentLine.push(token)
      currentWidth += tokenWidth
    }

    if (currentLine.length > 0) {
      lines.push(currentLine)
    }

    return lines
  }

  function writeStyledParagraph(node: JSONContent, options?: { firstLineIndent?: number; hangingIndent?: number }): void {
    const firstLineIndent = options?.firstLineIndent ?? 0
    const hangingIndent = options?.hangingIndent ?? 0
    const tokens = collectStyledTokens(node)

    if (tokens.length === 0) {
      addPageIfNeeded(lineHeight)
      cursorY += lineHeight
      return
    }

    const wrappedLines = wrapStyledTokens(tokens, contentWidth - Math.max(firstLineIndent, hangingIndent))

    for (let lineIndex = 0; lineIndex < wrappedLines.length; lineIndex += 1) {
      const indent = lineIndex === 0 ? firstLineIndent : hangingIndent
      addPageIfNeeded(lineHeight)
      renderStyledLine(wrappedLines[lineIndex] ?? [], marginLeft + indent, cursorY)
      cursorY += lineHeight
    }
  }

  pdf.setFont('times', 'normal')
  pdf.setFontSize(12)

  const headingLines = [documentItem.name, documentItem.professor, documentItem.course, formatMlaDate(documentItem.dueDate)]
    .map((line) => line?.trim())
    .filter(Boolean) as string[]

  writeLines(headingLines)

  const title = documentItem.title.trim() || documentItem.fileTitle.trim() || 'Untitled Document'
  writeCenteredParagraph(title)

  const bodyNodes = documentItem.content.flatMap((block) => block.content)

  if (bodyNodes.length === 0) {
    writeParagraph('Start typing in the editor to build your MLA paper.', { firstLineIndent: 36 })
  } else {
    for (const node of bodyNodes) {
      if (node.type === 'paragraph' || node.type === 'heading' || node.type === 'blockquote') {
        writeStyledParagraph(node, { firstLineIndent: 36 })
        continue
      }

      const fallbackText = extractTextFromNode(node)
      if (fallbackText) {
        writeParagraph(fallbackText, { firstLineIndent: 36 })
      }
    }
  }
  const worksCitedEntries = documentItem.citations
    .slice()
    .sort((left, right) => getCitationSortKey(left).localeCompare(getCitationSortKey(right)))
    .map((citation) => buildMlaCitation(citation))
    .filter((citation): citation is string => isMeaningfulCitation(citation))

  if (worksCitedEntries.length !== 0) {
    startNewPage()
    writeLines(['Works Cited'], { align: 'center' })
    cursorY += lineHeight

    for (const citation of worksCitedEntries) {
      writeParagraph(citation, { hangingIndent: 36 })
    }
  }

  for (let pageNumber = 1; pageNumber <= pdf.getNumberOfPages(); pageNumber += 1) {
    drawPageHeader(pageNumber)
  }

  pdf.save(createExportFileName(documentItem, 'pdf'))
}
