(function(){
  const $ = (sel,ctx=document)=>ctx.querySelector(sel);
  const $$ = (sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));

  // Sample data
  const data = {
    moodTrend:[3,4,2,5,4,3,4], // 1-5 scale
    moodLabels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    weekly:[65,72,58,80,76,68,74],
    monthly:Array.from({length:30},()=>Math.round(50+Math.random()*40)),
    checkins:[
      {date:'Today 9:10a', status:'good', note:'Feeling energized after a good sleep.'},
      {date:'Yesterday', status:'neutral', note:'A bit overwhelmed with assignments.'},
      {date:'Mon', status:'low', note:'Headache, took a break and hydrated.'},
      {date:'Sun', status:'good', note:'Great walk with friends.'}
    ],
    notes:[
      'Focus on deep breathing between study blocks.',
      'Remember to drink water regularly today.',
      'Short walk after lunch to reset.'
    ],
    reminders:[
      {time:'Today 6:00 PM', title:'10-min meditation'},
      {time:'Tomorrow 7:30 AM', title:'Stretching routine'},
      {time:'Fri 8:00 PM', title:'Digital detox hour'}
    ],
    achievements:['7-day check-in streak','Completed 3 meditations','2hrs total mindful breaks'],
    relaxation:[{label:'Meditation', mins:25},{label:'Reading', mins:40},{label:'Breathing', mins:15},{label:'Walk', mins:30}]
  };

  // Render lists
  function renderCheckins(){
    const ul = $('#recentCheckins');
    ul.innerHTML = '';
    data.checkins.slice(0,6).forEach(item=>{
      const li = document.createElement('li');
      li.className = 'list-item';
      li.innerHTML = `
        <div>
          <div style="font-weight:600">${item.date}</div>
          <div style="color:#4B5563">${item.note}</div>
        </div>
        <span class="status ${item.status}">${labelForStatus(item.status)}</span>
      `;
      ul.appendChild(li);
    });
  }
  function labelForStatus(s){
    if(s==='good') return 'Positive';
    if(s==='neutral') return 'Neutral';
    return 'Low';
  }
  function renderNotes(){
    const wrap = $('#currentMoodNotes');
    wrap.innerHTML = '';
    data.notes.forEach(n=>{
      const div = document.createElement('div');
      div.className = 'note';
      div.textContent = n;
      wrap.appendChild(div);
    });
  }
  function renderReminders(){
    const ul = $('#selfCareReminders');
    ul.innerHTML = '';
    data.reminders.forEach(r=>{
      const li = document.createElement('li');
      li.className = 'list-item';
      li.innerHTML = `<span style="font-weight:600">${r.title}</span><span style="color:#4B5563">${r.time}</span>`;
      ul.appendChild(li);
    });
  }
  function renderAchievements(){
    const ul = $('#recentAchievements');
    ul.innerHTML = '';
    data.achievements.forEach(a=>{
      const li = document.createElement('li');
      li.className = 'badge';
      li.textContent = a;
      ul.appendChild(li);
    });
  }
  function renderRelaxation(){
    const wrap = $('#relaxationSummary');
    wrap.innerHTML = '';
    const total = data.relaxation.reduce((s,r)=>s+r.mins,0);
    data.relaxation.slice(0,4).forEach((r,i)=>{
      const div = document.createElement('div');
      div.className = 'stat' + (i%2? ' secondary':'');
      const pct = Math.round((r.mins/total)*100);
      div.textContent = `${r.label}: ${r.mins}m (${pct}%)`;
      wrap.appendChild(div);
    });
  }

  // Tiny canvas chart helpers (no library)
  function lineChart(canvasId, labels, values, color){
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.clientWidth;
    const h = canvas.height = canvas.clientHeight;
    const pad = 24;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = Math.max(1, max - min);

    // grid
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for(let i=0;i<=4;i++){
      const y = pad + ((h-2*pad) * i/4);
      ctx.beginPath();
      ctx.moveTo(pad,y);
      ctx.lineTo(w-pad,y);
      ctx.stroke();
    }

    // line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    values.forEach((v,idx)=>{
      const x = pad + (idx * (w-2*pad)/(values.length-1));
      const y = h - pad - ((v - min) * (h-2*pad)/range);
      if(idx===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.stroke();

    // points
    ctx.fillStyle = color;
    values.forEach((v,idx)=>{
      const x = pad + (idx * (w-2*pad)/(values.length-1));
      const y = h - pad - ((v - min) * (h-2*pad)/range);
      ctx.beginPath();
      ctx.arc(x,y,3,0,Math.PI*2);
      ctx.fill();
    });
  }

  function barChart(canvasId, labels, values, gradient){
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.clientWidth;
    const h = canvas.height = canvas.clientHeight;
    const pad = 24;
    const max = Math.max(...values, 100);

    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = '#E5E7EB';
    for(let i=0;i<=4;i++){
      const y = pad + ((h-2*pad) * i/4);
      ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(w-pad,y);ctx.stroke();
    }

    const barW = (w-2*pad)/values.length * 0.6;
    const gap = (w-2*pad)/values.length * 0.4;

    const grad = ctx.createLinearGradient(0,0,0,h);
    gradient.forEach(([stop,color])=>grad.addColorStop(stop,color));

    values.forEach((v,idx)=>{
      const x = pad + idx*(barW+gap);
      const barH = ((v/max)*(h-2*pad));
      const y = h - pad - barH;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x,y,barW,barH,6);
      ctx.fill();
    });
  }

  // Resize handling for responsive canvas
  function drawAll(){
    lineChart('moodTrendChart', data.moodLabels, data.moodTrend, '#8B5CF6');
    barChart('weeklyChart', data.moodLabels, data.weekly, [[0,'#A78BFA'],[1,'#C4B5FD']]);
    barChart('monthlyChart', Array.from({length:data.monthly.length},(_,i)=>i+1), data.monthly, [[0,'#FB923C'],[1,'#FDBA74']]);
  }
  window.addEventListener('resize', ()=>{ drawAll(); }, {passive:true});

  // Modals
  function openModal(id){
    const m = document.getElementById(id);
    if(!m) return;
    m.setAttribute('aria-hidden','false');
  }
  function closeModal(id){
    const m = document.getElementById(id);
    if(!m) return;
    m.setAttribute('aria-hidden','true');
  }
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if(t.matches('[data-close]')){
      closeModal(t.getAttribute('data-close'));
    }
  });

  // Buttons
  $('#open-chat-btn')?.addEventListener('click', ()=>openModal('chatModal'));
  $('#quick-open-chat-btn')?.addEventListener('click', ()=>openModal('chatModal'));
  $('#view-avatar-btn')?.addEventListener('click', ()=>openModal('avatarModal'));
  $('#new-checkin-btn')?.addEventListener('click', ()=>{
    data.checkins.unshift({date:'Just now', status:'good', note:'New quick mood check-in recorded.'});
    renderCheckins();
  });

  // Chat wired to backend
  $('#sendChat')?.addEventListener('click', sendChat);
  $('#chatText')?.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendChat(); });
  const chatHistory = [];
  async function sendChat(){
    const input = $('#chatText');
    const msg = input.value.trim();
    if(!msg) return;
    appendChat('You', msg);
    chatHistory.push({ role: 'user', content: msg });
    input.value='';

    try{
      const res = await fetch('/api/chat',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages: chatHistory })
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({error:'Request failed'}));
        throw new Error(err.error || 'Request failed');
      }
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || 'No response';
      chatHistory.push({ role: 'assistant', content: text });
      appendChat('AI Buddy', text);
    }catch(err){
      appendChat('System', `Error: ${err.message || err}`);
    }
  }
  function appendChat(author, text){
    const log = $('#chatLog');
    const wrap = document.createElement('div');
    wrap.style.marginBottom = '.5rem';
    wrap.innerHTML = `<div style="font-weight:600;color:#111827">${author}</div><div style="color:#4B5563">${text}</div>`;
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }

  // Init
  renderCheckins();
  renderNotes();
  renderReminders();
  renderAchievements();
  renderRelaxation();
  drawAll();
})();
