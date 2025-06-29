// Contact Form Handler
document.getElementById('contact-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Thank you for reaching out! I will get back to you soon.');
  this.reset();
});

// Theme Toggle
const toggleBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.body.classList.add('dark');

toggleBtn?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Language Switch
const translations = {
  en: {
    about: "About Me",
    aboutText: "Hi, I'm Mustafa Ali Yahya Adam, a Chemical Engineering student with a passion for programming...",
    resume: "Resume",
    contact: "Contact Me"
  },
  ar: {
    about: "من أنا",
    aboutText: "أنا مصطفى علي يحيى آدم، طالب هندسة كيميائية وشغوف بالبرمجة...",
    resume: "السيرة الذاتية",
    contact: "اتصل بي"
  },
  tr: {
    about: "Hakkımda",
    aboutText: "Ben Mustafa Ali Yahya Adam, Kimya Mühendisliği öğrencisiyim...",
    resume: "Özgeçmiş",
    contact: "İletişim"
  }
};

document.querySelectorAll('#lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    localStorage.setItem('lang', lang);
    updateLanguage(lang);
  });
});

function updateLanguage(lang) {
  document.getElementById('about-heading').innerText = translations[lang].about;
  document.getElementById('about-text').innerText = translations[lang].aboutText;
  document.getElementById('resume-heading').innerText = translations[lang].resume;
  document.getElementById('contact-heading').innerText = translations[lang].contact;
}

// Init on load
window.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('lang') || 'en';
  updateLanguage(lang);
  document.getElementById("year").textContent = new Date().getFullYear();
});
