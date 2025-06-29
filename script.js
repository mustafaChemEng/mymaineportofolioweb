// Contact form confirmation message
document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
  alert('Thank you for reaching out! I will get back to you soon.');
  this.reset();
});

// Auto-update footer year
document.getElementById("year").textContent = new Date().getFullYear();
