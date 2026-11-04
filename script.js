const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');
if(toggle&&nav){
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')!=='true';
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
    nav.classList.toggle('open',open);
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Открыть меню');
  }));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }
  });
}
const year=document.getElementById('year');
if(year) year.textContent=String(new Date().getFullYear());

const aboutGallery=document.querySelector('[data-about-gallery]');
if(aboutGallery){
  const main=aboutGallery.querySelector('[data-gallery-main]');
  const frame=aboutGallery.querySelector('.about-gallery-main');
  const thumbs=[...aboutGallery.querySelectorAll('.gallery-thumb')];
  const prev=aboutGallery.querySelector('[data-gallery-prev]');
  const next=aboutGallery.querySelector('[data-gallery-next]');
  const open=aboutGallery.querySelector('[data-gallery-open]');
  const lightbox=document.querySelector('[data-about-lightbox]');
  const lightboxImage=lightbox?.querySelector('[data-lightbox-image]');
  const lightboxClose=lightbox?.querySelector('[data-lightbox-close]');
  let index=0;

  const show=(i)=>{
    if(!thumbs.length) return;
    index=(i+thumbs.length)%thumbs.length;
    const thumb=thumbs[index];
    const src=thumb.dataset.gallerySrc;
    const alt=thumb.dataset.galleryAlt||'';
    const kind=thumb.dataset.galleryKind||'certificate';

    main.style.opacity='0';
    window.setTimeout(()=>{
      main.src=src;
      main.alt=alt;
      frame.classList.toggle('is-portrait',kind==='portrait');
      frame.classList.toggle('is-certificate',kind!=='portrait');
      main.onload=()=>{ main.style.opacity='1'; };
      if(main.complete) main.style.opacity='1';
    },90);

    thumbs.forEach((item,n)=>{
      item.classList.toggle('is-active',n===index);
      item.setAttribute('aria-current',n===index?'true':'false');
    });
  };

  thumbs.forEach((thumb,i)=>thumb.addEventListener('click',()=>show(i)));
  prev?.addEventListener('click',()=>show(index-1));
  next?.addEventListener('click',()=>show(index+1));

  open?.addEventListener('click',()=>{
    if(!lightbox||!lightboxImage) return;
    lightboxImage.src=main.src;
    lightboxImage.alt=main.alt;
    if(typeof lightbox.showModal==='function') lightbox.showModal();
  });

  lightboxClose?.addEventListener('click',()=>lightbox.close());
  lightbox?.addEventListener('click',(event)=>{
    if(event.target===lightbox) lightbox.close();
  });

  document.addEventListener('keydown',(event)=>{
    if(event.key==='ArrowLeft') show(index-1);
    if(event.key==='ArrowRight') show(index+1);
    if(event.key==='Escape'&&lightbox?.open) lightbox.close();
  });
}
