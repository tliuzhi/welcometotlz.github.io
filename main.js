// ----------- Rotating Text -------------
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

// ----------- Clock Display -------------
function getTime() {
  const date = new Date();
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function updateTime() {
  const time = getTime();
  const timeEl = document.getElementById("time");
  if (timeEl) {
    timeEl.innerText = `The current time is ${time}`;
  }
  
  // Update top-right time display
  updateTopRightTime();
}

function updateTopRightTime() {
  const now = new Date();
  const timeLineEl = document.getElementById("current-time-line");
  
  if (timeLineEl) {
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
    
    // Put everything in a single line
    timeLineEl.innerText = `${timeString} • ${dateString}`;
  }
}

// ----------- Theme Logic -------------
function setThemeByTime() {
  const hour = new Date().getHours();
  const body = document.body;

  // Clear previous classes
  body.classList.remove("day", "night");

  if (hour >= 6 && hour < 18) {
    body.classList.add("day");
    removeNightElements();
    createFloatingParticles(true);
  } else {
    body.classList.add("night");
    showMoonAndStars();
    createFloatingParticles(false);
  }
}

// ----------- Moon + Stars -------------
function showMoonAndStars() {
  // Moon
  if (!document.querySelector(".moon")) {
    const moon = document.createElement("div");
    moon.classList.add("moon");
    document.body.appendChild(moon);
  }

  // Stars
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

function removeNightElements() {
  const moon = document.querySelector(".moon");
  if (moon) moon.remove();

  const stars = document.querySelectorAll(".star");
  stars.forEach(star => star.remove());
  
  const particles = document.querySelectorAll(".particle");
  particles.forEach(particle => particle.remove());
}

// ----------- Floating Particles -------------
function createFloatingParticles(isDay = true) {
  // Remove existing particles first
  const existingParticles = document.querySelectorAll(".particle");
  existingParticles.forEach(particle => particle.remove());
  
  const particleCount = isDay ? 15 : 25;
  const particleClass = isDay ? "particle-day" : "particle-night";
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle", particleClass);
    
    // Random starting position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${100 + Math.random() * 20}%`; // Start below viewport
    
    // Random animation delay and duration
    const delay = Math.random() * 5;
    const duration = 6 + Math.random() * 4;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, (delay + duration) * 1000);
  }
  
  // Continuously create new particles
  setTimeout(() => {
    const hour = new Date().getHours();
    const shouldShowDay = hour >= 6 && hour < 18;
    if (shouldShowDay === isDay) {
      createFloatingParticles(isDay);
    }
  }, 2000 + Math.random() * 3000);
}

// ----------- Loading Screen Management -------------
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
}

// ----------- On Page Load -------------
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

  // Inject CSS for caret
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);

  // Setup time
  updateTime();
  setInterval(updateTime, 1000);

  // Setup theme
  setThemeByTime();
  setInterval(setThemeByTime, 10 * 60 * 1000); // Update every 10 mins
  
  // Add click interaction to time display
  const timeElement = document.getElementById('time');
  if (timeElement) {
    timeElement.addEventListener('click', function() {
      // Create sparkle effect
      createSparkleEffect(this);
      
      // Briefly show different time format
      const originalText = this.innerText;
      const date = new Date();
      this.innerText = `${date.toLocaleDateString()} • ${date.toLocaleTimeString()}`;
      this.style.transform = 'scale(1.05)';
      
      setTimeout(() => {
        this.innerText = originalText;
        this.style.transform = 'scale(1)';
      }, 2000);
    });
  }
  
  // Hide loading screen after everything is initialized
  setTimeout(() => {
    hideLoadingScreen();
  }, 2000); // Show hamster for 2 seconds minimum
  
  // Setup navigation
  setupNavigation();
};

// ----------- Navigation Management -------------
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
      
      // Update active nav link
      navLinks.forEach(nl => nl.classList.remove('active'));
      link.classList.add('active');
    });
  });
  
  // Set home link as active by default
  const homeLink = document.querySelector('.nav-link[href="#home"]');
  if (homeLink) {
    homeLink.classList.add('active');
  }
  
  // Update active nav link on scroll
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.page-section');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    });
  });
  
  // Mobile menu toggle - disabled for always-visible nav
  // const toggle = document.querySelector('.navbar-toggle');
  // const menu = document.querySelector('.navbar-menu');
  
  // Navigation is always visible on mobile, no toggle needed
}

// ----------- Sparkle Effect -------------
function createSparkleEffect(element) {
  const rect = element.getBoundingClientRect();
  const sparkleCount = 8;
  
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${rect.left + rect.width / 2}px`;
    sparkle.style.top = `${rect.top + rect.height / 2}px`;
    sparkle.style.width = '4px';
    sparkle.style.height = '4px';
    sparkle.style.background = '#ffd700';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '1000';
    sparkle.style.boxShadow = '0 0 6px #ffd700';
    
    const angle = (i / sparkleCount) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;
    
    sparkle.style.transition = 'all 0.6s ease-out';
    document.body.appendChild(sparkle);
    
    // Animate sparkle
    setTimeout(() => {
      sparkle.style.transform = `translate(${targetX}px, ${targetY}px)`;
      sparkle.style.opacity = '0';
    }, 10);
    
    // Remove sparkle
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.remove();
      }
    }, 600);
  }
}
