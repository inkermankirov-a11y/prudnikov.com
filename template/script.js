const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');

if(toggle&&nav){
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')!=='true';
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
    nav.classList.toggle('open',open);
  });

  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open menu');
  }));

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open menu');
    }
  });
}

const thumbs=[...document.querySelectorAll('.gallery-thumb')];
const placeholder=document.querySelector('.media-placeholder');

if(thumbs.length&&placeholder){
  thumbs.forEach(thumb=>{
    thumb.addEventListener('click',()=>{
      thumbs.forEach(item=>item.classList.remove('is-active'));
      thumb.classList.add('is-active');

      const label=thumb.dataset.label||'Media';
      const title=placeholder.querySelector('span');
      const note=placeholder.querySelector('small');

      if(title) title.textContent=label;
      if(note) note.textContent='Replace with your image';
    });
  });
}

const year=document.getElementById('year');
if(year) year.textContent=String(new Date().getFullYear());
