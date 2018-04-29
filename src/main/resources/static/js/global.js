function preload(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img />').attr('src',this).appendTo('body').css('display','none');
    });
}

// Usage:

preload([
    'img/time.jpg',
    'img/24hours.jpg',
    'img/hipster.jpg',
    'img/large-pg-img.jpg'
]);



$(window).on('load', function() { // makes sure the whole site is loaded
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(600).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(600).css({'overflow':'visible'});



    let  i = 0;
    setInterval(function() {

        let images= ['time.jpg','24hours.jpg','hipster.jpg','large-pg-img.jpg'];
        (i === images.length-1) ? i = 0 : i++;

        console.log(i);
        var image = $('#image-holder');
        image.fadeOut(2000, function () {
            image.css("background", "url('img/" + images[i] + "')");
            image.css("background-size", "cover");
            image.fadeIn(2000);

        });

    }, 6000);


    $(document).scroll(function() {

        if($(this).scrollTop() >= 70) {
            $('.bg-custom-dark').css('background-color','#1C1C1D');
        } else {
            $('.bg-custom-dark').css('background-color','transparent');

        }

    });




});


//----- OPEN

$('[data-popup-open]').on('click', function(e)  {
    var targeted_popup_class = jQuery(this).attr('data-popup-open');
    $('body').css("overflow","hidden");
    $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
    e.preventDefault();
});
//----- CLOSE
$('[data-popup-close]').on('click', function(e)  {
    var targeted_popup_class = jQuery(this).attr('data-popup-close');
    $('body').css("overflow","auto");
    $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

    e.preventDefault();
});
