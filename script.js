// ========================================
// MODERN PORTFOLIO JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function() {

  // ========================================
  // TERMINAL TYPING ANIMATION
  // ========================================
  const terminalText = document.getElementById('terminal-text');

  const codeSnippets = [
    'import torch\nfrom transformers import AutoModel',
    'def match_resume(resume, job_desc):\n    return similarity_score',
    'class KnowledgeSelector:\n    def adaptive_select(self, context):',
    'spark.read.parquet("data/") \\\n    .transform(pipeline)',
    'SELECT * FROM candidates \nWHERE skills @> ARRAY["Python", "LLMs"]',
    'docker-compose up -d\n# Deploying AI services...',
    'git commit -m "feat: add NLP pipeline"\ngit push origin main'
  ];

  let snippetIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let currentSnippet = codeSnippets[0];

  function typeCode() {
    if (!terminalText) return;

    if (isDeleting) {
      terminalText.textContent = currentSnippet.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        snippetIndex = (snippetIndex + 1) % codeSnippets.length;
        currentSnippet = codeSnippets[snippetIndex];
        setTimeout(typeCode, 500);
      } else {
        setTimeout(typeCode, 30);
      }
    } else {
      terminalText.textContent = currentSnippet.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentSnippet.length) {
        isDeleting = true;
        setTimeout(typeCode, 2000);
      } else {
        setTimeout(typeCode, 50);
      }
    }
  }

  // Start typing animation
  typeCode();

  // ========================================
  // SMOOTH SCROLL WITH OFFSET
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // HEADER SCROLL EFFECT
  // ========================================
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 12px rgba(10, 17, 40, 0.15)';
    } else {
      header.style.boxShadow = 'none';
    }

    // Hide header on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 500) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  // ========================================
  // MOBILE MENU TOGGLE
  // ========================================
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');

  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');

      // Toggle hamburger animation
      const spans = mobileMenuToggle.querySelectorAll('span');
      if (mobileMenuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close mobile menu when clicking nav link
    document.querySelectorAll('.nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          nav.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          const spans = mobileMenuToggle.querySelectorAll('span');
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
    });
  }

  // ========================================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ========================================
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.project-card, .about-card, .timeline-item, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(el);
  });

  // ========================================
  // SKILL BARS ANIMATION
  // ========================================
  const skillBarsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
          const width = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => {
            bar.style.width = width;
          }, 100);
        });
        skillBarsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.skills-grid').forEach(grid => {
    skillBarsObserver.observe(grid);
  });

  // ========================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ========================================
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // ========================================
  // YEAR UPDATE (FOOTER)
  // ========================================
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ========================================
  // PARALLAX EFFECT ON HERO - REMOVED FOR SMOOTH SCROLLING
  // ========================================
  // Removed to prevent overlap issues during scroll

  // ========================================
  // DYNAMIC PROJECT LOADING FROM GITHUB (Optional Enhancement)
  // ========================================
  // Uncomment to fetch live data from GitHub API
  /*
  async function loadGitHubProjects() {
    try {
      const response = await fetch('https://api.github.com/users/iamharshtita/repos?sort=updated&per_page=6');
      const repos = await response.json();

      // Update project cards with live GitHub data
      console.log('GitHub repos loaded:', repos);

      // You can dynamically update the project cards here
    } catch (error) {
      console.error('Error loading GitHub projects:', error);
    }
  }

  loadGitHubProjects();
  */

  // ========================================
  // CONSOLE EASTER EGG
  // ========================================
  console.log('%c👋 Hello, Recruiter!', 'font-size: 20px; font-weight: bold; color: #00D9FF;');
  console.log('%cLooking for someone who can:', 'font-size: 14px; color: #6C63FF;');
  console.log('✓ Build AI systems with LLMs');
  console.log('✓ Design scalable data pipelines');
  console.log('✓ Create full-stack applications');
  console.log('✓ Solve complex technical problems');
  console.log('%cLet\'s talk! 📧 harshtita01@gmail.com', 'font-size: 14px; font-weight: bold; color: #00D9FF;');

});

// ========================================
// MOBILE RESPONSIVE NAV STYLES (Add to CSS dynamically)
// ========================================
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .nav {
      position: fixed;
      top: 64px;
      right: -100%;
      width: 100%;
      max-width: 300px;
      height: calc(100vh - 64px);
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      flex-direction: column;
      padding: 2rem;
      box-shadow: -4px 0 12px rgba(10, 17, 40, 0.1);
      transition: right 0.3s ease;
      z-index: 999;
    }

    .nav.active {
      right: 0;
      display: flex;
    }

    .nav a {
      width: 100%;
      padding: 1rem;
      border-bottom: 1px solid var(--gray-200);
    }

    .nav-cta {
      margin-top: 1rem;
      text-align: center;
    }
  }
`;
document.head.appendChild(style);
