// Page Fade In
window.addEventListener("load", () => {
	document.body.classList.add("loaded");
});

// Loading
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.style.opacity = '0';
  loader.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    loader.style.display = 'none';
  }, 500);
});

// Navbar Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
	window.scrollY > 50 ? navbar.classList.add('scrolled') : navbar.classList.remove('scrolled');
});

// Navbar
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
	if (window.scrollY > 50) {
		nav.classList.add('scrolled');
	} else {
		nav.classList.remove('scrolled');
	}
});

// Scroll Reveal
const features = document.querySelectorAll('.feature-card');
const reveal = () => {
	features.forEach(f => {
		const top = f.getBoundingClientRect().top;
		if (top < window.innerHeight - 100) {
			f.classList.add('show');
		}
	});
};
window.addEventListener('scroll', reveal);
reveal();

// Lightbox
const galleryImages = document.querySelectorAll('.gallery-grid img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
galleryImages.forEach(img => {
	img.addEventListener('click', () => {
		lightbox.style.display = 'flex';
		lightboxImg.src = img.src;
	});
});

// Contact Form
const form = document.getElementById("contactForm");

form.addEventListener("submit", function(e) {
	e.preventDefault();

	const name = form.name.value;
	const email = form.email.value;
	const message = form.message.value;

	const subject = encodeURIComponent(`New message from ${name}`);
	const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

	// Ανοίγει ο email client
	window.location.href = `mailto:aggelikialafouzou@gmail.com?subject=${subject}&body=${body}`;

	// Optional: success message
	const successMsg = document.getElementById("success");
	successMsg.style.display = 'block';
	form.reset();
	setTimeout(() => {
		successMsg.style.display = 'none';
	}, 4000);
});


//const form=document.getElementById('contactForm');
//const successMsg=document.getElementById('success');
//form.addEventListener('submit',e=>{
//  e.preventDefault();
//  successMsg.style.display='block';
//  form.reset();
//  setTimeout(()=>{successMsg.style.display='none';},4000);
//});

// Burger menu
const burger = document.querySelector(".burger");
const navLinks = document.querySelector(".nav-links");

// Toggle menu burger
burger.addEventListener("click", () => {
	navLinks.classList.toggle("active");
	burger.classList.toggle("active");
});

// Close burger menu after click
navLinks.querySelectorAll("a, button").forEach(link => {
	link.addEventListener("click", () => {
		navLinks.classList.remove("active");
		burger.classList.remove("active");
	});
});


// Reveal
const reveals = document.querySelectorAll(".reveal");

function revealSections() {
	reveals.forEach(section => {
		const windowHeight = window.innerHeight;
		const elementTop = section.getBoundingClientRect().top;

		if (elementTop < windowHeight - 100) {
			section.classList.add("active");
		}
	});
}

window.addEventListener("scroll", revealSections);
revealSections();


// Slider
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let index = 0;
const total = slides.length;
const visibleSlides = 3;

function updateSlider() {
	const slideWidth = slides[0].offsetWidth + 20; // include gap
	slider.style.transform = `translateX(-${index * slideWidth}px)`;
}

// Next slide
nextBtn.addEventListener("click", () => {
	index++;
	if (index > total - visibleSlides) index = 0;
	updateSlider();
});

// Prev Slide
prevBtn.addEventListener("click", () => {
	index--;
	if (index < 0) index = total - visibleSlides;
	updateSlider();
});

// Optional: Auto slide every 5s
setInterval(() => {
	index++;
	if (index > total - visibleSlides) index = 0;
	updateSlider();
}, 5000);

// Initial
updateSlider();

// Responsive: adjust slideWidth on resize
window.addEventListener("resize", updateSlider);

let startX = 0;
let currentX = 0;
let isDragging = false;

slider.addEventListener("touchstart", (e) => {
	startX = e.touches[0].clientX;
	isDragging = true;
});

slider.addEventListener("touchmove", (e) => {
	if (!isDragging) return;
	currentX = e.touches[0].clientX;
});

slider.addEventListener("touchend", () => {
	if (!isDragging) return;
	const diff = startX - currentX;

	// Swipe threshold
	if (diff > 50) {
		// Swipe left → next
		index++;
		if (index > total - visibleSlides) index = 0;
	} else if (diff < -50) {
		// Swipe right → prev
		index--;
		if (index < 0) index = total - visibleSlides;
	}

	updateSlider();
	isDragging = false;
	startX = 0;
	currentX = 0;
});

const logoSlider = document.querySelector(".logo-slider");

let startXLogo = 0;
let currentXLogo = 0;
let isDraggingLogo = false;

logoSlider.addEventListener("touchstart", (e) => {
	startXLogo = e.touches[0].clientX;
	isDraggingLogo = true;
});

logoSlider.addEventListener("touchmove", (e) => {
	if (!isDraggingLogo) return;
	currentXLogo = e.touches[0].clientX;
});

logoSlider.addEventListener("touchend", () => {
	if (!isDraggingLogo) return;
	const diff = startXLogo - currentXLogo;

	const slideWidth = document.querySelector(".logo-box").offsetWidth + 20; // include gap
	let sliderTransform = getComputedStyle(logoSlider).transform.match(/matrix.*\((.+)\)/);
	let currentTranslate = sliderTransform ? parseFloat(sliderTransform[1].split(', ')[4]) : 0;

	if (diff > 30) {
		// swipe left
		logoSlider.style.transform = `translateX(${currentTranslate - slideWidth}px)`;
	} else if (diff < -30) {
		// swipe right
		logoSlider.style.transform = `translateX(${currentTranslate + slideWidth}px)`;
	}

	isDraggingLogo = false;
	startXLogo = 0;
	currentXLogo = 0;
});

const circles = document.querySelectorAll(".circle");

circles.forEach(circle => {
	const percent = circle.dataset.percent;
	const radius = circle.offsetWidth / 2;
	const circumference = 2 * Math.PI * radius;

	// Create SVG inside circle
	const svgNS = "http://www.w3.org/2000/svg";
	const svg = document.createElementNS(svgNS, "svg");
	svg.setAttribute("width", "100%");
	svg.setAttribute("height", "100%");
	svg.setAttribute("viewBox", `0 0 ${circle.offsetWidth} ${circle.offsetHeight}`);

	const circleBg = document.createElementNS(svgNS, "circle");
	circleBg.setAttribute("cx", radius);
	circleBg.setAttribute("cy", radius);
	circleBg.setAttribute("r", radius - 5);
	circleBg.setAttribute("stroke", "#eee");
	circleBg.setAttribute("stroke-width", 5);
	circleBg.setAttribute("fill", "none");

	const circleFg = document.createElementNS(svgNS, "circle");
	circleFg.setAttribute("cx", radius);
	circleFg.setAttribute("cy", radius);
	circleFg.setAttribute("r", radius - 5);
	circleFg.setAttribute("stroke", "#c6ac73");
	circleFg.setAttribute("stroke-width", 5);
	circleFg.setAttribute("fill", "none");
	circleFg.setAttribute("stroke-dasharray", 2 * Math.PI * (radius - 5));
	circleFg.setAttribute("stroke-dashoffset", 2 * Math.PI * (radius - 5));
	circleFg.setAttribute("transform", `rotate(-90 ${radius} ${radius})`);
	circleFg.style.transition = "stroke-dashoffset 1s ease";

	svg.appendChild(circleBg);
	svg.appendChild(circleFg);
	circle.appendChild(svg);

	// Animate
	setTimeout(() => {
		circleFg.style.strokeDashoffset = 2 * Math.PI * (radius - 5) * (1 - percent / 100);
	}, 1500);
});

document.addEventListener('DOMContentLoaded', () => {
  const sliderContainer = document.querySelector('.reviews-section');
  const slider = sliderContainer.querySelector('.reviews-slider');
  const slides = slider.querySelectorAll('.review-slide');
  const dotsContainer = sliderContainer.querySelector('.reviews-dots');
  let currentIndex = 0;
  const createdDots = []; // κρατάμε τα dots σε array

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = "button";
    if (i === 0) dot.classList.add('review-dot-active');
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSlide(i);
    });
    dotsContainer.appendChild(dot);
    createdDots.push(dot); // προσθήκη στο array
  });

  function scrollToSlide(index) {
    // scroll μόνο μέσα στο slider, όχι η σελίδα
    slider.scrollTo({
      left: slides[index].offsetLeft - slider.offsetLeft,
      behavior: 'smooth'
    });
    updateDots(index);
  }

  function updateDots(index) {
    createdDots.forEach(dot => dot.classList.remove('review-dot-active'));
    if (createdDots[index]) {
      createdDots[index].classList.add('review-dot-active');
    }
    currentIndex = index;
  }

  // Update dots on manual scroll
  slider.addEventListener('scroll', () => {
    const index = Math.round(slider.scrollLeft / slides[0].offsetWidth);
    updateDots(index);
  });
});

const btn = document.getElementById('see-more-btn');
  const hiddenItems = document.querySelectorAll('.gallery-grid .gallery-item:nth-child(n+4)');

  btn.addEventListener('click', () => {
    hiddenItems.forEach(item => item.style.display = 'block');
    btn.style.display = 'none'; // κρύβουμε το κουμπί μετά
  });