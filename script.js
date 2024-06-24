// CODE FOR MOBILE VIEW NAVBAR
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

mobileMenu.addEventListener('click', () => {
  if (navList.classList.contains('active')) {
    navList.classList.remove('active');
    navList.classList.add('inactive');
  } else {
    navList.classList.remove('inactive');
    navList.classList.add('active');
  }
});

// DAY-NIGHT MODE
const storageKey = 'theme-preference';

const onClick = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    setPreference();
};

const getColorPreference = () => {
    if (localStorage.getItem(storageKey)) {
        return localStorage.getItem(storageKey);
    } else {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
};

const setPreference = () => {
    localStorage.setItem(storageKey, theme.value);
    reflectPreference();
};

const reflectPreference = () => {
    document.body.setAttribute('data-theme', theme.value);
    document.querySelector('#theme-toggle')?.setAttribute('aria-label', theme.value);
};

const theme = {
    value: getColorPreference(),
};

// Set early so no page flashes / CSS is made aware
reflectPreference();

window.onload = () => {
    reflectPreference();
    document.querySelector('#theme-toggle').addEventListener('click', onClick);
};

// Sync with system changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches: isDark}) => {
    theme.value = isDark ? 'dark' : 'light';
    setPreference();
});


// PROGRESS-BAR LOADER
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progress-bar');
    let resources = document.images.length;
    let loadedResources = 0;
  
    function updateProgress() {
      let percentage = Math.floor((loadedResources / resources) * 100);
      progressBar.style.width = percentage + '%';
  
      if (percentage === 100) {
        setTimeout(() => {
          progressBar.style.display = 'none';
          document.getElementById('loader').style.display = 'none';
        }, 500);
      }
    }
  
    Array.from(document.images).forEach(image => {
      if (image.complete) {
        loadedResources++;
        updateProgress();
      } else {
        image.addEventListener('load', () => {
          loadedResources++;
          updateProgress();
        });
        image.addEventListener('error', () => {
          loadedResources++;
          updateProgress();
        });
      }
    });
  
    window.addEventListener('load', () => {
      updateProgress(); // Ensure progress is updated after all resources have loaded
    });
  });
  
// TEXT-ANIMATION ON HERO SECTION
const dynamicText = document.querySelector('.dynamic-text');
const phrases = ['Web Developer',  'Programmer'];
let currentPhraseIndex = 0;
let currentCharacterIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[currentPhraseIndex];
    if (isDeleting) {
        currentCharacterIndex--;
    } else {
        currentCharacterIndex++;
    }

    dynamicText.textContent = currentPhrase.substring(0, currentCharacterIndex);

    if (!isDeleting && currentCharacterIndex === currentPhrase.length) {
        setTimeout(() => isDeleting = true, 1000);
    } else if (isDeleting && currentCharacterIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
    }

    const typingSpeed = isDeleting ? 100 : 200;
    setTimeout(type, typingSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 500);
});
// MODAL 
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
