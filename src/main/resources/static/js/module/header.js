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
            $(self.headerNav).addClass('animated slideInDown bg-custom-dark').removeClass('nav-top');
        }

        if($(this).scrollTop() < 30) {
            $(self.headerNav).removeClass('animated slideInDown bg-custom-dark').addClass('nav-top');

        }
    });


    $('.nav-item a').click(function () {
         // create click to do animation?
    });


};




module.exports = HeaderObject;
