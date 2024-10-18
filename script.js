document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
    
    alert('Thank you for reaching out! I will get back to you soon.');
    
    this.reset(); // Reset form fields
});


document.querySelectorAll('.progress').forEach(function(progress) {
    const percentage = progress.getAttribute('data-percentage');
    const rotation = (percentage / 100) * 360;
    
    if (percentage <= 50) {
        progress.style.transform = `rotate(${rotation}deg)`;
    } else {
        progress.style.clip = 'rect(auto, auto, auto, auto)';
        progress.style.transform = `rotate(${rotation}deg)`;
    }
});
