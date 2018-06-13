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
                title: "Pennywise",
                desc: "Java Spring Framework, JQuery, Node",
                github: "https://github.com/unfaiyted/pennywise",
                image: "finance-dark.jpg",
                imageScreen: "pennywise.jpg"
            },
            {
                title: "XIV Gear Manager",
                desc: "Java Spring Framework JQuery, Node, Selenium Web Driver, External Apis",
                github: "https://github.com/unfaiyted/xiv-gear-planner",
                image: "ffxiv.jpg",
                imageScreen: "xiv-gear-planner.jpg"
            },
            {
                title: "Eggs Benedict",
                desc: "Java Spring Framework, JQuery",
                github: "https://github.com/unfaiyted/eggs-benedict",
                image: "fitness.jpg",
                imageScreen: "eggs-benedict.png"
            },
            {
                title: "miniMovieDB",
                desc: "Node JSON Server, Movie DB Api",
                github: "https://github.com/unfaiyted/movies-application",
                image: "movies.jpg",
                imageScreen: "mini-movies.png"
            },

        ];
    }

    this.headerNav = '#header-nav';
    this.backBtn = '.projects-back';
    this.forwardBtn = '.projects-forward';


    this.currentProject = 0;
    this.maxProjects = 3;

    this.init();
    self.change("forward");

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


    this.renderProject(direction);

};


ProjectsObject.prototype.renderProject = function (direction) {

    let p = this.projects[this.currentProject];

    $('#work-bg').css("background-color","#000");

    let inDirection = (direction === "forward") ? 'bounceInLeft' : 'bounceInRight';
    let outDirection = (direction === "forward") ? 'bounceOutRight' : 'bounceOutLeft';

    $('#work').animateCss(outDirection, function() {

        let image = $('#work');
            image.css("background", "url('img/" + p.image + "')");
            image.css("background-size", "cover");

        $('.proj-name').text(p.title);
        $('.proj-desc').text(p.desc);
        $('.proj-link').attr("href",p.github);


        $('#screen').attr("src", "img/" + p.imageScreen);
            image.animateCss(inDirection);
    });

};



module.exports = ProjectsObject;