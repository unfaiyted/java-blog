const api = require("../libs/local");


//Constructor
function ContactObject(parameters) {

    this.submitBtn = '#contactSubmit';

    this.init();
}

ContactObject.prototype.init = function() {
    let self = this;
    // Setup Click event
    $(this.submitBtn).click(function(e) {
        $(this).prop('disabled', true);
        e.preventDefault();
        self.sendData();
    });
};


ContactObject.prototype.sendData = function () {

    let data =  {
        name: $('#contact-name').val(),
        email: $('#contact-email').val(),
        phone: $('#contact-phone').val(),
        message: $('#contact-message').val()
    };


    api.addData("contact", data).then(function(d) {
        $('#contact-sent').text("Message sent! Thank you!");
    });


};


module.exports = ContactObject;