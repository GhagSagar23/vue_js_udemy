const counterElement = document.getElementById("percentageCounter");
let count = 0;
const target = 100;
const duration = 2000; // in milliseconds
const intervalTime = 20; // in milliseconds

const increment = target / (duration / intervalTime);

const timer = setInterval(() => {
  count += increment;
  if (count >= target) {
    count = target;
    clearInterval(timer);
  }
  counterElement.textContent = `${Math.floor(count)}%`;

  // ring in SVG mask
  const ring = document.getElementById("progressRing");

  ring?.setAttribute("stroke-dashoffset", target - count);
}, intervalTime);
