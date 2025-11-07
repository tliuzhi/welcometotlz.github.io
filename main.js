// Rotating Text Effect
var TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

// Time Display
function updateTime() {
  const now = new Date();
  const timeEl = document.getElementById("current-time");
  
  if (timeEl) {
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const dateString = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    timeEl.innerText = `${timeString} • ${dateString}`;
  }
}

// Theme Management
function setThemeByTime() {
  const hour = new Date().getHours();
  const body = document.body;

  body.classList.remove("day", "night");

  if (hour >= 6 && hour < 18) {
    body.classList.add("day");
    removeNightElements();
    showSun();
    createClouds();
    createFloatingParticles(true);
  } else {
    body.classList.add("night");
    removeDayElements();
    showMoonAndStars();
    createFloatingParticles(false);
  }
}

// Celestial Elements
function showMoonAndStars() {
  if (!document.querySelector(".moon")) {
    const moon = document.createElement("div");
    moon.classList.add("moon");
    document.body.appendChild(moon);
  }

  if (document.querySelectorAll(".star").length === 0) {
    for (let i = 0; i < 30; i++) {
      const star = document.createElement("div");
      star.classList.add("star");
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      document.body.appendChild(star);
    }
  }
}

function showSun() {
  if (!document.querySelector(".sun")) {
    const sun = document.createElement("div");
    sun.classList.add("sun");
    document.body.appendChild(sun);
  }
}

function createClouds() {
  const existingClouds = document.querySelectorAll(".cloud");
  existingClouds.forEach(cloud => cloud.remove());
  
  const cloudTypes = ['small', 'medium', 'large'];
  const cloudCount = 5;
  
  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud", `cloud-${cloudTypes[Math.floor(Math.random() * cloudTypes.length)]}`);
    
    const topPosition = Math.random() * 40 + 10;
    cloud.style.top = `${topPosition}%`;
    
    const delay = Math.random() * 20;
    cloud.style.animationDelay = `${delay}s`;
    
    const duration = 15 + Math.random() * 25;
    cloud.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(cloud);
  }
  
  // Create new clouds periodically
  setInterval(() => {
    if (document.body.classList.contains('day') && document.querySelectorAll(".cloud").length < 8) {
      const cloud = document.createElement("div");
      cloud.classList.add("cloud", `cloud-${cloudTypes[Math.floor(Math.random() * cloudTypes.length)]}`);
      
      const topPosition = Math.random() * 40 + 10;
      cloud.style.top = `${topPosition}%`;
      
      const duration = 15 + Math.random() * 25;
      cloud.style.animationDuration = `${duration}s`;
      
      document.body.appendChild(cloud);
      
      setTimeout(() => {
        if (cloud.parentNode) {
          cloud.remove();
        }
      }, duration * 1000);
    }
  }, 8000);
}

function removeDayElements() {
  const sun = document.querySelector(".sun");
  if (sun) sun.remove();
  
  const clouds = document.querySelectorAll(".cloud");
  clouds.forEach(cloud => cloud.remove());
}

function removeNightElements() {
  const moon = document.querySelector(".moon");
  if (moon) moon.remove();

  const stars = document.querySelectorAll(".star");
  stars.forEach(star => star.remove());
  
  const particles = document.querySelectorAll(".particle");
  particles.forEach(particle => particle.remove());
}

function createFloatingParticles(isDay = true) {
  const existingParticles = document.querySelectorAll(".particle");
  existingParticles.forEach(particle => particle.remove());
  
  const particleCount = isDay ? 15 : 25;
  const particleClass = isDay ? "particle-day" : "particle-night";
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle", particleClass);
    
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${100 + Math.random() * 20}%`;
    
    const delay = Math.random() * 5;
    const duration = 6 + Math.random() * 4;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, (delay + duration) * 1000);
  }
  
  setTimeout(() => {
    const hour = new Date().getHours();
    const shouldShowDay = hour >= 6 && hour < 18;
    if (shouldShowDay === isDay) {
      createFloatingParticles(isDay);
    }
  }, 2000 + Math.random() * 3000);
}

// Loading Screen
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
}



// Initialization
window.onload = function () {
  // Setup rotating text
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }

  // Inject CSS for text cursor
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);

  // Setup time updates
  updateTime();
  setInterval(updateTime, 1000);

  // Setup theme
  setThemeByTime();
  setInterval(setThemeByTime, 10 * 60 * 1000); // Update every 10 minutes
  
  // Hide loading screen
  setTimeout(() => {
    hideLoadingScreen();
  }, 2000);
};