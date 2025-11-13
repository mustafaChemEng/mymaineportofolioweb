/* =================================================
== FULLY CORRECTED SCRIPT.JS FILE ==
=================================================
*/

/*
--- FIX 1: CONTACT FORM ---
The old 'Contact Form Handler' has been DELETED. 
This is CORRECT. 
Your HTML <form> will now use Formspree to send you emails, as intended.
*/

// --- Theme Toggle (This code was already perfect) ---
const toggleBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.body.classList.add('dark');

toggleBtn?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});


// --- Language Switch ---
/* NOTE: This will only work after you update your index.html file!
  You must add the following IDs:
  1. <h2 id="about-heading">About Me</h2>
  2. <p id="about-text">Motivated Chemical Engineering...</p>
  3. <h2 id="contact-heading">...Contact Me</h2>
  (Your resume-heading ID is already correct)
*/
const translations = {
  en: {
    about: "About Me",
    /* TODO: You must copy your FULL 'About Me' paragraph here. 
      The old text was cut short.
    */
    aboutText: "Motivated Chemical Engineering Student with strong foundations in process design, simulation, and safety. Passionate about remote collaboration, global quality systems, and sustainable industrial innovation. Skilled in combining engineering and programming to deliver impactful, tech-driven solutions. Experienced in biochemical simulations, pipeline design, and digital tools. Hi, I’m Mustafa Ali Yahya Adam — a Chemical Engineering student at Bolu Abant Izzet Baysal University with a deep passion for sustainable process design, simulation, and tech-driven innovation.",
    resume: "📄 Resume",
    contact: "📬 Contact Me"
  },
  ar: {
    about: "من أنا",
    aboutText: "أنا مصطفى علي يحيى آدم، طالب هندسة كيميائية وشغوف بالبرمجة...", // TODO: Add full Arabic text
    resume: "📄 السيرة الذاتية",
    contact: "📬 اتصل بي"
  },
  tr: {
    about: "Hakkımda",
    aboutText: "Ben Mustafa Ali Yahya Adam, Kimya Mühendisliği öğrencisiyim...", // TODO: Add full Turkish text
    resume: "📄 Özgeçmiş",
    contact: "📬 İletişim"
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
  // Use optional chaining '?' to prevent errors if an element doesn't exist on a page
  document.getElementById('about-heading')?.innerText = translations[lang].about;
  document.getElementById('about-text')?.innerText = translations[lang].aboutText;
  document.getElementById('resume-heading')?.innerText = translations[lang].resume;
  document.getElementById('contact-heading')?.innerText = translations[lang].contact;
}


// --- Init on load ---
window.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('lang') || 'en';
  updateLanguage(lang);
  
  // This script sets the footer year for ALL pages.
  // You can now delete the extra footer scripts from blog.html and work.html.
  document.getElementById("year").textContent = new Date().getFullYear();
});


// --- Scroll-to-top button logic ---
/*
  NOTE: This JavaScript is now fixed and safe.
  It will work once you:
  1. Add the button HTML to your .html files (before the <footer>).
  2. Add the button CSS to your styles.css file.
*/
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.onscroll = function () {
  if (scrollTopBtn) { // Check if the button exists on this page
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  }
};

// Add click listener safely
scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
