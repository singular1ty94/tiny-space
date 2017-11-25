export function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}  

export function nebula(canvas, canvas2, canvas3, halfWidth, halfHeight) {
    //////////////////////////////////////////////////////////////////////////////////
    // A demonstration of a Canvas nebula effect
    // (c) 2010 by R Cecco. <http://www.professorcloud.com>
    // MIT License
    //
    // Please retain this copyright header in all versions of the software if
    // using significant parts of it
    //////////////////////////////////////////////////////////////////////////////////
    // The canvas element we are drawing into.      
    var ctx2 = canvas2.getContext('2d');
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var img = new Image();

    var id;

    // A puff.
    var Puff = function (p) {
        var opacity,
            sy = (Math.random() * halfHeight) >> 0,
            sx = (Math.random() * halfWidth) >> 0;

        this.p = p;

        this.move = function (timeFac) {
            p = this.p + 0.3 * timeFac;
            opacity = (Math.sin(p * 0.05) * 0.5);
            if (opacity < 0) {
                p = opacity = 0;
                sy = (Math.random() * halfHeight) >> 0;
                sx = (Math.random() * halfWidth) >> 0;
            }
            this.p = p;
            ctx.globalAlpha = opacity;
            ctx.drawImage(canvas3, sy + p, sy + p, halfWidth - (p * 2), halfHeight - (p * 2), 0, 0, w, h);
        };
    };

    var puffs = [];
    var sortPuff = function (p1, p2) { return p1.p - p2.p; };
    puffs.push(new Puff(0));
    puffs.push(new Puff(20));
    puffs.push(new Puff(40));

    var newTime, oldTime = 0, timeFac;

    var loop = function () {
        newTime = new Date().getTime();
        if (oldTime === 0) {
            oldTime = newTime;
        }
        timeFac = (newTime - oldTime) * 0.1;
        if (timeFac > 3) { timeFac = 3; }
        oldTime = newTime;
        puffs.sort(sortPuff);

        for (var i = 0; i < puffs.length; i++) {
            puffs[i].move(timeFac);
        }
        ctx2.drawImage(canvas, 0, 0, window.innerWidth, window.innerHeight);
        id = setTimeout(loop, 10);
    };
    // Turns out Chrome is much faster doing bitmap work if the bitmap is in an existing canvas rather
    // than an IMG, VIDEO etc. So draw the big nebula image into canvas3
    var ctx3 = canvas3.getContext('2d');
    img.onload = function() {
        ctx3.drawImage(img, 0, 0, window.innerWidth, window.innerHeight); loop();
    }
    img.src = 'dist/resources/nebula/nebula.jpg';
    return id;
}

export function drawStars(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    let stars = 500;
    let colorrange = [0,60,240];
    for (var i = 0; i < stars; i++) {

        var x = Math.random() * ctx.canvas.offsetWidth;
        var y = Math.random() * ctx.canvas.offsetHeight,
        radius = Math.random() * 1.2,
        hue = colorrange[getRandom(0,colorrange.length - 1)],
        sat = getRandom(50,100);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 360);
        ctx.fillStyle = "hsl(" + hue + ", " + sat + "%, 88%)";
        ctx.fill();
    }
}