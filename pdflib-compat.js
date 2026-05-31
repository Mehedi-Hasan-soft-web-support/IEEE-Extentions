// pdflib-compat.js — ensures window.PDFLib is set regardless of how pdf-lib was loaded
(function() {
  if (!window.PDFLib && window.pdfLib) window.PDFLib = window.pdfLib;
  if (!window.PDFLib && typeof PDFLib !== 'undefined') window.PDFLib = PDFLib;
})();
