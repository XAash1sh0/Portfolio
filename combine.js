document.addEventListener('DOMContentLoaded', function() {
  // ===== Mobile Navigation =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ===== Project Filtering =====
  const filterButtons = document.querySelectorAll('.filter');
  const projectItems = document.querySelectorAll('.gallery .item');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const selectedCategory = this.getAttribute('data-filter');

      projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (selectedCategory === 'all' || itemCategory === selectedCategory) {
          item.style.display = 'block';
          item.classList.add('visible');
        } else {
          item.style.display = 'none';
          item.classList.remove('visible');
        }
      });

      // Smooth transition effect
      setTimeout(() => {
        projectItems.forEach(item => {
          item.style.transition = 'all 0.3s ease';
        });
      }, 100);
    });
  });

  // Trigger the 'all' filter on page load
  document.querySelector('.filter[data-filter="all"]')?.click();

  // ===== Smooth Scrolling for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;

      if (target) {
        window.scrollTo({
          top: target.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Animate Skill Bars on Scroll =====
  const skillSection = document.querySelector('.skills');
  const skillLevels = document.querySelectorAll('.skill-level');

  function animateSkills() {
    if (!skillSection) return;

    const sectionTop = skillSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight * 0.75) {
      skillLevels.forEach(level => {
        const width = level.style.width;
        level.style.width = '0';
        setTimeout(() => {
          level.style.transition = 'width 1s ease-in-out';
          level.style.width = width;
        }, 200);
      });
      window.removeEventListener('scroll', animateSkills);
    }
  }

  window.addEventListener('scroll', animateSkills);
  animateSkills();

  // ===== Editable Text Functionality =====
  const toggleEditBtn = document.getElementById('toggleEdit');
  const editPanel = document.getElementById('editPanel');
  const saveChangesBtn = document.getElementById('saveChanges');
  const resetChangesBtn = document.getElementById('resetChanges');
  const editableElements = document.querySelectorAll('.editable');

  // Default content (if any)
  const defaultContent = {}; // Make sure you define your default content somewhere

  editableElements.forEach(element => {
    const key = element.getAttribute('data-key');
    if (!element.innerHTML && defaultContent[key]) {
      element.innerHTML = defaultContent[key];
    }
  });

  function loadSavedContent() {
    const savedContent = localStorage.getItem('portfolioContent');
    if (savedContent) {
      const contentObj = JSON.parse(savedContent);
      editableElements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (contentObj[key]) {
          element.innerHTML = contentObj[key];
        }
      });
    }
  }

  toggleEditBtn?.addEventListener('click', function() {
    document.body.classList.toggle('edit-mode');
    editPanel?.classList.toggle('hidden');

    if (document.body.classList.contains('edit-mode')) {
      editableElements.forEach(element => {
        element.setAttribute('contenteditable', 'true');
      });
    } else {
      editableElements.forEach(element => {
        element.removeAttribute('contenteditable');
      });
    }
  });

  saveChangesBtn?.addEventListener('click', function() {
    const currentContent = {};
    editableElements.forEach(element => {
      const key = element.getAttribute('data-key');
      currentContent[key] = element.innerHTML;
    });
    localStorage.setItem('portfolioContent', JSON.stringify(currentContent));
    document.body.classList.remove('edit-mode');
    editPanel?.classList.add('hidden');
    editableElements.forEach(element => {
      element.removeAttribute('contenteditable');
    });
    alert('Your changes have been saved!');
  });

  resetChangesBtn?.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset all text to default?')) {
      editableElements.forEach(element => {
        const key = element.getAttribute('data-key');
        element.innerHTML = defaultContent[key];
      });
      localStorage.removeItem('portfolioContent');
      alert('All text has been reset to default.');
    }
  });

  loadSavedContent();

  // ===== Active Navigation on Scroll =====
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');

  function highlightNavOnScroll() {
    let current = '';
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 20;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);
  highlightNavOnScroll();
});

// ====== Contact Form Submission ======
document.getElementById('contact-form')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name')?.value;
  const email = document.getElementById('email')?.value;
  const message = document.getElementById('message')?.value;

  try {
    const response = await fetch('http://localhost:3000/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    const data = await response.json();

    if (data.success) {
      alert('Message sent successfully!');
    } else {
      alert('Error sending message: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error sending message. Please try again later.');
  }
});
