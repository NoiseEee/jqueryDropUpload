/**
 * Created by jmalinsky@gmail.com on 29/10/13.
 * My first-ever jQuery plugin, but adhered to best-practices afaik!
 *
 */


;(function ($) {

    $.fn.dropUpload = function(configOptions) {

        "use strict";
        jQuery.event.props.push( "dataTransfer" ); //tells jquery to push on the native html5 "dataTransfer" event on to the jquery Event Object


        return this.each(function() {

            var el = $(this);
            var options = $.extend({},$.fn.dropUpload.defaultOptions,configOptions);


            el.on('dragover', function(e) {
                cancel(e);
                el.addClass('over');
                return false;
            });

            el.on('dragenter', function(e) {
                cancel(e);
                el.addClass('entered');
                return false;
            });

            el.on('dragend', function(e) {
                cancel(e);
                el.removeClass('entered');
                return false;
            });

            el.on('drop', function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                if(validateDrop(e)===true) {
                    uploadDrop(e);
                }

                return false;
            });


            /**
             * Does this file match the requirements set by the options object?
             * @param event
             * @returns {boolean}
             */
            function validateDrop(event) {
                if(typeof event.dataTransfer === 'undefined') {
                    console.error('No dataTransfer in event! Aborting!');
                    return false;
                }

                var filesList = event.dataTransfer.files;
                var totalFiles = filesList.length;

                //check if multiple files are allowed
                if(totalFiles > 1 && options.allowMultiples===false) {
                    alert('Sorry, only one file can be uploaded at a time');
                    return false;
                }

                //check for valid extensions?
                if(options.allowedExtensions.length > 0) {
                    for(var x=0;x < totalFiles; x++) {
                        var file = filesList[x];
                        var fileSplit = file.name.split('.');
                        var extension = fileSplit[fileSplit.length - 1].toLowerCase();
                        if(options.allowedExtensions.indexOf(extension)===-1) {
                            alert('Sorry, but .'+extension+' files are not allowed here');
                            return false;
                        }
                    }
                }

                return true;
            }


            /**
             * the server upload
             * @param e
             */
            function uploadDrop(e) {
                var files = event.dataTransfer.files;
                var formData = new FormData();

                for(var i=0;i<files.length;i++) {
                    formData.append(i,files[i]);
                }

                if(options.progressBar!==null) {
                    var progBar = $('#'+options.progressBar);
                    var actualBar = progBar.find('[role="progressbar"]');
                    progBar.show();
                }

                var doIt = $.ajax({
                    xhr: function() {
                        var xhrobj = $.ajaxSettings.xhr();
                        if (xhrobj.upload && actualBar!==null) {
                            xhrobj.upload.addEventListener('progress', function(event) {
                                var percentage = 0;
                                if (event.lengthComputable && actualBar.length > 0) {
                                    percentage = (event.loaded / event.total * 100);
                                    actualBar.css('width',percentage+'%');
                                }
                            },false);
                        }
                        return xhrobj;
                    },
                    url: options.urlTarget,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    data: formData
                });

                doIt.done(function() {
                    actualBar.css('width','100%');
                    options.onComplete.call(this,doIt);
                });

                doIt.fail(function() {
                    actualBar.css('width','0%');
                    options.onError.call(this,doIt);
                });

            }


            function cancel(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } // required by FF + Safari
                return false; // required by IE
            }

        });
    };



    $.fn.dropUpload.defaultOptions = {
        allowedExtensions: [],
        allowMultiples: true,
        urlTarget: '',
        progressBar: null,
        onComplete: function () {},
        onError: function () { console.error('sorry, was XHR error');}
    };


}(jQuery));