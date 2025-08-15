function HirePage() {
      window.location.href ="Hire-me.html";
    }
    function ProjectsPage() {
      window.location.href = "MainProjects.html";
    }
     const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const overlay = document.getElementById('overlay');
        const menuItems = document.querySelectorAll('.menu-item');
        const contextIndicator = document.querySelector('.context-indicator');
        
        // Toggle sidebar
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
        
        // Close sidebar
        function closeSidebar() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
        
        sidebarClose.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);
        
        // Handle menu items with submenus
        menuItems.forEach(item => {
            const target = item.getAttribute('data-target');
            const submenu = document.getElementById(`${target}Submenu`);
            
            if (submenu) {
                item.addEventListener('click', () => {
                    const isOpen = submenu.classList.contains('open');
                    const allSubmenus = document.querySelectorAll('.submenu');
                    
                    // Close all other submenus
                    allSubmenus.forEach(menu => {
                        if (menu !== submenu) {
                            menu.classList.remove('open');
                            const parent = menu.closest('.menu-item');
                            if (parent) {
                                parent.querySelector('.arrow').innerHTML = '<i class="fas fa-chevron-down"></i>';
                            }
                        }
                    });
                    
                    // Toggle current submenu
                    if (isOpen) {
                        submenu.classList.remove('open');
                        item.querySelector('.arrow').innerHTML = '<i class="fas fa-chevron-down"></i>';
                    } else {
                        submenu.classList.add('open');
                        item.querySelector('.arrow').innerHTML = '<i class="fas fa-chevron-up"></i>';
                    }
                });
            }
            
            // Handle navigation for items without submenus
            if (!submenu) {
                item.addEventListener('click', () => {
                    // Remove active class from all items
                    menuItems.forEach(i => i.classList.remove('active'));
                    
                    // Add active class to clicked item
                    item.classList.add('active');
                    
                    // Update context indicator
                    contextIndicator.textContent = `Navigated to: ${item.querySelector('.label').textContent}`;
                    
                    // Close sidebar on mobile
                    closeSidebar();
                    
                    // Simulate page navigation
                    simulateNavigation(target);
                });
            }
        });
        
        // Simulate navigation
        function simulateNavigation(target) {
            console.log(`Navigating to: ${target}`);
            // In a real application, this would load the appropriate content
            // For this demo, we'll just update the main content title
            const title = document.querySelector('.content-title');
            const titles = {
                dashboard: "Developer Dashboard",
                projects: "Project Management",
                analytics: "Analytics Overview",
                debugger: "Debugging Tools",
                terminal: "Terminal Console",
                database: "Database Explorer",
                api: "API Testing Suite",
                profile: "Profile Settings",
                security: "Security Center",
                notifications: "Notification Center"
            };
            
            if (titles[target]) {
                title.textContent = titles[target];
            }
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            // Add animation to the avatar
            const avatar = document.querySelector('.avatar');
            setInterval(() => {
                avatar.style.animation = 'pulse 2s ease-in-out';
                setTimeout(() => {
                    avatar.style.animation = '';
                }, 2000);
            }, 10000);
        });
  /* -------------------------
     Typing / rotating subtitle
     ------------------------- */
  (function(){
    const strings = [
      "Developer Abhinash Jha",
      "HTML + CSS + JS",
      "Node.js • React",
      "UI/UX Enthusiast",
      "Always Learning..."
    ];
    const el = document.getElementById('subtitle-wrap');
    let i=0, ch=0, del=false;
    const hold=1200;
    function tick(){
      const cur = strings[i];
      if(!del){
        el.textContent = cur.slice(0, ch++);
        if(ch > cur.length){ del=true; setTimeout(tick, hold); return; }
      } else {
        el.textContent = cur.slice(0, ch--);
        if(ch < 0){ del=false; i=(i+1)%strings.length; ch=0; }
      }
      setTimeout(tick, del?40:45);
    }
    setTimeout(tick, 500);
  })();

  /* -------------------------
     Particles (canvas) — lightweight
     ------------------------- */
  (function(){
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    

    function resize(){
      w = canvas.width = Math.floor(window.innerWidth * ratio);
      h = canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(ratio,0,0,ratio,0,0);
      initParticles();
    }
    function initParticles(){
      particles = [];
      const count = Math.max(18, Math.floor(window.innerWidth / 60));
      for(let i=0;i<count;i++){
        particles.push({
          x: Math.random()*window.innerWidth,
          y: Math.random()*window.innerHeight,
          r: 0.8 + Math.random()*2.6,
          vx: (Math.random()-0.5) * 0.25,
          vy: (Math.random()-0.5) * 0.25,
          alpha: 0.10 + Math.random()*0.18
        });
      }
    }
    function update(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy;
        if(p.x < -30) p.x = window.innerWidth + 30;
        if(p.x > window.innerWidth + 30) p.x = -30;
        if(p.y < -30) p.y = window.innerHeight + 30;
        if(p.y > window.innerHeight + 30) p.y = -30;

        const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*10);
        grad.addColorStop(0, `rgba(6,182,212,${p.alpha*0.7})`);
        grad.addColorStop(0.5, `rgba(124,58,237,${p.alpha*0.12})`);
        grad.addColorStop(1, `rgba(15,20,30,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r*10,0,Math.PI*2); ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(200,230,255,${p.alpha})`;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(update);
    }
    window.addEventListener('resize', resize);
    resize();
    update();
  })();

  /* -------------------------
     CTA interactions
     ------------------------- */
  (function(){
    document.getElementById('hireBtn').addEventListener('click', ()=> window.location.href='#contact');
    document.getElementById('projectsBtn').addEventListener('click', ()=> window.location.href='#projects');
  })();

  /* -------------------------
     Image fallback hint
     ------------------------- */
  (function(){
    const img = document.getElementById('heroImage');
    img.addEventListener('error', ()=> {
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="100%" height="100%" fill="#0f172a"/><text x="50%" y="50%" fill="#6ee7f6" font-size="24" font-family="Arial" text-anchor="middle" dy=".3em">Portfolio Page.jpg not found</text></svg>'
      );
      console.warn('Place your square image named "Portfolio Page.jpg" in this folder. Recommended: 500×500 px.');
    });
  })();
  
    document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.skill-card');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleY = (x - centerX) / 10;
                const angleX = (centerY - y) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            });
        });
         // Animation enhancement on scroll
        document.addEventListener('DOMContentLoaded', function() {
            const skillItems = document.querySelectorAll('.skill-item');
            
            skillItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px)';
                    this.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.12)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.08)';
                });
            });
            
            // Floating animation for category cards
            const cards = document.querySelectorAll('.category-card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.classList.remove('floating');
                });
                
                card.addEventListener('mouseleave', function() {
                    this.classList.add('floating');
                });
            });
        });
         // Simple progressive form handling: client-side validation and a fake "send" flow.
  const form = document.getElementById('contactForm');
  const status = document.getElementById('status');
  const sendBtn = document.getElementById('sendBtn');
  const clearBtn = document.getElementById('clearBtn');

  clearBtn.addEventListener('click', ()=>{
    form.reset(); status.textContent='';
  });

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    status.textContent = '';

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if(!name || !email || !message){
      status.textContent = 'Please fill required fields (name, email, message).';
      return;
    }

    // Micro UX: disable button and show sending state
    sendBtn.disabled = true; sendBtn.style.opacity = 0.85; sendBtn.textContent = 'Sending...';

    // Simulated network delay (replace this with your real API call)
    await new Promise(r=>setTimeout(r, 900));

    // Here you would POST to your serverless endpoint / API. Example:
    // await fetch('/api/contact', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({name,email,message}) });

    // Show success state
    sendBtn.textContent = 'Message sent ✓';
    status.textContent = 'Thank you! I have received your message and will reply within 24–48 hours.';

    // small reset after a few seconds
    setTimeout(()=>{
      sendBtn.disabled = false; sendBtn.textContent = 'Send Message'; form.reset();
    }, 2000);
  });

  // Accessibility hint: enable Enter to submit on focused fields (native behaviour usually) and trap accidental whitespace-only inputs.
  