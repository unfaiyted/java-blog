$(function() {
    $('button.submit-upload').click(function(e) {
        e.preventDefault();
        //Disable submit button
        $(this).prop('disabled',true);

        var form = document.getElementById("upload-form");
        var formData = new FormData(form);

        // Ajax call for file uploaling
        var ajaxReq = $.ajax({
            url : '../fileupload',
            type : 'POST',
            data : formData,
            cache : false,
            contentType : false,
            processData : false,
            xhr: function(){
                //Get XmlHttpRequest object
                var xhr = $.ajaxSettings.xhr() ;

                //Set onprogress event handler
                xhr.upload.onprogress = function(event){
                    var perc = Math.round((event.loaded / event.total) * 100);
                    $('#progressBar').text(perc + '%');
                    $('#progressBar').css('width',perc + '%');
                };
                return xhr ;
            },
            beforeSend: function( xhr ) {
                //Reset alert message and progress bar
                $('#alertMsg').text('');
                $('#progressBar').text('');
                $('#progressBar').css('width','0%');
            }
        });

        // Called on success of file upload
        ajaxReq.done(function(msg) {
            $('#alertMsg').css('color',"blue");
            $('#alertMsg').text(msg);
            $('input[type=file]').val('');
            $('button[type=submit]').prop('disabled',false);
        });

        // Called on failure of file upload
        ajaxReq.fail(function(jqXHR) {
            $('#alertMsg').css('color',"red");
            $('#alertMsg').text(jqXHR.responseText+'('+jqXHR.status+
                ' - '+jqXHR.statusText+')');
            $('button[type=submit]').prop('disabled',false);
        });
    });
});