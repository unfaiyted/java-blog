const PageHeader = require('./module/header');


let header = new PageHeader();


//
// // $(window).on('load', function() { // makes sure the whole site is loaded
//     // $('#status').fadeOut(); // will first fade out the loading animation
//     // $('#preloader').delay(600).fadeOut('slow'); // will fade out the white DIV that covers the website.
//     // $('body').delay(600).css({'overflow':'visible'});
//     //
//
//
//
//    /* let  i = 0;
//     setInterval(function() {
//
//         let images= ['time.jpg','24hours.jpg','hipster.jpg','large-pg-img.jpg'];
//         (i === images.length-1) ? i = 0 : i++;
//
//         console.log(i);
//         var image = $('#image-holder');
//         image.fadeOut(2000, function () {
//             image.css("background", "url('img/" + images[i] + "')");
//             image.css("background-size", "cover");
//             image.fadeIn(2000);
//
//         });
//
//     }, 6000);*/
//
// //
// //     $(document).scroll(function() {
// //
// //         if($(this).scrollTop() >= 70) {
// //             $('.bg-custom-dark').css('background-color','#1C1C1D');
// //         } else {
// //             $('.bg-custom-dark').css('background-color','transparent');
// //
// //         }
// //
// //     });
// //
// //
// //     // hide elements display new ones for  4 panels
// //     $('.more-btn').click(function () {
// //         $('.panel').hide("slide", { direction: "right" }, 2000);
// //         $(this).parent().parent().find('.panel').show("slide", { direction: "left" }, 1000)
// //
// //     })
// //
// //
// // });
//
//
// //----- OPEN
// // OPEN
// // $('[data-popup-open]').on('click', function(e)  {
// //     var targeted_popup_class = jQuery(this).attr('data-popup-open');
// //     $('body').css("overflow","hidden");
// //     $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
// // });
// // //----- CLOSE
// // $('[data-popup-close]').on('click', function(e)  {
// //     var targeted_popup_class = jQuery(this).attr('data-popup-close');
// //     $('body').css("overflow","auto");
// //     $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
//
// // });
//
//



// Select all links with hashes
$('a[href*="#"]')
// Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
            &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function() {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });