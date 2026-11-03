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
  var prog=document.getElementById('progress');
  function onProg(){var h=document.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')'}
  window.addEventListener('scroll',function(){onScroll();onProg()},{passive:true});onScroll();onProg();
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
      form=document.getElementById('chat-form'),inp=document.getElementById('chat-input'),chips=document.getElementById('chips'),
      pitchBtn=document.getElementById('pitch-btn');
  var turns=[],busy=false,sample=null,pitchUsed=false,askedTopics={},usedActs={};
  var GREET={
    home:["Hi! I'm Manju's assistant. Ask me about his experience, projects, research or when he can start, or tap the pitch for a quick summary.",null],
    about:["Hi! Want the short version of Manju's story? Tap the pitch, or ask me anything about him.",["What is he working on now?","What did he do at EY?","When can he start?"]],
    skills:["Curious where Manju has actually used these skills? Ask me.",["What tools does he use?","Tell me about his LLM work","Why does Manju fit a Data Engineer role?"]],
    projects:["Want the story behind the leukemia paper? Or ask about any project here.",["Tell me about the leukemia paper","Tell me about the sensitive data paper","Tell me about his AI assistant project"]],
    experience:["Want to know what Manju did at EY, Amazon or Village Company?",["What did he do at EY?","What did he do at Amazon?","What did he do at Village Company?"]],
    education:["Questions about Manju's MSc at Queen Mary or his B.Tech?",["Tell me about his education","What certifications does he have?","When can he start?"]],
    achievements:["Want details on Manju's certifications or awards?",["What certifications does he have?","What awards has he won?","Tell me about his research"]],
    stats:["Want the story behind these numbers?",["What did he do at EY?","Give me the 30-second pitch"]],
    contact:["Want a quick summary before you reach out?",["Give me the 30-second pitch","How can I contact him?","When can he start?"]]
  };
  var defaultChips=chips.innerHTML;
  function currentSection(){var y=window.innerHeight*0.4,id='home';
    document.querySelectorAll('header.hero, section.block').forEach(function(el){var b=el.getBoundingClientRect();if(b.top<=y&&b.bottom>y)id=el.id||id});return id}
  function greet(){if(log.querySelectorAll('.msg.me').length)return;
    var g=GREET[currentSection()]||GREET.home,first=log.querySelector('.brow .msg.bot');if(first)first.textContent=g[0];
    if(g[1]){setFollowups(g[1])}else{chips.innerHTML=defaultChips;chips.hidden=false}}
  function toggleChat(open){if(!open&&typeof stopSpeaking==='function')stopSpeaking();chat.hidden=!open;fab.setAttribute('aria-expanded',open);var p=fab.querySelector('.ping');if(p)p.remove();
    if(open){hideNudge();greet();inp.focus();log.scrollTop=log.scrollHeight}}

  // gentle nudge after 20 seconds, once per visit
  var nudge=document.getElementById('nudge');
  function hideNudge(){if(nudge)nudge.hidden=true}
  var seen=false;try{seen=sessionStorage.getItem('msv-nudge')==='1'}catch(e){}
  if(nudge&&!seen){setTimeout(function(){if(!chat.hidden||pitchUsed)return;nudge.hidden=false;try{sessionStorage.setItem('msv-nudge','1')}catch(e){}},12000)}
  if(nudge){nudge.querySelector('.nudge-go').addEventListener('click',function(){hideNudge();toggleChat(true);setTimeout(function(){ask('Give me the 30-second pitch','pitch')},150)});
    nudge.querySelector('.nudge-x').addEventListener('click',hideNudge)}

  // "Ask about this" on project and job cards
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.ask-this');if(!b)return;
    toggleChat(true);setTimeout(function(){ask(b.getAttribute('data-ask'),b.getAttribute('data-key'))},150)});
  fab.addEventListener('click',function(){toggleChat(chat.hidden)});
  document.getElementById('chat-close').addEventListener('click',function(){toggleChat(false);fab.focus()});
  document.querySelectorAll('[data-chat]').forEach(function(b){b.addEventListener('click',function(){toggleChat(true)})});

  // ---- what the assistant knows: answer, action buttons and follow-up questions per topic
  var GMAIL='https://mail.google.com/mail/?view=cm&fs=1&to=manjuswaroop03@gmail.com&su=Hello%20Manju';
  var IEEE='https://ieeexplore.ieee.org/document/10307762',SPR='https://link.springer.com/chapter/10.1007/978-981-97-1724-8_34';
  var GO=function(l,id){return {l:l,go:id}},URL_=function(l,u){return {l:l,url:u}},CV={l:'View resume',resume:1},MAIL=URL_('Email Manju',GMAIL);
  var T={
    pitch:{a:"Manju Swaroop is an MSc Data Science student at Queen Mary University of London, looking for full-time data science, ML and AI roles from September 2027. He spent 2.2 years at EY building ETL pipelines across 50+ interfaces with Spark and Databricks at 98% data accuracy, plus AI classification models for compliance, and won EY's Client Extraordinaire Award. Before that he interned at Amazon, where his dynamic pricing work lifted average transaction value by 10%. He builds LLM agents with LangChain and LangGraph, has two published papers (IEEE and Springer), and is a Databricks Certified Data Engineer Associate.",
      act:[CV,MAIL,GO('See projects','projects')],fu:["Why does Manju fit an AI Engineer role?","Tell me about his research","When can he start?"]},
    ey:{a:"At EY (Jul 2024 – Sep 2026, 2.2 years) Manju was an Associate Consultant. He validated and optimised ETL pipelines across 50+ interfaces with SQL, Python and Spark on Databricks at 98% data accuracy, built AI classification models and Kafka-based data workflows for compliance, and cleaned and validated 120+ country-specific datasets in Amazon S3. He also won EY's Client Extraordinaire Award.",
      act:[GO('Jump to Experience','experience'),CV],fu:["What did he do at Amazon?","What tools does he use?","What certifications does he have?"]},
    amazon:{a:"As a Data Scientist Intern at Amazon (Jul – Sep 2022) Manju worked on dynamic pricing using user and location price history, which lifted average transaction value by 10% and service-provider retention by 25%. He also cleaned data in Python and scraped competitor data for insights.",
      act:[GO('Jump to Experience','experience'),CV],fu:["Tell me about Village Company","What did he do at EY?","Why does Manju fit a Data Scientist role?"]},
    village:{a:"At Village Company (Jan – Jun 2024) Manju was a Data Analyst Intern. He analysed retention and churn for 500+ premium clients with SQL, and built predictive models and cohort analyses in Python for luxury-goods retention.",
      act:[GO('Jump to Experience','experience')],fu:["What did he do at Amazon?","What did he do at EY?","What are his skills?"]},
    exp:{a:"Manju has 2.2 years as an Associate Consultant at EY plus 1.2 years of internships: Data Analyst Intern at Village Company and Data Scientist Intern at Amazon.",
      act:[GO('Jump to Experience','experience'),CV],fu:["What did he do at EY?","What did he do at Amazon?","Why does Manju fit an ML Engineer role?"]},
    research:{a:"Manju has two published papers: “Gene Expression Analysis for Leukemia” (ICCCNT 2023, IIT Delhi, IEEE Xplore), reaching 98.12% accuracy with Rat Swarm Optimisation, and “Sensitive Data Classification Using Deep Network with Sequential Models” (ICRTC 2023, Springer LNNS vol. 954), where his CNN hit 97.5% accuracy.",
      act:[URL_('Read IEEE paper',IEEE),URL_('Read Springer paper',SPR),GO('See projects','projects')],fu:["What projects has he built?","What are his skills?","What certifications does he have?"]},
    genai:{a:"Manju builds LLM agents with LangChain and LangGraph, using tool calling, RAG and vector memory (Chroma DB). His Personalised AI Assistant improved response continuity by over 85% and answered in under 300 ms on average. Right now he's building production-ready agentic AI systems and exploring LLM fine-tuning and MLOps.",
      act:[GO('See projects','projects'),GO('See skills','skills')],fu:["Tell me about his research","Why does Manju fit an AI Engineer role?","What is he working on now?"]},
    projects:{a:"Highlights: a Personalised AI Assistant built with LangChain, LangGraph and Chroma DB; two published papers on leukemia detection (98.12% accuracy) and sensitive data classification (97.5% CNN accuracy); and a first-place customer churn model at Altair Expo.",
      act:[GO('See projects','projects'),URL_('GitHub','https://github.com/manjuv03')],fu:["Tell me about his research","Tell me about his LLM work","What are his skills?"]},
    skills:{a:"Manju works with Python, SQL and R; PyTorch, TensorFlow, scikit-learn and Keras; LangChain, LangGraph, RAG and vector databases; and Spark, Databricks, Delta Lake, Kafka and Amazon S3 for data engineering. He also uses Tableau, Power BI, Git and Jupyter.",
      act:[GO('See skills','skills')],fu:["Tell me about his LLM work","What certifications does he have?","Why does Manju fit a Data Engineer role?"]},
    now:{a:"Right now Manju is building production-ready agentic AI systems with LangChain, LangGraph and multi-tool orchestration, exploring MLOps, LLM fine-tuning and distributed training, and learning more about real-time streaming platforms.",
      act:[GO('See what he is working on','about')],fu:["Tell me about his LLM work","What are his skills?"]},
    edu:{a:"Manju is doing an MSc in Data Science at Queen Mary University of London (Sep 2026 – Sep 2027). Before that he earned a B.Tech in CSE – Data Science from Dayananda Sagar University (2020–2024) with a CGPA of 8.82/10.",
      act:[GO('Jump to Education','education')],fu:["What did he do at EY?","What certifications does he have?","When can he start?"]},
    certs:{a:"Manju is a Databricks Certified Data Engineer Associate. He also holds Stanford's Machine Learning Specialization, IIT Madras' Data Science for Engineers (Elite Silver), University of Michigan's Introduction to Data Science in Python, and EY's Agentic AI and Applied AI Bronze certifications.",
      act:[GO('See certifications','achievements')],fu:["What awards has he won?","What are his skills?","Tell me about his education"]},
    awards:{a:"Manju won EY's Client Extraordinaire Award and the “Most Unique Project” award at ICCCNT 2023 for his leukemia paper. He was a NASA Space Apps Global Nominee in 2022 and 2023, took 1st place at Altair Expo, and won the Neo Coding Arena challenge.",
      act:[GO('See achievements','achievements')],fu:["Tell me about his research","What did he do at EY?","Give me the 30-second pitch"]},
    avail:{a:"Manju is looking for full-time graduate roles in data science, machine learning and AI from September 2027. He's based in London and happy to relocate across the UK.",
      act:[MAIL,CV],fu:["Where is he based?","Why does Manju fit a Data Scientist role?","How can I contact him?"]},
    loc:{a:"Manju is based in London, UK, and originally from Bengaluru, India. He's happy to relocate anywhere in the UK.",
      act:[MAIL],fu:["When can he start?","How can I contact him?"]},
    contact:{a:"The quickest way is email: manjuswaroop03@gmail.com. You can also find him on LinkedIn (Manju Swaroop V) and GitHub (@manjuv03).",
      act:[MAIL,URL_('LinkedIn','https://www.linkedin.com/in/manju-swaroop-v'),URL_('GitHub','https://github.com/manjuv03')],fu:["Give me the 30-second pitch","When can he start?"]},
    resume:{a:"Here's Manju's resume. You can view it here or download it as a PDF.",act:[CV],fu:["Give me the 30-second pitch","How can I contact him?"]},
    fit:{a:"Manju fits data science, ML and AI engineering roles well: 2.2 years of production data and ML work at EY, LLM agents with LangChain and LangGraph, deep learning research published with IEEE and Springer, and Databricks certification. He's still building depth in MLOps, LLM fine-tuning and distributed training.",
      act:[CV,GO('See projects','projects'),MAIL],fu:["What did he do at EY?","Tell me about his research","When can he start?"]},
    role_ds:{a:"Why Manju fits a Data Scientist role:\n✓ Business impact: his dynamic pricing work at Amazon lifted average transaction value by 10% and service-provider retention by 25%\n✓ Analytics: churn and cohort analysis for 500+ premium clients at Village Company, in SQL and Python\n✓ ML in production: trained, tested and improved classification models for EY clients\n✓ Research: two published papers, with 98.12% and 97.5% accuracy\n✓ Foundations: MSc Data Science at Queen Mary, including Applied Statistics and Data Mining",
      act:[GO('See projects','projects'),URL_('Read IEEE paper',IEEE),CV],fu:["Tell me about his Amazon pricing work","What did he do at Village Company?","Tell me about his research"]},
    role_ml:{a:"Why Manju fits an ML Engineer role:\n✓ Deep learning: CNN and LSTM models in PyTorch and TensorFlow, with 97.5% accuracy\n✓ Feature selection: Rat Swarm Optimisation pipeline reaching 98.12% accuracy\n✓ Model lifecycle at EY: prepared features, trained, tested and improved models from evaluation results\n✓ Serving: deployed an assistant behind FastAPI with sub-300 ms average responses\n✓ Learning now: MLOps workflows, LLM fine-tuning and distributed training",
      act:[GO('See projects','projects'),URL_('Read Springer paper',SPR),CV],fu:["Tell me about the sensitive data paper","Tell me about the leukemia paper","What is he working on now?"]},
    role_ai:{a:"Why Manju fits an AI Engineer role:\n✓ LLM agents: built a conversational assistant with LangChain and LangGraph, using tool calling\n✓ RAG and memory: Chroma DB vector memory improved response continuity by over 85%\n✓ Speed: FastAPI deployment averaging under 300 ms across 100+ test cases\n✓ Focus: building production-ready agentic AI with multi-tool orchestration\n✓ AI at EY: AI-driven classification models, plus EY's Agentic AI and Applied AI certifications",
      act:[GO('See projects','projects'),GO('See skills','skills'),CV],fu:["Tell me about his AI assistant project","What is he working on now?","What certifications does he have?"]},
    role_de:{a:"Why Manju fits a Data Engineer role:\n✓ Pipelines at scale: ETL across 50+ interfaces with SQL, Python and Spark on Databricks\n✓ Data quality: 98% data accuracy, and 120+ country-specific datasets cleaned and validated\n✓ Streaming and storage: Kafka between systems, raw and processed data in Amazon S3\n✓ Certified: Databricks Certified Data Engineer Associate (Spark, Delta Lake, ETL)\n✓ Coursework: Big Data Processing, Data Analytics with Hadoop, Data Warehouse & Knowledge Mining",
      act:[GO('Jump to Experience','experience'),GO('See certifications','achievements'),CV],fu:["What did he do at EY?","What certifications does he have?","Tell me about his education"]},
    book:{a:"The best way to arrange a call is to email Manju directly. Tap Email Manju and Gmail will open addressed to him.",
      act:[MAIL],fu:["Give me the 30-second pitch","When can he start?"]},
    paper_gene:{a:"Manju's paper “Gene Expression Analysis for Leukemia” was presented at ICCCNT 2023 at IIT Delhi, won the “Most Unique Project” award, and was published in IEEE Xplore (Scopus-indexed). He built an ML pipeline that detects leukemia early from gene expression data, using Rat Swarm Optimisation to pick the most informative genes. It reached 98.12% accuracy, and Ridge with RSO scored 96.85% precision and a 94.84% Matthews correlation coefficient.",
      act:[URL_('Read IEEE paper',IEEE),GO('See projects','projects')],fu:["Tell me about the sensitive data paper","What tools does he use?","Why does Manju fit a Data Scientist role?"]},
    paper_sdc:{a:"“Sensitive Data Classification Using Deep Network with Sequential Models” was Manju's first research project (ICRTC 2023, published by Springer in LNNS vol. 954). Accuracy was weak on external data, so he gathered his own dataset, which improved the results. He fine-tuned CNN and LSTM models to classify sensitive data and compared them with SVM and logistic regression. The CNN reached 97.5% accuracy, more than 13.5 points above SVM's 84.02%, trained for 500 epochs with binary cross-entropy and Adam.",
      act:[URL_('Read Springer paper',SPR),GO('See projects','projects')],fu:["Tell me about the leukemia paper","What tools does he use?","Why does Manju fit an ML Engineer role?"]},
    churn:{a:"At Dayananda Sagar University's Altair Expo, Manju won first place with customer churn prediction models built in RapidMiner. The models analysed customer behaviour to find the main factors driving churn. He did similar churn and retention work later for 500+ premium clients at Village Company.",
      act:[GO('See projects','projects'),GO('Jump to Experience','experience')],fu:["What did he do at Village Company?","Tell me about his research","What awards has he won?"]},
    volunteer:{a:"Outside his studies, Manju volunteered with the Bharavase initiative, a community health and environment project, running surveys in underserved communities and working with local authorities to put programmes in place. He also volunteered with Youth for Seva on the Government of India's Ayushman Bharat initiative, raising awareness of food security and nutrition.",
      act:[GO('See volunteering','achievements')],fu:["What awards has he won?","Tell me about his research","Give me the 30-second pitch"]},
    nasa:{a:"Manju was named a Global Nominee in the NASA International Space Apps Challenge in both 2022 and 2023, building solutions to Earth and space challenges with his team under hackathon time pressure.",
      act:[GO('See achievements','achievements')],fu:["What other awards has he won?","Tell me about his research"]},
    journey:{a:"",act:[],fu:["Give me the 30-second pitch","Tell me about his research","What are his skills?"]},
    facts:{a:"",act:[URL_('LinkedIn','https://www.linkedin.com/in/manju-swaroop-v'),URL_('GitHub','https://github.com/manjuv03'),MAIL,CV],fu:["Walk me through his journey","Tell me about his research","What did he do at EY?"]},
    hi:{a:"Hi! Ask me about Manju's experience, projects, research, skills, education or when he can start.",act:[],fu:null},
    unknown:{a:"I don't have that detail. You can email Manju directly, or ask me about his experience, projects, skills, education or availability.",
      act:[MAIL],fu:["Give me the 30-second pitch","What did he do at EY?","How can I contact him?"]}
  };
  var R=[[/journey|walk me through|walkthrough|timeline|his story|career path|career so far/,'journey'],[/quick facts|at a glance|snapshot|key facts|essentials|fact sheet/,'facts'],[/\b(hi|hello|hey)\b/,'hi'],[/pitch|summar|overview|introduce|tell me about (him|manju)\b/,'pitch'],[/working on|currently|these days|right now/,'now'],
    [/interview|book a|schedule|arrange a call|set up a call|a call|meet/,'book'],[/data scien/,'role_ds'],[/\bml engineer|machine learning engineer/,'role_ml'],[/\bai engineer|llm engineer|gen ?ai engineer/,'role_ai'],[/data engineer/,'role_de'],[/fit|suit|good for|hire|role|position|job/,'fit'],[/leuk|gene expression/,'paper_gene'],[/sensitive data|sensitive|sdc/,'paper_sdc'],[/churn predict|churn project|altair/,'churn'],[/volunteer|community|ngo|charity|seva|bharavase|social/,'volunteer'],[/nasa|space apps|hackathon/,'nasa'],[/\bey\b|ernst|consult|client extra/,'ey'],[/amazon|pricing/,'amazon'],[/village|churn|retention/,'village'],
    [/paper|research|publish|ieee|springer|leuk|gene|sensitive/,'research'],[/certif|databricks cert|coursera/,'certs'],[/award|achiev|nasa|altair|neo coding|\bwin|\bwon\b/,'awards'],
    [/llm|agent|langchain|langgraph|gen ?ai|rag|chatbot|assistant/,'genai'],[/project|built|portfolio work/,'projects'],[/skill|tech|stack|tool|python|sql|spark|pytorch|tensorflow/,'skills'],
    [/educat|degree|msc|master|b\.?tech|universit|queen mary|qmul|cgpa|gpa|study|studied|modul|coursework/,'edu'],[/start|availab|when|graduat|full.?time/,'avail'],
    [/where|locat|based|relocat|london|india|bengaluru/,'loc'],[/available start/,'avail'],[/contact|email|reach|linkedin|github|mail/,'contact'],[/resume|\bcv\b/,'resume'],[/experience|work|career|background|intern/,'exp']];
  var SLANG=[[/\bur\b/g,'your'],[/\bu\b/g,'you'],[/\buni\b|\bcollege\b|\buniv\b/g,'university'],[/\bexp\b|\bxp\b/g,'experience'],[/\bwrk\b/g,'work'],
    [/\bjobs?\b|\bworked\b|\bemploy\w*|\bcompan(y|ies)\b|\bprevious roles?\b|\bwork history\b/g,'experience'],[/\bcerts?\b/g,'certifications'],
    [/\bpubs?\b|\bpublications?\b/g,'papers'],[/\bml\b(?! engineer)/g,'machine learning'],[/\bdeg\b/g,'degree'],[/\bpls\b|\bplz\b/g,''],
    [/\bmasters?\b|\bmsc\b|\bms\b/g,'msc'],[/\bvolunteer\w*/g,'volunteering'],[/\bhobb(y|ies)\b|\boutside work\b/g,'volunteering'],
    [/\bqm\b|\bqmul\b|\bqueen mary\b/g,'queen mary university'],[/\bwhere did he stud\w*|\bwhat did he stud\w*/g,'education'],
    [/\bhow (do|can) i (reach|contact|email)\b|\bget in touch\b/g,'contact'],[/\bwhen (is he|can he) (free|available)|\bnotice period\b/g,'available start']];
  var VOCAB=['experience','research','skills','education','university','certifications','awards','volunteering','volunteer','contact','amazon','village','ernst',
    'databricks','langchain','langgraph','leukemia','leukaemia','sensitive','projects','project','available','relocate','london','pitch','scientist','engineer',
    'internship','intern','email','linkedin','github','resume','python','spark','pytorch','tensorflow','kafka','nasa','hackathon','graduate','degree',
    'papers','paper','research','published','certification','achievements','achievement','churn','pricing','consultant','working','currently','tools',
    'education','studied','analytics','agents','agent','assistant','summary','overview','introduce','interview','schedule','location','based','bengaluru'];
  function lev(a,b){if(Math.abs(a.length-b.length)>2)return 9;var d=[],i,j;for(i=0;i<=a.length;i++){d[i]=[i]}for(j=0;j<=b.length;j++)d[0][j]=j;
    for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++){d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
      if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1)}return d[a.length][b.length]}
  function fix(w){if(w.length<5||VOCAB.indexOf(w)>=0)return w;var best=w,bd=w.length>=7?2:1;
    VOCAB.forEach(function(v){var x=lev(w,v);if(x<=bd&&(best===w||x<lev(w,best))){best=v;bd=x}});return best}
  function normalise(q){var t=(q||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9+#.'\s-]/g,' ');
    SLANG.forEach(function(p){t=t.replace(p[0],p[1])});
    return t.split(/\s+/).map(fix).join(' ').replace(/\s+/g,' ').trim()}
  function topicOf(q){var t=normalise(q);for(var i=0;i<R.length;i++){if(R[i][0].test(t))return R[i][1]}return 'unknown'}

  // ---- rendering
  var reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function userMsg(txt){var m=document.createElement('div');m.className='msg me';m.textContent=txt;log.appendChild(m);scrollLog()}
  function botRow(){var r=document.createElement('div');r.className='brow';
    r.innerHTML='<span class="bav" aria-hidden="true">MSV</span><div class="bcol"><span class="bname">Manju’s assistant</span><div class="msg bot"></div></div>';
    log.appendChild(r);scrollLog();return r}
  function scrollLog(){log.scrollTop=log.scrollHeight}
  function typing(r){var b=r.querySelector('.msg');b.classList.add('dots');b.innerHTML='<i></i><i></i><i></i>'}
  function typeOut(r,text,done){var b=r.querySelector('.msg');b.classList.remove('dots');
    if(reduceMotion){b.textContent=text;scrollLog();done&&done();return}
    var i=0,step=Math.max(2,Math.round(text.length/80));b.textContent='';b.classList.add('typing');
    (function tick(){i=Math.min(text.length,i+step);b.textContent=text.slice(0,i);scrollLog();
      if(i<text.length)setTimeout(tick,16);else{b.classList.remove('typing');done&&done()}})()}
  function useAct(label){usedActs[label]=1;
    document.querySelectorAll('.acts [data-act]').forEach(function(e){if(e.getAttribute('data-act')===label)e.remove()});
    document.querySelectorAll('.acts').forEach(function(w){if(!w.children.length)w.remove()});
    tidyTools()}
  function tidyTools(){var row=document.querySelector('.tool-row');if(row)row.hidden=![].some.call(row.children,function(b){return !b.hidden});
    var t=document.querySelector('.chat-tools');if(t)t.hidden=(!row||row.hidden)}
  function addActions(r,acts){acts=(acts||[]).filter(function(x){return !usedActs[x.l]});if(!acts.length)return;
    var w=document.createElement('div');w.className='acts';
    acts.forEach(function(x){var el;
      if(x.url){el=document.createElement('a');el.href=x.url;el.target='_blank';el.rel='noopener';el.textContent=x.l+' ↗'}
      else{el=document.createElement('button');el.type='button';el.textContent=x.l}
      el.setAttribute('data-act',x.l);
      el.addEventListener('click',function(){
        if(!x.url){if(x.resume){openResume()}else{if(window.innerWidth<720)toggleChat(false);goTo(x.go,true)}}
        setTimeout(function(){useAct(x.l)},0)});
      w.appendChild(el)});
    r.querySelector('.bcol').appendChild(w);scrollLog()}
  function setFollowups(list){if(!list){chips.hidden=false;return}
    var POOL=["What did he do at EY?","What did he do at Amazon?","What did he do at Village Company?","Tell me about his research","Tell me about his LLM work",
      "What are his skills?","What certifications does he have?","What awards has he won?","Tell me about his education","When can he start?","Where is he based?",
      "Why does Manju fit a Data Scientist role?","Why does Manju fit an ML Engineer role?","Why does Manju fit an AI Engineer role?","Why does Manju fit a Data Engineer role?",
      "Give me the 30-second pitch","How can I contact him?","Has he done any volunteering?","Walk me through his journey","Show me the quick facts"];
    var roleDone=Object.keys(askedTopics).some(function(k){return k.indexOf('role_')===0||k==='fit'});
    var used={},out=[];
    list.concat(POOL).forEach(function(q){var k=topicOf(q);
      if(out.length>=3||used[k]||askedTopics[k]||(pitchUsed&&k==='pitch')||(roleDone&&(k.indexOf('role_')===0||k==='fit')))return;used[k]=1;out.push(q)});
    list=out;
    chips.innerHTML='';list.forEach(function(q){var b=document.createElement('button');b.type='button';b.textContent=q;chips.appendChild(b)});chips.hidden=false;scrollLog()}
  function directMail(q){return GMAIL+'&body='+encodeURIComponent('Hi Manju,\n\nI was looking at your portfolio and wanted to ask: '+q+'\n\n')}
  var canSpeak='speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined',speaking=null;
  function stopSpeaking(){if(!canSpeak)return;speechSynthesis.cancel();if(speaking){speaking.classList.remove('on');speaking.setAttribute('aria-pressed','false')}speaking=null}
  function addSpeaker(r){if(!canSpeak||r.querySelector('.speak'))return;var b=document.createElement('button');b.type='button';b.className='speak';
    b.setAttribute('aria-label','Read this answer aloud');b.setAttribute('aria-pressed','false');
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg><span>Listen</span>';
    b.addEventListener('click',function(){if(speaking===b){stopSpeaking();return}stopSpeaking();
      var u=new SpeechSynthesisUtterance(r.querySelector('.msg').textContent.replace(/✓/g,''));u.lang='en-GB';u.rate=1.02;
      var v=speechSynthesis.getVoices().filter(function(x){return /^en(-|_)GB/i.test(x.lang)})[0];if(v)u.voice=v;
      u.onend=u.onerror=function(){if(speaking===b)stopSpeaking()};speaking=b;b.classList.add('on');b.setAttribute('aria-pressed','true');speechSynthesis.speak(u)});
    r.querySelector('.bname').appendChild(b)}
  function finish(r,key,q){setTimeout(syncTopics,0);addSpeaker(r);var t=T[key]||T.unknown,acts=t.act;
    if(key==='unknown')acts=[URL_('Ask Manju directly',directMail(q||''))];
    addActions(r,acts);setFollowups(t.fu);busy=false}
  // ---- career journey + quick facts
  var STEPS=[
    {when:"2020 – 2024 · Bengaluru",t:"Dayananda Sagar University",s:"B.Tech CSE – Data Science",p:"Studied computer science with a data science specialisation and graduated with a CGPA of 8.82/10. Published two research papers and was a NASA Space Apps Global Nominee twice.",act:[GO('See education','education')]},
    {when:"Jul – Sep 2022 · Bengaluru",t:"Amazon",s:"Data Scientist Intern",p:"Built a dynamic pricing model from user and location price history that lifted average transaction value by 10% and service-provider retention by 25%.",act:[GO('See experience','experience')]},
    {when:"Jan – Jun 2024 · Gurgaon",t:"Village Company",s:"Data Analyst Intern",p:"Analysed churn and retention for 500+ premium clients with SQL, and built predictive models and cohort analyses in Python.",act:[GO('See experience','experience')]},
    {when:"Jul 2024 – Sep 2026 · Bengaluru",t:"Ernst & Young (EY)",s:"Associate Consultant · 2.2 years",p:"Validated ETL pipelines across 50+ interfaces on Spark and Databricks at 98% data accuracy, built AI classification models for compliance, and won the Client Extraordinaire Award.",act:[GO('See experience','experience')]},
    {when:"Sep 2026 – Sep 2027 · London",t:"Queen Mary University of London",s:"MSc Data Science",p:"Now studying machine learning, NLP and big data while building agentic AI systems. Open to full-time data science, ML and AI roles from September 2027.",act:[CV,MAIL]}
  ];
  function esc(x){return String(x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function journeyStep(i,q){var st=STEPS[i],r=botRow(),m=r.querySelector('.msg');m.classList.add('rich','jcard');
    var dots='';for(var k=0;k<STEPS.length;k++)dots+='<i class="'+(k<i?'done':k===i?'now':'')+'"></i>';
    m.innerHTML='<div class="jtop"><span class="jnum">Step '+(i+1)+' of '+STEPS.length+'</span><span class="jdots">'+dots+'</span></div>'
      +'<span class="jwhen">'+esc(st.when)+'</span><b class="jt">'+esc(st.t)+'</b><span class="js">'+esc(st.s)+'</span><p>'+esc(st.p)+'</p>';
    scrollLog();
    if(i<STEPS.length-1){addActions(r,st.act);var w=r.querySelector('.acts');if(!w){w=document.createElement('div');w.className='acts';r.querySelector('.bcol').appendChild(w)}
      var nx=document.createElement('button');nx.type='button';nx.className='jnext';nx.textContent='Next: '+STEPS[i+1].t+' \u2192';
      nx.addEventListener('click',function(){nx.remove();journeyStep(i+1,q)});w.appendChild(nx);busy=false;scrollLog()}
    else{T.journey.act=st.act;finish(r,'journey',q)}}
  function factsCard(r,q){var m=r.querySelector('.msg');m.classList.remove('dots');m.classList.add('rich','fcard');
    var F=[["Location","London, UK · open to relocating"],["Available","Full-time from Sep 2027"],["Studying","MSc Data Science, Queen Mary"],
      ["Degree","B.Tech CSE – Data Science · 8.82 CGPA"],["Experience","2.2 yrs EY + 1.2 yrs internships"],["Certified","Databricks Data Engineer Associate"]];
    m.innerHTML='<b class="ft">Manju Swaroop · quick facts</b><div class="fgrid">'+F.map(function(f){return '<div><span>'+esc(f[0])+'</span><b>'+esc(f[1])+'</b></div>'}).join('')+'</div>'
      +'<div class="fskills"><span>Top skills</span>'+['Python','SQL','Spark','Databricks','PyTorch','LangChain'].map(function(x){return '<em>'+x+'</em>'}).join('')+'</div>';
    finish(r,'facts',q)}
  function answerLocal(q,key){
    if(key==='journey'){journeyStep(0,q);return}
    var r=botRow();typing(r);
    if(key==='facts'){setTimeout(function(){factsCard(r,q)},380);return}
    setTimeout(function(){typeOut(r,T[key].a,function(){finish(r,key,q)})},420)}

  function ask(q,forceKey){
    q=q.trim();if(!q||busy)return;
    busy=true;chips.hidden=true;userMsg(q);var key=forceKey||topicOf(q);
    if(key==='pitch'){pitchUsed=true;pitchBtn.hidden=true;hideNudge()}
    document.querySelectorAll('.tool-row [data-key="'+key+'"]').forEach(function(b){b.hidden=true});
    if(key!=='unknown'&&key!=='hi')askedTopics[key]=1;
    if(key.indexOf('role_')===0){var rr=document.querySelector('.roles');if(rr)rr.hidden=true}
    tidyTools();
    if(!sample||key==='pitch'||key==='hi'||key==='book'||key==='journey'||key==='facts'||key.indexOf('role_')===0){answerLocal(q,key);return}
    turns.push({role:'user',content:q});
    var r=botRow();typing(r);var b=r.querySelector('.msg');
    sample(turns.slice(-10),{cache:false,modelTier:'quick',onText:function(o){b.classList.remove('dots');b.textContent=o.text;scrollLog()}})
      .then(function(res){b.classList.remove('dots');b.textContent=res.text;turns.push({role:'assistant',content:res.text});finish(r,key==='unknown'?topicOf(res.text):key,q)})
      .catch(function(){turns.pop();r.remove();answerLocal(q,key)});
  }

  // ---- topics menu
  var TQ={journey:"Walk me through his journey",facts:"Show me the quick facts",exp:"Tell me about his experience",research:"Tell me about his research",projects:"What projects has he built?",skills:"What are his skills?",
    edu:"Tell me about his education",certs:"What certifications does he have?",awards:"What awards has he won?",volunteer:"Has he done any volunteering?",contact:"How can I contact him?"};
  var tmenu=document.getElementById('topic-menu'),tbtn=document.getElementById('topics-btn');
  function syncTopics(){var left=0;tmenu.querySelectorAll('button[data-topic]').forEach(function(b){var used=!!askedTopics[b.getAttribute('data-topic')];b.hidden=used;if(!used)left++});
    var roleDone=Object.keys(askedTopics).some(function(k){return k.indexOf('role_')===0||k==='fit'}),tr=document.getElementById('tm-roles');
    if(tr){tr.hidden=roleDone;if(!roleDone)left++}
    tmenu.querySelector('.tm-h').hidden=!tmenu.querySelector('button[data-topic]:not([hidden])');
    tbtn.hidden=left===0;if(left===0)closeTopics()}
  function closeTopics(){tmenu.hidden=true;tbtn.setAttribute('aria-expanded','false')}
  tbtn.addEventListener('click',function(e){e.stopPropagation();syncTopics();var open=tmenu.hidden;tmenu.hidden=!open;tbtn.setAttribute('aria-expanded',String(open));
    if(open){var f=tmenu.querySelector('button:not([hidden])');if(f)f.focus()}});
  tmenu.addEventListener('click',function(e){
    var rb=e.target.closest('button[data-role]');
    if(rb){var r=rb.textContent,an=/^[AEIOU]/.test(r)?'an ':'a ';closeTopics();ask('Why does Manju fit '+an+r+' role?',rb.getAttribute('data-role'));syncTopics();return}
    var b=e.target.closest('button[data-topic]');if(!b)return;var k=b.getAttribute('data-topic');closeTopics();ask(TQ[k],k);syncTopics()});
  document.addEventListener('click',function(e){if(!tmenu.hidden&&!tmenu.contains(e.target)&&e.target!==tbtn)closeTopics()});
  tmenu.addEventListener('keydown',function(e){if(e.key==='Escape'){e.stopPropagation();closeTopics();tbtn.focus()}});

  // ---- voice questions (Chrome / Edge)
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition,mic=document.getElementById('mic-btn'),rec=null,listening=false,heard='';
  if(SR){mic.hidden=false;
    mic.addEventListener('click',function(){
      if(listening){rec&&rec.stop();return}
      try{rec=new SR()}catch(err){mic.hidden=true;return}
      rec.lang='en-GB';rec.interimResults=true;rec.maxAlternatives=1;heard='';
      rec.onstart=function(){listening=true;mic.classList.add('rec');mic.setAttribute('aria-pressed','true');inp.placeholder='Listening…'};
      rec.onresult=function(ev){var t='';for(var i=0;i<ev.results.length;i++)t+=ev.results[i][0].transcript;heard=t;inp.value=t};
      rec.onerror=function(ev){if(ev.error==='not-allowed'||ev.error==='service-not-allowed'){mic.hidden=true;inp.placeholder='Microphone is blocked here. Type your question instead.'}};
      rec.onend=function(){listening=false;mic.classList.remove('rec');mic.setAttribute('aria-pressed','false');
        if(inp.placeholder==='Listening…')inp.placeholder='Ask a question…';
        var q=heard.trim();if(q){inp.value='';ask(q)}};
      rec.start()});
  }
  form.addEventListener('submit',function(e){e.preventDefault();var v=inp.value;inp.value='';ask(v)});
  chips.addEventListener('click',function(e){if(e.target.tagName==='BUTTON')ask(e.target.textContent)});
  pitchBtn.addEventListener('click',function(){ask('Give me the 30-second pitch','pitch')});
  document.getElementById('journey-btn').addEventListener('click',function(){ask('Walk me through his journey','journey')});
  document.getElementById('facts-btn').addEventListener('click',function(){ask('Show me the quick facts','facts')});
  document.querySelectorAll('.roles button').forEach(function(b){b.addEventListener('click',function(){
    var r=b.textContent,an=/^[AEIOU]/.test(r)?'an ':'a ';ask('Why does Manju fit '+an+r+' role?',b.getAttribute('data-role'))})});
  document.addEventListener('keydown',function(e){
    if(e.key!=='/'||e.ctrlKey||e.metaKey||e.altKey)return;
    var t=e.target,tag=(t&&t.tagName)||'';
    if(t===inp){if(inp.value!=='')return;e.preventDefault();toggleChat(false);fab.focus();return}
    if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT'||(t&&t.isContentEditable))return;
    e.preventDefault();if(chat.hidden){toggleChat(true)}else{toggleChat(false);fab.focus()}});

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
