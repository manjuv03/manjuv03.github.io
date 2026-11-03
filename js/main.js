// Manju Swaroop V · portfolio scripts
(function(){
  var root=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // theme toggle (dark-first)
  function isDark(){var t=root.getAttribute('data-theme');if(t)return t==='dark';return !window.matchMedia('(prefers-color-scheme: light)').matches}
  function syncIcon(){var d=isDark();document.getElementById('ic-sun').hidden=!d;document.getElementById('ic-moon').hidden=d}
  try{var saved=localStorage.getItem('msv-theme');if(saved)root.setAttribute('data-theme',saved)}catch(e){}
  syncIcon();
  document.getElementById('theme-btn').addEventListener('click',function(){
    var next=isDark()?'light':'dark';root.setAttribute('data-theme',next);syncIcon();
    try{localStorage.setItem('msv-theme',next)}catch(e){}
  });

  // in-page links: offset for the sticky header, reveal target instantly
  var navBar=document.querySelector('nav.top');
  function goTo(id,smooth){
    var t=document.getElementById(id);if(!t)return;
    t.querySelectorAll('.reveal.pre').forEach(function(el){el.classList.remove('pre')});
    var off=(navBar?navBar.getBoundingClientRect().height:68)+8;
    var y=t.getBoundingClientRect().top+window.pageYOffset-(id==='home'?off+200:off-(t.matches('section.block')?40:0));
    window.scrollTo({top:Math.max(0,y),behavior:(smooth&&!reduce)?'smooth':'auto'});
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;
    var id=a.getAttribute('href').slice(1);if(!id||!document.getElementById(id))return;
    e.preventDefault();goTo(id,true);
    try{history.replaceState(null,'','#'+id)}catch(err){}
  });
  window.addEventListener('load',function(){var h=location.hash.slice(1);if(h&&document.getElementById(h))goTo(h,false)});

  // mobile menu
  var links=document.getElementById('links'),mb=document.getElementById('menu-btn');
  mb.addEventListener('click',function(){var o=links.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  links.addEventListener('click',function(e){if(e.target.tagName==='A'){links.classList.remove('open');mb.setAttribute('aria-expanded','false')}});

  // cursor glow
  var glow=document.getElementById('cursor-glow');
  if(!reduce && window.matchMedia('(pointer: fine)').matches){
    window.addEventListener('pointermove',function(e){glow.style.opacity=1;glow.style.transform='translate('+(e.clientX-260)+'px,'+(e.clientY-260)+'px)'},{passive:true});
    document.addEventListener('pointerleave',function(){glow.style.opacity=0});
  }

  // active nav + back to top
  var navAs=[].slice.call(links.querySelectorAll('a'));
  var secs=navAs.map(function(a){return document.querySelector(a.getAttribute('href'))});
  var topBtn=document.getElementById('top-btn');
  function onScroll(){
    var y=window.scrollY+120,cur=-1;
    secs.forEach(function(s,i){if(s&&s.offsetTop<=y)cur=i});
    navAs.forEach(function(a,i){a.classList.toggle('active',i===cur)});
    topBtn.classList.toggle('off',window.scrollY<500);
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  topBtn.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

  // reveal: elements start visible; only below-the-fold ones get a soft lift
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.remove('pre');io.unobserve(en.target)}})},{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(el){
      if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add('pre');io.observe(el)}
    });
  }

  // stat count-up
  if('IntersectionObserver' in window && !reduce){
    var so=new IntersectionObserver(function(es){es.forEach(function(en){
      if(!en.isIntersecting)return;so.unobserve(en.target);
      var el=en.target,to=+el.dataset.count,suf=el.dataset.suffix||'',t0=performance.now();
      (function step(t){var p=Math.min(1,(t-t0)/1100),dec=+(el.dataset.dec||0),v=(to*(1-Math.pow(1-p,3))).toFixed(dec);el.textContent=v+suf;if(p<1)requestAnimationFrame(step)})(t0);
    })},{threshold:.6});
    document.querySelectorAll('[data-count]').forEach(function(el){if(el.getBoundingClientRect().top>window.innerHeight)so.observe(el)});
  }

  // copy buttons
  document.querySelectorAll('.copy').forEach(function(b){
    b.addEventListener('click',function(){
      var el=document.getElementById(b.dataset.copy),txt=el.textContent;
      function done(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1600)}
      function fallback(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected'}
      try{navigator.clipboard.writeText(txt).then(done,fallback)}catch(e){fallback()}
    });
  });

  // rotating role
  var rot=document.getElementById('rot');
  if(rot && !reduce){var rs=[].slice.call(rot.children),ri=0;
    setInterval(function(){var cur=rs[ri];cur.classList.remove('on');cur.classList.add('out');
      ri=(ri+1)%rs.length;var nx=rs[ri];nx.classList.remove('out');void nx.offsetWidth;nx.classList.add('on');
      setTimeout(function(){cur.classList.remove('out')},600)},2600);}

  // spotlight on cards
  document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.hov');if(!c)return;
    var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});

  // resume modal + download
  var modal=document.getElementById('resume-modal'),lastFocus=null;
  function openResume(){lastFocus=document.activeElement;modal.hidden=false;document.getElementById('resume-close').focus()}
  function closeResume(){modal.hidden=true;if(lastFocus)lastFocus.focus()}
  document.querySelectorAll('[data-resume]').forEach(function(b){b.addEventListener('click',openResume)});
  document.getElementById('resume-close').addEventListener('click',closeResume);
  modal.addEventListener('click',function(e){if(e.target===modal)closeResume()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!modal.hidden)closeResume();else if(!chat.hidden)toggleChat(false)}});
  // AI chat
  var chat=document.getElementById('chat'),fab=document.getElementById('chat-fab'),log=document.getElementById('chat-log'),
      form=document.getElementById('chat-form'),inp=document.getElementById('chat-input'),chips=document.getElementById('chips');
  var turns=[],busy=false,sample=null,sampleKnown=false;
  sampleKnown=true;
  function offline(){if(!chat.querySelector('.chat-off')){form.hidden=true;chips.hidden=true;
    var d=document.createElement('div');d.className='chat-off';d.textContent='The AI assistant is not available in this view. You can email Manju at manjuswaroop03@gmail.com.';chat.insertBefore(d,form)}}
  function toggleChat(open){chat.hidden=!open;fab.setAttribute('aria-expanded',open);var p=fab.querySelector('.ping');if(p)p.remove();
    if(open){inp.focus();log.scrollTop=log.scrollHeight}}
  fab.addEventListener('click',function(){toggleChat(chat.hidden)});
  document.getElementById('chat-close').addEventListener('click',function(){toggleChat(false);fab.focus()});
  document.querySelectorAll('[data-chat]').forEach(function(b){b.addEventListener('click',function(){toggleChat(true)})});
  function bubble(cls,txt){var m=document.createElement('div');m.className='msg '+cls;m.textContent=txt;log.appendChild(m);log.scrollTop=log.scrollHeight;return m}
  var copy={not_granted:'The assistant is not available right now. You can email Manju at manjuswaroop03@gmail.com instead.',
    rate_limited:'Lots of questions at once. Please wait a moment and try again.'};
  // answers from the profile
  var A={
    ey:"At EY (Jul 2024 – Sep 2026, 2.2 years) Manju was an Associate Consultant. He validated and optimised ETL pipelines across 50+ interfaces with SQL, Python and Spark on Databricks at 98% data accuracy, built AI classification models and Kafka-based data workflows for compliance, and cleaned and validated 120+ country-specific datasets in Amazon S3. He also won EY's Client Extraordinaire Award.",
    amazon:"As a Data Scientist Intern at Amazon (Jul – Sep 2022) Manju worked on dynamic pricing using user and location price history, which lifted average transaction value by 10% and service-provider retention by 25%. He also cleaned data in Python and scraped competitor data for insights.",
    village:"At Village Company (Jan – Jun 2024) Manju was a Data Analyst Intern. He analysed retention and churn for 500+ premium clients with SQL, and built predictive models and cohort analyses in Python for luxury-goods retention.",
    exp:"Manju has 2.2 years as an Associate Consultant at EY plus 1.2 years of internships: Data Analyst Intern at Village Company and Data Scientist Intern at Amazon. Ask me about any of them for details.",
    edu:"Manju is doing an MSc in Data Science at Queen Mary University of London (Sep 2026 – Sep 2027), with coursework in Machine Learning, NLP, Data Mining, Big Data Processing, Neural Networks & Deep Learning and Applied Statistics. Before that he earned a B.Tech in CSE – Data Science from Dayananda Sagar University (2020–2024) with a CGPA of 8.82/10.",
    skills:"Manju works with Python, SQL and R; PyTorch, TensorFlow, scikit-learn and Keras; LangChain, LangGraph, RAG and vector databases; and Spark, Databricks, Delta Lake, Kafka and Amazon S3 for data engineering. He also uses Tableau, Power BI, Git and Jupyter.",
    genai:"Manju builds LLM agents with LangChain and LangGraph, using tool calling, RAG and vector memory (Chroma DB). His Personalised AI Assistant improved response continuity by over 85% and answered in under 300 ms on average. He's currently building production-ready agentic AI systems and exploring LLM fine-tuning and MLOps.",
    research:"Manju has two published papers: “Gene Expression Analysis for Leukemia” (ICCCNT 2023, IIT Delhi, IEEE Xplore), reaching 98.12% accuracy with Rat Swarm Optimisation, and “Sensitive Data Classification Using Deep Network with Sequential Models” (ICRTC 2023, Springer LNNS vol. 954), where his CNN hit 97.5% accuracy. Links are on the project cards.",
    projects:"Highlights: a Personalised AI Assistant with LangChain, LangGraph and Chroma DB; two published papers on leukemia detection (98.12% accuracy) and sensitive data classification (97.5% CNN accuracy); and a first-place customer churn model at Altair Expo. See the Projects section for details.",
    certs:"Manju is a Databricks Certified Data Engineer Associate. He also holds Stanford's Machine Learning Specialization, IIT Madras' Data Science for Engineers (Elite Silver), University of Michigan's Introduction to Data Science in Python, and EY's Agentic AI and Applied AI Bronze certifications.",
    awards:"Manju won EY's Client Extraordinaire Award, was a NASA Space Apps Global Nominee in 2022 and 2023, took 1st place at Altair Expo, and won the Neo Coding Arena challenge.",
    avail:"Manju is looking for full-time graduate roles in data science, machine learning and AI from September 2027. He's based in London and happy to relocate across the UK.",
    loc:"Manju is based in London, UK, and originally from Bengaluru, India. He's happy to relocate anywhere in the UK.",
    contact:"You can email Manju at manjuswaroop03@gmail.com, or find him on LinkedIn (Manju Swaroop V) and GitHub (@manjuv03). The buttons in the Contact section open each one.",
    fit:"Manju fits data science, ML and AI engineering roles well: 2.2 years of production data and ML work at EY, LLM agents with LangChain and LangGraph, deep learning research published with IEEE and Springer, and Databricks certification. He's still building depth in MLOps, LLM fine-tuning and distributed training.",
    resume:"You can view and download Manju's resume from the resume icon at the top of the page.",
    hi:"Hi! Ask me about Manju's experience, projects, research, skills, education or when he can start."
  };
  var R=[[/\b(hi|hello|hey)\b/,'hi'],[/fit|suit|good for|hire|role|position|job/,'fit'],[/\bey\b|ernst|consult|client extra/,'ey'],[/amazon|pricing/,'amazon'],[/village|churn|retention/,'village'],
    [/paper|research|publish|ieee|springer|leuk|gene|sensitive/,'research'],[/certif|databricks cert|course(ra)?\b/,'certs'],[/award|achiev|nasa|altair|neo coding|win/,'awards'],
    [/llm|agent|langchain|langgraph|gen ?ai|rag|chatbot|assistant/,'genai'],[/project|built|portfolio work/,'projects'],[/skill|tech|stack|tool|python|sql|spark|pytorch|tensorflow/,'skills'],
    [/educat|degree|msc|master|b\.?tech|universit|queen mary|qmul|cgpa|gpa|study|modul|coursework/,'edu'],[/start|availab|when|graduat|full.?time/,'avail'],
    [/where|locat|based|relocat|london|india/,'loc'],[/contact|email|reach|linkedin|github|mail/,'contact'],[/resume|cv\b/,'resume'],[/experience|work|career|background|intern/,'exp']];
  function localAnswer(q){var t=q.toLowerCase();for(var i=0;i<R.length;i++){if(R[i][0].test(t))return A[R[i][1]]}
    return "I don't have that detail. You can email Manju at manjuswaroop03@gmail.com, or ask me about his experience, projects, skills, education or availability."}
  function ask(q){
    q=q.trim();if(!q||busy)return;
    if(!sample){chips.hidden=true;bubble('me',q);var lb=bubble('bot think','…');setTimeout(function(){lb.classList.remove('think');lb.textContent=localAnswer(q);log.scrollTop=log.scrollHeight},350);return}
    busy=true;chips.hidden=true;bubble('me',q);turns.push({role:'user',content:q});
    var b=bubble('bot think','Thinking…');
    sample(turns.slice(-10),{cache:false,modelTier:'quick',onText:function(o){b.classList.remove('think');b.textContent=o.text;log.scrollTop=log.scrollHeight}})
      .then(function(r){b.classList.remove('think');b.textContent=r.text;turns.push({role:'assistant',content:r.text})})
      .catch(function(e){b.classList.remove('think');b.textContent=(e&&e.text)||copy[e&&e.code]||'Something went wrong. Please try again, or email manjuswaroop03@gmail.com.';turns.pop();
        if(e&&e.code==='not_granted'){sample=null}})
      .then(function(){busy=false});
  }
  form.addEventListener('submit',function(e){e.preventDefault();var v=inp.value;inp.value='';ask(v)});
  chips.addEventListener('click',function(e){if(e.target.tagName==='BUTTON')ask(e.target.textContent)});

  // neural-net constellation inside the avatar
  var c=document.getElementById('net');
  if(c){
  var ctx=c.getContext('2d'),pts=[],W,H;
  function size(){var r=c.getBoundingClientRect(),d=window.devicePixelRatio||1;W=r.width;H=r.height;c.width=W*d;c.height=H*d;ctx.setTransform(d,0,0,d,0,0)}
  size();window.addEventListener('resize',size);
  for(var i=0;i<34;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35});
  var cols=['#2dd4bf','#38bdf8','#f5b84b'];
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<pts.length;i++){var p=pts[i];
      if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
      for(var j=i+1;j<pts.length;j++){var q=pts[j],dx=p.x-q.x,dy=p.y-q.y,dd=dx*dx+dy*dy;
        if(dd<6400){ctx.strokeStyle='rgba(45,212,191,'+(1-dd/6400)*.6+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke()}}
      ctx.fillStyle=cols[i%3];ctx.beginPath();ctx.arc(p.x,p.y,2.2,0,6.283);ctx.fill();
    }
    if(!reduce)requestAnimationFrame(draw);
  }
  draw();
  }
})();
