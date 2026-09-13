/**
 * File Upload Parser Utility
 * Handles parsing of .txt, .pdf, and .docx files for text extraction
 */

export interface FileUploadResult {
  success: boolean;
  text?: string;
  fileName?: string;
  error?: string;
}

/**
 * Extract text from uploaded files (.txt, .pdf, .docx)
 */
export async function parseFile(file: File): Promise<FileUploadResult> {
  const fileName = file.name;
  const fileType = file.type;
  const extension = fileName.split('.').pop()?.toLowerCase();

  try {
    // Text files
    if (extension === 'txt' || fileType === 'text/plain') {
      const text = await file.text();
      return {
        success: true,
        text: text.trim(),
        fileName,
      };
    }

    // PDF files
    if (extension === 'pdf' || fileType === 'application/pdf') {
      return await parsePDF(file, fileName);
    }

    // Word documents
    if (extension === 'docx' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await parseDocx(file, fileName);
    }

    return {
      success: false,
      error: `Unsupported file type: ${extension}. Please use .txt, .pdf, or .docx files.`,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Parse PDF file using pdf.js
 */
async function parsePDF(file: File, fileName: string): Promise<FileUploadResult> {
  try {
    // Dynamically import pdf.js to avoid bundling issues
    const pdfjsLib = await import('pdfjs-dist');
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return {
      success: true,
      text: fullText.trim(),
      fileName,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure pdfjs-dist is installed.`,
    };
  }
}

/**
 * Parse DOCX file using JSZip to extract XML content
 */
async function parseDocx(file: File, fileName: string): Promise<FileUploadResult> {
  try {
    // Extract text from raw XML in DOCX archive
    const text = await extractTextFromDocxBuffer(await file.arrayBuffer());
    
    return {
      success: true,
      text: text.trim(),
      fileName,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure docx parsing is configured.`,
    };
  }
}

/**
 * Extract text from DOCX file buffer
 * DOCX files are ZIP archives containing XML files
 */
async function extractTextFromDocxBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // Dynamically import JSZip for DOCX parsing
    const JSZip = await import('jszip').then(m => m.default);
    const zip = new JSZip();
    const docx = await zip.loadAsync(arrayBuffer);
    
    // Extract document.xml which contains the main content
    const documentXml = docx.file('word/document.xml');
    if (!documentXml) {
      throw new Error('document.xml not found in DOCX archive');
    }
    
    const content = await documentXml.async('text');
    
    // Extract text from XML (simplified - removes XML tags)
    const text = content
      .replace(/<[^>]+>/g, ' ') // Remove XML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return text;
  } catch (error) {
    throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate file type and size
 */
export function validateFile(file: File, maxSizeMB: number = 10): { valid: boolean; error?: string } {
  const maxBytes = maxSizeMB * 1024 * 1024;
  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowedTypes = ['txt', 'pdf', 'docx'];

  if (!allowedTypes.includes(extension || '')) {
    return {
      valid: false,
      error: `File type not supported. Please use .txt, .pdf, or .docx files.`,
    };
  }

  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`,
    };
  }

  return { valid: true };
}
