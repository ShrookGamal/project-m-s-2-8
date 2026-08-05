window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.style.transition = 'opacity 0.8s cubic-bezier(0.7, 0, 0.3, 1)';
            splash.style.opacity = '0';
            setTimeout(() => splash.style.visibility = 'hidden', 800);
        }, 2000);
    }
});

const menuToggle = document.querySelector('.menu-toggle');
const sideMenu = document.querySelector('.side-menu');
const closeMenu = document.querySelector('.close-menu');
const navItems = document.querySelectorAll('.nav-item, .side-item');
const sections = document.querySelectorAll('section');

if (menuToggle && sideMenu) {
    menuToggle.addEventListener('click', () => sideMenu.classList.add('active'));
}

if (closeMenu && sideMenu) {
    closeMenu.addEventListener('click', () => sideMenu.classList.remove('active'));
}

document.addEventListener('click', (e) => {
    if (sideMenu && !sideMenu.contains(e.target) && menuToggle && !menuToggle.contains(e.target)) {
        sideMenu.classList.remove('active');
    }
});

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPos >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(current)) {
            item.classList.add('active');
        }
    });

    const glassNav = document.querySelector('.glass-nav');
    if (glassNav) {
        if (scrollPos > 100) {
            glassNav.style.padding = '8px 20px';
            glassNav.style.background = 'rgba(255, 255, 255, 0.9)';
            glassNav.style.maxWidth = '1100px';
        } else {
            glassNav.style.padding = '10px 25px';
            glassNav.style.background = 'rgba(255, 255, 255, 0.4)';
            glassNav.style.maxWidth = '1200px';
        }
    }

    const serviceCards = document.querySelectorAll('.s-card');
    serviceCards.forEach(card => {
        const img = card.querySelector('.image-container img');
        if (img) {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const speed = 0.05;
                const yPos = (window.innerHeight - rect.top) * speed;
                img.style.transform = `scale(1.1) translateY(${-yPos}px)`;
            }
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (sideMenu) sideMenu.classList.remove('active');
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 40;
    const y = (window.innerHeight / 2 - e.pageY) / 40;
    const shapes = document.querySelectorAll('.geo-shape');
    
    shapes.forEach((shape, index) => {
        const factor = (index + 1) * 0.6;
        shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
});

const mainObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            if (entry.target.classList.contains('stat-card')) {
                const circle = entry.target.querySelector('.progress-circle');
                const numDisplay = entry.target.querySelector('.stat-num');
                const statCircle = entry.target.querySelector('.stat-circle');
                
                if (circle && numDisplay && statCircle) {
                    const percent = statCircle.getAttribute('data-percent');
                    const circumference = 2 * Math.PI * 54;
                    const offset = circumference - (percent / 100) * circumference;
                    circle.style.strokeDashoffset = offset;

                    let count = 0;
                    const duration = 2000;
                    const increment = percent / (duration / 16);
                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= percent) {
                            numDisplay.innerText = percent + '%';
                            clearInterval(timer);
                        } else {
                            numDisplay.innerText = Math.floor(count) + '%';
                        }
                    }, 16);
                }
            }
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll, .stat-card, .s-card').forEach(el => {
    mainObserver.observe(el);
});

document.querySelectorAll('.s-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.service-icon');
        if (icon) {
            icon.style.transform = 'rotateY(360deg) scale(1.1)';
            icon.style.transition = '0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.service-icon');
        if (icon) {
            icon.style.transform = 'rotateY(0) scale(1)';
        }
    });
});
const initServicesCore = () => {
    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    const cards = document.querySelectorAll('.s-card');
    cards.forEach(card => serviceObserver.observe(card));

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const visual = card.querySelector('.premium-frame');
            if (!visual) return;
            
            const rect = visual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            visual.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            const visual = card.querySelector('.premium-frame');
            if (visual) visual.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.image-container img').forEach(img => {
            const speed = 0.05;
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (window.innerHeight - rect.top) * speed;
                img.style.transform = `scale(1.2) translateY(${yPos}px)`;
            }
        });
    });
};

initServicesCore();
const initServiceInteractions = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    document.querySelectorAll('.service-block').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const inner = card.querySelector('.block-inner');
            inner.style.transform = `translateY(-20px) rotateX(${y * 8}deg) rotateY(${x * 8}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            const inner = card.querySelector('.block-inner');
            inner.style.transform = `translateY(0) rotateX(0) rotateY(0)`;
        });
    });
};

initServiceInteractions();
const initPortfolioAnimation = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.portfolio-item').forEach(el => observer.observe(el));
};

initPortfolioAnimation();
const initElegantObserver = () => {
    const options = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, options);

    document.querySelectorAll('.elegant-card, .why-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });
};
initElegantObserver();
const initFinalFeatures = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.contact-card, .footer-col').forEach(el => observer.observe(el));
};

initFinalFeatures();
const initFinalContact = () => {
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const contactElements = document.querySelectorAll('.contact-card, .footer-col');
    contactElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        contactObserver.observe(el);
    });
};

initFinalContact();