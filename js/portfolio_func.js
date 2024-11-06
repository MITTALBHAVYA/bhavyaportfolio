let temp_data = "";
achievements.forEach((achievement) => {
  temp_data += `<div class="achievement-info"><h3 class="achievement-title">${achievement.title}</h3><p class="achievement-description">${achievement.description}</p></div>`;
});
document.querySelector(".achievement").innerHTML = temp_data;

// preprocessing the skills data
temp_data = "";
skills_data.forEach((skill) => {
  temp_data += `<p><span class="skill-category">${skill.category} :</span>${skill.data}</p>`;
});
document.querySelector("div.skill-list").innerHTML = temp_data;

// preprocessing the timeline data
temp_data = "";
let count = 0;
timeline_data.forEach((timeline) => {
  if (count % 2 == 0) {
    temp_data += `<div class="timeline-block timeline-block-right">
    <div class="marker"></div>
    <div class="timeline-content">
      <h3>${timeline.timeRange}</h3>
      <span>${timeline.title}</span>
      <p>
        ${timeline.description}
      </p>
    </div>
  </div>`;
  } else {
    temp_data += `<div class="timeline-block timeline-block-left">
    <div class="marker"></div>
    <div class="timeline-content">
      <h3>${timeline.timeRange}</h3>
      <span>${timeline.title}</span>
      <p>
        ${timeline.description}
      </p>
    </div>
  </div>`;
  }
  count++;
});
document.querySelector(".timeline-container").innerHTML = temp_data;

// preprocessing the project data
temp_data = "";
let project_menu_data = "";
count = 0;
project_data.forEach((project) => {
  count++;
  project_menu_data += `<span class="project-name-list-item" data-project-id="${
    project.id
  }" data-active="${count == 1 ? "true" : "false"}">${project.name}</span>`;

  temp_data += `<div class="project-detail" data-project-id="${
    project.id
  }" data-active="${
    count == 1 ? "true" : "false"
  }"><div class="project-title">${project.title}</div>
  <div class="project-image"><img src="${project.image}" alt="${
    project.title + " " + project.description
  }" /></div>
  <div class="project-description">${project.description}</div>
  <div class="project-tech-stacks">
    ${project.techStacks
      .map((techStack) => {
        return `<span class="project-tech-stack">${techStack}</span>`;
      })
      .join("")}
  </div>
  <div class="project-links">
      ${
        project.link.github
          ? `<a href="${project.link.github}" class="project-link" alt="Github Link of Project : ${project.title}">Github</a>`
          : ""
      }
      ${
        project.link.youtube
          ? `<a href="${project.link.youtube}" class="project-link" alt="Youtube video link of Project : ${project.title}">Youtube</a>`
          : ""
      }
      ${
        project.link.live
          ? `<a href="${project.link.live}" class="project-link" alt="Live Deployment link of Project : ${project.title}">Live</a>`
          : ""
      }
  </div></div>`;
});
document.querySelector(
  ".project-container"
).innerHTML = `<div class="project-name-list-menu">${project_menu_data}</div>${temp_data}`;

window.addEventListener("load", function () {
  setTimeout(function () {
    document.body.classList.remove("loading");
    document.querySelector(".loader").style.display = "none";
    document.querySelector(".content-not-ready").style.display = "block";
    document.getElementById("preloading-bg-imgs").innerHTML = "";
  }, 1000);
});
document.querySelectorAll(".project-name-list-item").forEach((item) => {
  item.addEventListener("click", (event) => {
    const active = item.getAttribute("data-active") ?? "false";
    if (active == "false") {
      const target = item.getAttribute("data-project-id");
      document.querySelectorAll(".project-name-list-item").forEach((x) => {
        x.setAttribute("data-active", "false");
      });
      item.setAttribute("data-active", "true");
      item.scrollIntoView({ behavior: "smooth", block: "center" });
      document.querySelectorAll(".project-detail").forEach((x) => {
        if (x.getAttribute("data-project-id") == target) {
          x.setAttribute("data-active", "true");
        } else {
          x.setAttribute("data-active", "false");
        }
      });
    }
  });
});

// handling of nav menu click
// document.querySelectorAll(".navbar-item").forEach((item) => {
//   item.addEventListener("click", (event) => {
//     const target = item.getAttribute("data-target");
//     console.log(target);
//     const target_element = document.querySelector(
//       "div[data-target='" + target + "']"
//     );
//     if (target_element) {
//       target_element.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   });
// });

// // down arrow click
// document
//   .querySelector(".down-arrow-animation")
//   .addEventListener("click", (event) => {
//     const target = document.querySelector(".about-section");
//     if (target) {
//       target.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   });

//   window.addEventListener("scroll", (event) => {
//     if (window.scrollY > window.visualViewport.height) {
//       document.querySelector(".navbar").classList.add("show-nav")
//     } else {
//       document.querySelector(".navbar").classList.remove("show-nav");
//     }
//   });
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const navbarItems = document.querySelectorAll('.navbar-item');
  const downArrow = document.querySelector('.down-arrow-animation');
  const aboutSection = document.querySelector('.about-section');

  // Throttle function to limit the rate at which a function can fire
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Smooth scroll function
  const smoothScroll = (target) => {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    // Easing function
    const ease = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
  }

  // Navbar item click event
  navbarItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(`div[data-target='${item.getAttribute('data-target')}']`);
      if (target) {
        smoothScroll(target);
      }
    });
  });

  // Down arrow click event
  if (downArrow && aboutSection) {
    downArrow.addEventListener('click', () => {
      smoothScroll(aboutSection);
    });
  }

  // Scroll event for navbar visibility
  let lastScrollTop = 0;
  window.addEventListener('scroll', throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > window.innerHeight) {
      navbar.classList.add('show-nav');
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.classList.remove('show-nav');
    }
    
    lastScrollTop = scrollTop;
  }, 100));

  // Highlight active navbar item based on scroll position
  const sections = document.querySelectorAll('div[data-target]');
  window.addEventListener('scroll', throttle(() => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('data-target');
      }
    });

    navbarItems.forEach((item) => {
      item.classList.remove('active');
      if (item.getAttribute('data-target') === current) {
        item.classList.add('active');
      }
    });
  }, 100));
});