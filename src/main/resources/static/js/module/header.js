const animate = require('animate.css');

//Constructor
function HeaderObject(settings) {
    let self = this;
    // Attach Div ID
    this.settings = settings;
    this.headerNav = '#header-nav';
    this.init();
}

HeaderObject.prototype.init = function() {
    let self = this;

    $(document).scroll(function() {

        if($(this).scrollTop() >= 70) {
            console.log($(this).scrollTop());
            $(self.headerNav).addClass('animated bounceInDown bg-custom-dark').removeClass('nav-top');


            // bouncin and down
            //fade to dark bg

        }

        if($(this).scrollTop() < 30) {
            $(self.headerNav).removeClass('animated bounceInDown bg-custom-dark').addClass('nav-top');

            //fade out bg
        }

    });

}







module.exports = HeaderObject;
