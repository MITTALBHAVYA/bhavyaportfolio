const starWrapper = document.querySelector('.star-wrapper');

// Function to create a star
function createStar() {
  const star = document.createElement('div');
  star.classList.add('star');
  
  // Random position
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  
  // Random hue and brightness for variation
  const hue = Math.random() * 360;
  const brightness = 10 + Math.random() * 70;
  
  star.style.top = `${top}%`;
  star.style.left = `${left}%`;
  star.style.setProperty('--hue', hue);
  star.style.setProperty('--brightness', `${brightness}%`);
  
  return star;
}

// Generate multiple stars
for (let i = 0; i < 100; i++) {
  const star = createStar();
  starWrapper.appendChild(star);
}
