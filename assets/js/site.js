{
  const btn = document.querySelector('.menu');
  const links = document.querySelector('.links');
  if (btn && links) {
    btn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const filters = document.querySelectorAll('.filters button');
  const cases = document.querySelectorAll('[data-tags]');
  filters.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.f;
    filters.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    cases.forEach(c => { c.hidden = f !== 'all' && !c.dataset.tags.split(' ').includes(f); });
  }));

  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  document.querySelectorAll('.shot img').forEach(img => img.addEventListener('click', () => {
    lb.firstChild.src = img.src;
    lb.firstChild.alt = img.alt;
    lb.classList.add('on');
  }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}
