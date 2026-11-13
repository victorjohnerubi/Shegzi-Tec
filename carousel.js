const carouselImages = [
    'pics/1.jpg',
    'pics/2.jpg',
    'pics/3.jpg',
    'pics/4.jpg',
    'pics/5.jpg',
    'pics/6.jpg',
    'pics/7.jpg',
    'pics/8.jpg',
    'pics/9.jpg',
    'pics/10.jpg',
    'pics/11.jpg',
    'pics/12.jpg'
];

const carouselSlides = [
    {
        eyebrow: 'SMART DESIGN • PRECISION PRINTING • TECH-DRIVEN RESULTS',
        heading: 'Where Bold Ideas Meet High-Precision Print.',
        description: 'From custom brand identities and sleek digital graphics to crisp, high-impact print materials, Shegzi-Tech brings your vision to life under one roof.',
        action: 'Request a Free Quote',
        href: 'contact.html',
        secondary: 'Explore Our Services',
        secondaryHref: 'about.html'
    },
    {
        eyebrow: 'DESIGN + PRINT, WORKING TOGETHER',
        heading: 'Smart Tech. Stunning Design. Flawless Print.',
        description: 'We bridge the gap between screen and paper to deliver standout branding and print solutions for modern businesses.',
        action: 'Start Your Project',
        href: 'contact.html',
        secondary: 'Explore Our Services',
        secondaryHref: 'about.html'
    },
    {
        eyebrow: 'LARGE-FORMAT & EVENT BRANDING',
        heading: 'Make a Statement That Cannot Be Ignored.',
        description: 'High-resolution banners, signage, posters and custom event branding designed to put your business in the spotlight.',
        action: 'View Our Services',
        href: 'about.html#signage',
        secondary: 'Get a Custom Quote',
        secondaryHref: 'contact.html'
    },
];

const carousel = document.querySelector('.hero-section');

if (carousel) {
    const image = carousel.querySelector('.carousel-image');
    const indicators = carousel.querySelector('.carousel-indicators');
    const previousButton = carousel.querySelector('.carousel-previous');
    const nextButton = carousel.querySelector('.carousel-next');
    const eyebrow = carousel.querySelector('.hero-welcome');
    const heading = carousel.querySelector('.hero-content h1');
    const description = carousel.querySelector('.hero-content p');
    const primaryAction = carousel.querySelector('.hero-buttons .btn-primary');
    const secondaryAction = carousel.querySelector('.hero-buttons .btn-secondary');
    let activeIndex = 0;
    let autoplay;
    let imageTransition;

    const indicatorButtons = carouselImages.map((_, index) => {
        const button = document.createElement('button');
        button.className = 'carousel-indicator';
        button.type = 'button';
        button.setAttribute('aria-label', `Show image ${index + 1} of ${carouselImages.length}`);
        button.addEventListener('click', () => showImage(index));
        indicators.append(button);
        return button;
    });

    function showImage(index) {
        window.clearTimeout(imageTransition);
        activeIndex = (index + carouselImages.length) % carouselImages.length;
        const slide = carouselSlides[activeIndex % carouselSlides.length];
        image.classList.remove('is-zooming');
        image.style.opacity = '0';

        imageTransition = window.setTimeout(() => {
            image.src = carouselImages[activeIndex];
            image.alt = `Shegzi-Tech design and printing work, image ${activeIndex + 1}`;
            image.classList.add('is-zooming');
            image.style.opacity = '1';
        }, 200);

        eyebrow.textContent = slide.eyebrow;
        heading.textContent = slide.heading;
        description.textContent = slide.description;
        primaryAction.textContent = slide.action;
        primaryAction.href = slide.href;
        secondaryAction.textContent = slide.secondary;
        secondaryAction.href = slide.secondaryHref;

        indicatorButtons.forEach((button, buttonIndex) => {
            const isActive = buttonIndex === activeIndex;
            button.classList.toggle('is-active', isActive);
            if (isActive) {
                button.setAttribute('aria-current', 'true');
            } else {
                button.removeAttribute('aria-current');
            }
        });
    }

    function restartAutoplay() {
        window.clearInterval(autoplay);
        autoplay = window.setInterval(() => showImage(activeIndex + 1), 5000);
    }

    previousButton.addEventListener('click', () => {
        showImage(activeIndex - 1);
        restartAutoplay();
    });

    nextButton.addEventListener('click', () => {
        showImage(activeIndex + 1);
        restartAutoplay();
    });

    carousel.addEventListener('mouseenter', () => window.clearInterval(autoplay));
    carousel.addEventListener('mouseleave', restartAutoplay);
    carousel.addEventListener('focusin', () => window.clearInterval(autoplay));
    carousel.addEventListener('focusout', event => {
        if (!carousel.contains(event.relatedTarget)) {
            restartAutoplay();
        }
    });

    showImage(activeIndex);
    restartAutoplay();
}
