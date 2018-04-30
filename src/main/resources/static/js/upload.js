$(function() {

    let uploadObj = [];

    // If existing data is found in page.
    if($(`#post-documents`).val()) {
        console.log($(`#post-documents`).val());
        uploadObj = JSON.parse($(`#post-documents`).val());
    }

    function refreshUploaded() {
        $('#uploadsList').empty();

        console.log(uploadObj);

        $(`#post-documents`).attr('value',JSON.stringify(uploadObj));

        let i = 1;
        uploadObj.forEach(({fileName}) => {
            $('#uploadsList').append(
                $(`<div>`).append(
                    $('<div>').text("Image #" + i),
                $(`<div>`).append(
                    $(`<img src="/images/${fileName}" class="m-2 rounded-img img-fluid post-upload-img">`)),
                    $(`<div>`).append(
                        $(`<button class="btn btn-primary del-btn" data-img="${fileName}">`).text("Delete")
                    )
                ));
            i++;
        });

        $('.del-btn').click(function () {
            let cnfrm = confirm("Are you sure?");
            if (cnfrm) { removeUploaded($(this).data('img')); }
        });
    }

    function removeUploaded (fileName) {
        $.each(uploadObj, function(i){
            if(uploadObj[i].fileName === fileName) {
                uploadObj.splice(i,1);
                return false;
            }
        });
        refreshUploaded();
    }

    // Gets files uploaded
    $('button.submit-upload').click(function(e) {
        e.preventDefault();
        //Disable submit button
        $(this).prop('disabled',true);

        console.log("test");

        var form = document.getElementById("upload-form");
        var formData = new FormData(form);

        // file uploading call
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

                //Set on progress event handler
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
            $('#alertM sg').text("Completed successfully!");

            let last = JSON.parse(msg);

            uploadObj.push(last);


            refreshUploaded();

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

    // Start upload refresh on load.
    refreshUploaded();

    // Init Editor
    $(document).ready(function() {

    // SummerNote Editor

    var codeBtn = function (context) {
        var ui = $.summernote.ui;

        // create button
        var button = ui.button({
            contents: '<i class="fa fa-child"/> Code',
            container: false,
            tooltip: 'code-input',
            click: function () {
                context.invoke('editor.pasteHTML', '<pre style="border:1px solid #000;"><code class="html">Place your code here.</code></pre>');
                // $('#body').summernote('editor.pasteHTML', '<pre><code class="html">Place your code here.</code></pre>');
            }
        });
        return button.render();
    }

        $('#body').summernote({
            height: 400,
            minHeight: 300,
            maxHeight: 800,
            "dialogsInBody": true,
            "prettifyHtml": true,
            toolbar: [
                // [groupName, [list of button]]
                ['code', ['code']],
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ["misc", ["codeview"]]
            ],
            codemirror: { // codemirror options
                theme: 'monokai',
                "mode": "text/html",
                "htmlMode": true,
                "lineNumbers": true,
                "width" : "100px",
                "textWrapping" : true
            },
            buttons: {
                code: codeBtn
            },

            placeholder: 'type something brilliant, or at least readable.',
        });
    });

    $('.custom-file-input').on('change', function() {
        let fileName = $(this).val().split('\\').pop();
        $(this).next('.custom-file-label').addClass("selected").html(fileName);
    });

});