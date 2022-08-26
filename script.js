'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const h1 = document.querySelector('h1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());

  //SCROLLING 
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // })


  section1.scrollIntoView({behavior: 'smooth'});
});

//TABBED COMPONENT

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')))

tabsContainer.addEventListener('click', function (e) {
  // e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  //GUARD CLAUSE
  if (!clicked) return;

  //REMOVE ACTIVE CLASSES
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //ACTIVATE TAB
  clicked.classList.add('operations__tab--active');

  //ACTIVE THE CONTENT AREA
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//PAGE NAVIGATION

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   });
// });

document.querySelector('.nav__link').addEventListener('click', function (e) {
  e.preventDefault();
  //MATCH STRATEGY
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    });
  }
});


//MENU FADE ANIM

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//PASSING 'ARGUMENT' INTO HANDLER
const nav = document.querySelector('.nav');

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));


//STICKY NAVIGATION
// const initialCoords = section1.getBoundingClientRect()
// window.addEventListener('scroll', function(e) {
//   if (this.window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky')
//    } else {
//     nav.classList.remove('sticky')
//    }
// });



//STICKY NAVIGATION: INTERSECTION OBSERVER API
// const stickyNav = document.querySelector('.sticty');

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
     
//   })
// }

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1)

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);

//REVEAL SECTIONS
const allSections = document.querySelectorAll('section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver (revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach (function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});


//LAZY LOADING IMAGES

const imgTargets = document.querySelectorAll('img[data-src]');

const loading =  function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));


//SLIDER

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

// slider.style.transform = 'scale(0.3)';
// slider.style.overflow = 'visible';


const createDots = function () {
  slides.forEach(function(_, i) {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
  });
};

createDots();

const activatDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

activatDot(0);

const goToSlide = function () {
slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - curSlide)}%)`);
};

goToSlide(0);

//NEXT SLIDE

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0
  } else {
    curSlide++
  }

  goToSlide(curSlide);
  activatDot(curSlide)
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
  activatDot(curSlide)
}

//GOTO THE RIGHT SIDE
btnRight.addEventListener('click', nextSlide);

//GOTO THE LEFT SIDE
btnLeft.addEventListener('click', prevSlide);


document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});



dotContainer.addEventListener('click', function (e) {

  if (e.target.classList.contains('dots__dot')) {
    const slideNumber = e.target.dataset.slide;
    goToSlide(slideNumber);
    activatDot(slideNumber)
  }
});



////////////////////////////////////////////

// const anagram1 = function (s, t) {
//   if (s.length !== t.length) {
//     return false;
//   		}

// 	let sMap = {};
// 	let tMap = {};

// for (let i = 0; i < s.length; i++) {
//   if (sMap.hasOwnProperty(s1[i])) {
//     sMap[s[i]]++;
//   }
//     else {
//       sMap[s[i]] = 1;
//     }
  
//   if (tMap.hasOwnProperty(t[i])) {
//     tMap[t[i]]++;
//   }
//     else {
//       tMap[t[i]] = 1;
//     	}
// 	};
    
// for (let k in sMap) {
//   if (sMap[k] === tMap[k]) {
//       return true;
//   }
//       else {
//       return false;
//       }
//   };
// };

//     anagram1('anagram', 'nagaram');

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// //CREATING AND INSERTING ELEMENTS

// const message = document.createElement('div');
// console.log(message);
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for functionality and analytics';
// message.innerHTML = 'We use cookies for functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>'

// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));

// document.querySelector('.btn--close--cookie').addEventListener('click', function() {
//   message.remove();
// });


// const message2 = document.createElement('div');
// message2.classList.add('new-cookie-message');

// message2.innerHTML = 'This is another cookie message <button class="btn btn--close-cookie">Yeah!</button>';

// header.prepend(message2);

// document.querySelector('.btn--close-cookie').addEventListener('click', function () {
//   message2.remove();
// });

// //STYLES
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// // console.log(getComputedStyle(message))


// console.table(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height = Number.parseFloat(getComputedStyle(message).height) + 30 +'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //ATTRIBUTES
// // const logo1 = document.querySelector('.nav__log');
// // // console.log(logo.alt);
// // // console.log(logo.src);

// // //NON-STANDARD
// // console.log(logo1.getAttribute('designer'));
// // logo1.setAttribute('company', 'Bankist');

// const link = document.querySelector('.twitter-link');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //DATA ATTRIBUTES
// console.log(logo.dataset.versionNumber);

// const h1 = document.querySelector('h1');
// h1.addEventListener('mousedown', function(e) {
//   alert('addEventListener: Great! I am getting things.')
// });

// h1.onmouseenter = function(e) {
//   alert('addEventListener: Great! I am getting things.')
// };

// //rgb(255,255,255)
// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// console.log(randomColor(0, 255));

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });