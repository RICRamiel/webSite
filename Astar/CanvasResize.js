window.addEventListener("resize", function() {
    let canvas = document.getElementById("canvas");

    canvas.width = Math.min(window.innerHeight - 300, window.innerWidth * (2 / 3));
    canvas.height = canvas.width;

    createCanvas();
});

document.getElementById("canvas").height = Math.min(window.innerHeight - 300, window.innerWidth * (2 / 3));
document.getElementById("canvas").width = document.getElementById("canvas").height;