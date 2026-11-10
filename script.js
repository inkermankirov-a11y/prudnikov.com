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


// NEW ABOUT PORTRAIT LOADER
(async()=>{
  try{
    const urls=Array.from({length:6},(_,i)=>`./images/about-photo-data/${i}.txt?v=20261105`);
    const parts=await Promise.all(urls.map(async url=>{
      const response=await fetch(url,{cache:"no-store"});
      if(!response.ok) throw new Error("Не удалось загрузить часть фотографии");
      return (await response.text()).trim();
    }));
    const portraitSrc="data:image/webp;base64,"+parts.join("");
    const gallery=document.querySelector("[data-about-gallery]");
    if(!gallery) return;
    const main=gallery.querySelector("[data-gallery-main]");
    const portraitThumb=gallery.querySelector('.gallery-thumb[data-gallery-kind="portrait"]');
    const thumbImage=portraitThumb?.querySelector("img");
    if(portraitThumb) portraitThumb.dataset.gallerySrc=portraitSrc;
    if(thumbImage) thumbImage.src=portraitSrc;
    if(main && portraitThumb?.classList.contains("is-active")) main.src=portraitSrc;
  }catch(error){
    console.error("Не удалось собрать новый портрет:",error);
  }
})();


// Contact form: data stays in the browser until the user sends the prepared message in Telegram.
document.querySelectorAll('[data-contact-form]').forEach(form=>{
  const status=form.querySelector('[data-form-status]');
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    const name=(form.elements.name?.value||'').trim();
    const request=(form.elements.request?.value||'').trim();
    const version=form.dataset.consentVersion||'10.11.2026';
    const topic=form.dataset.topic||document.title;
    const message=[
      'Здравствуйте, Евгений.',
      '',
      'Имя: '+name,
      'Страница: '+topic,
      'Запрос: '+request,
      '',
      'Согласие на обработку персональных данных для первичного обращения: ДА.',
      'Редакция согласия: '+version+'.',
      'Подтверждаю, что через веб-форму не передаю сведения о здоровье, интимной жизни и иные специальные категории персональных данных.'
    ].join('\n');
    const url='https://t.me/Evgeniy_Prudnikov?text='+encodeURIComponent(message);
    if(status) status.textContent='Открываю Telegram. Сообщение будет отправлено только после вашего подтверждения в приложении.';
    window.open(url,'_blank','noopener,noreferrer');
  });
});
