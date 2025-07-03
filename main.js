// modal
const modal = document.getElementById("modal");
const openBtn = document.querySelector(".open-modal-btn");
const closeBtn = document.getElementById("closeModal");

// about tag
const tags = document.querySelectorAll('.skill-tag');

// projectCard
const projectCards = document.querySelectorAll('.project-column');

// contact form
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMessage");

// reviews
const avatarList = document.getElementById("avatarList");
const nameEl = document.getElementById("reviewName");
const roleEl = document.getElementById("reviewRole");
const textEl = document.getElementById("reviewText");

// back to top 
const backToTopBtn = document.getElementById('backToTop');

// active link
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// animation for skill tags 
document.addEventListener('DOMContentLoaded', function() {
    
    tags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(20px)';
            tag.animate([
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], {
                duration: 600,
                delay: index * 100,
                fill: 'forwards'
            });
        }, 500);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    projectCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
});
// form
 

  form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = new FormData(form);
  const response = await fetch(form.action, {
    method: form.method,
    body: data,
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    form.reset();
    msg.style.display = "block";
  } else {
    msg.textContent = "❌ Oops! Something went wrong.";
    msg.style.display = "block";
  }
});

// modal


openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// review section

let currentActive = null;

fetch('data/reviews.json')
.then(response => response.json())
.then(data => {
data.forEach((review, index) => {
const img = document.createElement('img');
img.src = review.avatar;
img.classList.add('avatar');
img.setAttribute('data-id', review.id);

if (index === 0) {
    img.classList.add('active');
    nameEl.textContent = review.name;
    roleEl.textContent = review.role;
    textEl.textContent = review.text;
    currentActive = img;
}

img.addEventListener('click', () => {
    if (currentActive) currentActive.classList.remove('active');
    img.classList.add('active');
    currentActive = img;

    nameEl.textContent = review.name;
    roleEl.textContent = review.role;
    textEl.textContent = review.text;
});

avatarList.appendChild(img);
});
})
.catch(err => {
console.error('Failed to load reviews:', err);
});

// project section

let currentPage = 1;
const projectsPerPage = 3;

function renderProjects(data) {
  const wrapper = document.getElementById("projectWrapper");
  wrapper.innerHTML = "";

  const start = (currentPage - 1) * projectsPerPage;
  const end = start + projectsPerPage;
  const paginated = data.slice(start, end);

  paginated.forEach(project => {
    const techTags = project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join("");
    const card = `
      <div class="project-column">
        <div class="project-img-container">
          <img class="project-img" src="${project.image}" />
          <div class="project-overlay">
            <a href="${project.preview}" class="view-project">View Details</a>
          </div>
        </div>
        <div class="project-body">
          <h5 class="project-title">${project.title}</h5>
          <p class="project-description">${project.description}</p>
          <div class="tech-tags">${techTags}</div>
          <div class="btns">
            <a class="success" href="${project.preview}"><i class="fas fa-eye"></i> Preview</a>
            <a class="danger" href="${project.source}"><i class="fab fa-github"></i> Source Code</a>
          </div>
        </div>
      </div>
    `;
    wrapper.innerHTML += card;
  });

  document.getElementById("pageIndicator").innerText = `Page ${currentPage}`;
}

function updatePaginationButtons(data) {
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage * projectsPerPage >= data.length;
}

fetch('data/projects.json')
  .then(res => res.json())
  .then(data => {
    renderProjects(data);
    updatePaginationButtons(data);

    document.getElementById("prevBtn").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProjects(data);
        updatePaginationButtons(data);
      }
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
      if (currentPage * projectsPerPage < data.length) {
        currentPage++;
        renderProjects(data);
        updatePaginationButtons(data);
      }
    });
  });
// filter

let filteredProjects = [];

function filterProjects(data, tech) {
  if (tech === 'all') return data;
  return data.filter(project => project.tech.includes(tech));
}

fetch('data/projects.json')
  .then(res => res.json())
  .then(data => {
    filteredProjects = data;
    renderProjects(filteredProjects);
    updatePaginationButtons(filteredProjects);

    document.querySelectorAll("#techFilter button").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#techFilter .filter-btn").forEach(b => b.classList.remove('active'));
        btn.classList.add("active");

        currentPage = 1;
        const tech = btn.getAttribute("data-tech");
        filteredProjects = filterProjects(data, tech);
        renderProjects(filteredProjects);
        updatePaginationButtons(filteredProjects);
      });
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderProjects(filteredProjects);
            updatePaginationButtons(filteredProjects);
        }
        });

        document.getElementById("nextBtn").addEventListener("click", () => {
        if (currentPage * projectsPerPage < filteredProjects.length) {
            currentPage++;
            renderProjects(filteredProjects);
            updatePaginationButtons(filteredProjects);
        }
    });
  });
//   scroll
 window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  };

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
// active link show
window.addEventListener('scroll', () => {
let current = '';

sections.forEach(section => {
    const sectionTop = section.offsetTop - 60; // adjust for navbar height
    if (pageYOffset >= sectionTop) {
    current = section.getAttribute('id');
    }
});

navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
    link.classList.add('active');
    }
});
});