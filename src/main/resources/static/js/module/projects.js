const animate = require('animate.css');



//extend jquery animate
$.fn.extend({
    animateCss: function(animationName, callback) {
        var animationEnd = (function(el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    },
});


//Constructor
function ProjectsObject(projects) {
    let self = this;

    this.projects = projects;

    // default projects value if null
    if(projects  === undefined) {
        this.projects = [
            {
                title: "Project Name",
                desc: "Java Spring Framework, JQuery, Node",
                github: "http://www.github.com",
                image: "24hours.jpg"
            },
            {
                title: "Project Someone",
                desc: "Java JQuery, Node",
                github: "http://www.github.com",
                image: "astro-bg.jpg"
            },
            {
                title: "Project Test",
                desc: "Java Spring Framework, JQuery",
                github: "http://www.github.com",
                image: "hipster.jpg"
            },

        ];
    }

    this.headerNav = '#header-nav';
    this.backBtn = '.projects-back';
    this.forwardBtn = '.projects-forward';


    this.currentProject = 0;
    this.maxProjects = 2;

    this.init();
}


ProjectsObject.prototype.init = function () {
    let self = this;


    $(this.backBtn).click(function () {
            self.change("back");
    });


    $(this.forwardBtn).click(function () {
            self.change("forward");
    });

};


ProjectsObject.prototype.change = function (direction) {
    let self  = this;


    if(direction === "forward") {

        if(this.currentProject === this.maxProjects) {
            this.currentProject = 0;
        } else {
            this.currentProject++;
        }
    }

    if(direction === "back") {

        if(this.currentProject === 0) {
            this.currentProject = this.maxProjects;
        } else {
            this.currentProject--;
        }
    }


    this.renderProject();

};


ProjectsObject.prototype.renderProject = function () {

    let p = this.projects[this.currentProject];

    console.log(this.projects[this.currentProject]);

    let backImg  = $('#work-bg');

    backImg.css("background-color","#000");

    $('#work').animateCss('bounceOutRight', function() {

        let image = $('#work');
            image.css("background", "url('img/" + p.image + "')");
            image.css("background-size", "cover");


        $('.proj-name').text(p.title);
        $('.proj-desc').text(p.desc);
        $('.proj-link').attr("href",p.github);


        $('#screen').attr("src", "img/" + p.image);
            image.animateCss('bounceInLeft');


    });

};



module.exports = ProjectsObject;