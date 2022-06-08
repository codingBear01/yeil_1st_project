let video = document.getElementById("myVideo");
let btn = document.getElementById("myBtn");

export default function myFunction() {
  if (video.paused) {
    video.play();
    btn.innerHTML = "Pause";
  } else {
    video.pause();
    btn.innerHTML = "Play";
  }
}

btn.addEventListener("click", myFunction);
