// Declaration files for PDF.js
declare module 'pdfjs-dist/build/pdf.worker.min.js' {
  const workerSrc: string;
  export default workerSrc;
}

declare module 'pdfjs-dist/build/pdf.worker.min.mjs' {
  const workerSrc: string;
  export default workerSrc;
}

// Handle dynamically imported workers
declare module '*/pdf.worker.min.js' {
  const workerSrc: string;
  export default workerSrc;
}

declare module '*/pdf.worker.min.mjs' {
  const workerSrc: string;
  export default workerSrc;
}
