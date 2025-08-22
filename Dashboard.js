  (function(){
      const APP = document.getElementById('studyweb-app');

      /* Utility: create 10 cards for each section */
      function makeCards(gridId, subject){
        const grid = document.getElementById(gridId);
        for(let i=1;i<=10;i++){
          const art = document.createElement('article');
          art.className = 'sw-card sw-anim';
          art.innerHTML = `<div><h3>Chapter ${i}</h3><p>Concise chapter summary placeholder for ${subject} chapter ${i}.</p></div><div><button class="sw-btn" title="View Chapter ${i}" data-subject="${subject}" data-chapter="${i}">View</button></div>`;
          grid.appendChild(art);
        }
      }

      makeCards('sw-physics-grid','Physics');
      makeCards('sw-chemistry-grid','Chemistry');
      makeCards('sw-english-grid','English');
      makeCards('sw-hindi-grid','Hindi');

      /* Staggered entrance animation on load for .sw-anim elements */
      function animateIn(){
        const elems = APP.querySelectorAll('.sw-anim');
        elems.forEach((el,i)=>{
          const delay = i*90; // stagger 90ms
          el.style.animationDelay = delay+'ms';
        });
      }

      /* Smooth scroll behavior for nav links and scroll-spy */
      function initNav(){
        const links = APP.querySelectorAll('#sw-navbar .sw-nav-link');
        links.forEach(link=>{
          link.addEventListener('click', (e)=>{
            e.preventDefault();
            const target = document.getElementById(link.getAttribute('data-target'));
            if(target){
              target.scrollIntoView({behavior:'smooth',block:'start'});
            }
          });
        });

        // Scroll-spy using IntersectionObserver
        const sections = Array.from(APP.querySelectorAll('section[id]'));
        const navMap = {}; links.forEach(l=>navMap[l.getAttribute('data-target')] = l);
        const obs = new IntersectionObserver((entries)=>{
          entries.forEach(entry=>{
            const id = entry.target.id;
            const nav = navMap[id];
            if(entry.isIntersecting){
              Object.values(navMap).forEach(n=>{n.removeAttribute('aria-current');});
              if(nav) nav.setAttribute('aria-current','true');
            }
          });
        },{threshold:0.5});
        sections.forEach(s=>obs.observe(s));
      }

      /* Modal logic */
      function openModal(title,content){
        const root = document.getElementById('sw-modal-root');
        root.innerHTML = '';
        const backdrop = document.createElement('div'); backdrop.className='sw-modal-backdrop'; backdrop.tabIndex = -1;
        backdrop.innerHTML = `<div class="sw-modal" role="dialog" aria-modal="true" aria-label="${title}"><div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:12px\"><h3 style=\"margin:0\">${title}</h3><button aria-label=\"Close\" title=\"Close\" id=\"sw-modal-close\">×</button></div><div>${content}</div></div>`;
        root.appendChild(backdrop);

        function close(){root.innerHTML='';document.removeEventListener('keydown',onKey);}        
        function onKey(e){ if(e.key==='Escape'){ close(); }}
        document.getElementById('sw-modal-close').addEventListener('click', close);
        document.addEventListener('keydown', onKey);
      }

      /* Wire buttons to modals */
      function initButtons(){
        APP.addEventListener('click',(e)=>{
          const btn = e.target.closest('.sw-btn');
          if(!btn) return;
          const subj = btn.getAttribute('data-subject') || 'Subject';
          const chap = btn.getAttribute('data-chapter') || btn.getAttribute('data-chapter') || '1';
          openModal(`${subj} — Chapter ${chap}`, `<p>Placeholder content for <strong>${subj} Chapter ${chap}</strong>. Replace with real notes, PDF links or inline content.</p>`);
        });
      }

      /* Init function */
      function swInit(){
        animateIn();
        initNav();
        initButtons();
      }

      if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', swInit); else swInit();

    })();

  const navLinks = document.querySelectorAll('.sw-nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active')); // sabse active hatado
      link.classList.add('active'); // sirf clicked pe lagao
    });
  });
