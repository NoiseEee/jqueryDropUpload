jqueryDropUpload
================

(Yet another) jQuery drag-drop file uploader. Requires a modern browser supporting XHR2 / FormData.


Usage:
$(myElement).dropUpload(options);  -- make an element able to receive dropped-on files and upload them


OPTIONS:

allowedExtensions: []
  - an array of allowable file extensions to be accepted

allowMultiples: boolean
  - whether or not to accept multiple files
  
urlTarget: string
  - the script on the server that will receive the file uploads
  
progressBar: string
  - the ID of the progress bar to use, if one is to be used at all. This accepts a string, *not* a jquery object

