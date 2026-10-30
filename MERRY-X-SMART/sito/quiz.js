// Contenuti dimostrativi: per ogni domanda è possibile impostare media:
// {type: 'image' o 'video', src: 'assets/nome-file', alt: 'Descrizione'}.
const questions = [
 {title:'Di che materiale sono fatti i mobili delle serie Selnova Square?',options:['Truciolato ad alta densità','MDF “Medium Density Fiberboard”','Legno massello','Marzapane'],correct:0,topic:'Giuseppe e i mobili Selnova Square',media:{type:'image',src:'assets/giuseppe-selnova-square.webp',alt:'Giuseppe con cuffie davanti al portatile, nella bottega con mobili e lavabo Selnova Square'}},
 {title:'Quali di questi AquaClean non ha il getto lady?',options:['Sela','Mera Classic','Alba','Tuma Comfort'],correct:2,topic:'Maria in smart working',media:{type:'image',src:'assets/maria-smart-working.webp',alt:'Maria con cuffie osserva uno smartphone nella grotta con WC moderno'}},
 {title:'Oro rosso, ottone e sabbia sono 3 finiture di quale placca?',options:['Sigma01','Sigma20','Sigma40','Sigma80'],correct:2,topic:'I Re Magi e le placche di comando',media:{type:'image',src:'assets/re-magi-placche.webp',alt:'I tre Re Magi con cuffie dorate davanti a un tavolo con placche di comando e un tablet',width:1672,height:819}},
 {title:"Per garantire la conformità alle norme sull'acqua potabile relative ad edifici residenziali e stalle i raccordi FlowFit sono in bronzo senza...",options:['Nichel','Piombo','Zuccheri aggiunti','Conservanti'],correct:1,topic:'L’asinello in smart working',media:{type:'image',src:'assets/asinello-smart-working.webp',alt:'Asinello con cuffie nella stalla, con un portatile e un secchio sotto il rubinetto',width:1672,height:941}},
 {title:"Nella stalla hanno installato 4 mangiaoie che scaricano (2,5 l/s) ed un WC. Quanto deve essere il diametro della colonna che le porta?",options:['90','110','125','160'],correct:1,topic:'Il bue in smart working',media:{type:'image',src:'assets/bue-smart-working.webp',alt:'Bue con cuffie nella stalla, davanti a un portatile e accanto alla tubazione di scarico della mangiatoia',width:1672,height:941}}
];
let index=0,selected=null,answers=[],started=false,confirmed=false;
const app=document.getElementById('app');
function media(q,finished=false){let inner=`<span class="media-tag">${finished?'SFIDA COMPLETATA':'SPAZIO FOTO / VIDEO'}</span><div class="art" aria-hidden="true"><span>${finished?'★':'?'}</span></div><div class="media-caption"><div><strong>${finished?'Cinque domande. Il tuo risultato.':q.topic}</strong><br>${finished?'Ogni tentativo è un nuovo inizio.':'Qui arriverà il contenuto della domanda.'}</div><span aria-hidden="true">↗</span></div>`;if(q?.media){const m=q.media;inner=m.type==='video'?`<video class="media-video" controls playsinline preload="metadata" aria-label="${m.alt}"><source src="${m.src}"></video>`:`<img class="media-image" src="${m.src}" alt="${m.alt}" width="${m.width||1672}" height="${m.height||941}" decoding="async">`;}return `<div class="visual"${q?.media?.height?` style="--media-ratio:${q.media.width}/${q.media.height}"`:""}>${inner}</div>`;}
function resultMessage(score){
 if(score===5)return {message:'Complimenti, sei pronto per essere il nuovo Junior PM.',instruction:'Riserva 3 numeri dal tabellone scrivendo il tuo nome.'};
 if(score>=3)return {message:'Non male ma serve più applicazione.',instruction:'Riserva 2 numeri dal tabellone scrivendo il tuo nome.'};
 if(score>=1)return {message:'Il minimo indispensabile, come un giorno di smart working a settimana.',instruction:'Riserva 1 numero dal tabellone scrivendo il tuo nome.'};
 return {message:'Ti aspettano 3 mesi di formazione a Manno senza smart working.',instruction:'Non puoi partecipare alla riffa finale.'};
}
function render(){
 if(!started){renderLanding();return;}
 const finished=index===questions.length;
 if(finished){const score=answers.filter((a,i)=>a===questions[i].correct).length;const result=resultMessage(score);app.innerHTML=`<div class="question-area result"><div class="intro-line"><div class="eyebrow"><i></i> IL TUO RISULTATO</div><div class="stepcount"><b>5</b> di 5 completate</div></div><div class="layout result-layout"><div class="final-visual"><img class="final-image" src="assets/presepe-pm-2026-finale.webp" alt="Presepe PM 2026: sei personaggi in pixel art in un’ambientazione natalizia" width="1536" height="1024" decoding="async"></div><section class="content"><div class="steps">${questions.map(()=>'<span class="step done"></span>').join('')}</div><div class="small-label">Hai completato il quiz</div><h1 class="result-title">Sfida completata!</h1><div class="score">${score}<small> / 5</small></div><p class="result-message">${result.message}</p><p class="result-instruction">${result.instruction}</p><div class="result-meta"><span class="pill">${score} corrette</span><span class="pill">${5-score} errate</span></div><div class="actions"><button class="primary" id="restart">Ricomincia <span aria-hidden="true">↻</span></button></div><p class="below">Il punteggio verrà azzerato e ripartirai dalla prima domanda.</p></section></div></div>`;document.getElementById('restart').onclick=restart;
 }else{const q=questions[index];app.innerHTML=`<div class="question-area"><div class="intro-line"><div class="eyebrow"><i></i> METTITI ALLA PROVA</div><div class="stepcount">Domanda <b>0${index+1}</b> / 05</div></div><div class="layout ${q.media?'media-question':''}">${media(q)}<section class="content" aria-labelledby="question"><div class="steps" aria-label="Domanda ${index+1} di 5">${questions.map((_,i)=>`<span class="step ${i<index?'done':i===index?'current':''}"></span>`).join('')}</div><div class="small-label">Domanda ${String(index+1).padStart(2,'0')}</div><h1 id="question" tabindex="-1">${q.title}</h1><p class="hint">Seleziona una risposta, poi premi Conferma risposta.</p><div class="options" role="group" aria-labelledby="question">${q.options.map((o,i)=>`<button class="option" data-option="${i}" aria-pressed="false"><span class="letter">${'ABCD'[i]}</span>${o}<span class="radio" aria-hidden="true"></span></button>`).join('')}</div><div id="feedback" class="feedback" role="status" aria-live="polite" hidden></div><div class="actions"><span class="lock"><span aria-hidden="true">⌑</span> Una domanda alla volta</span><button id="confirm" class="primary" disabled>Conferma risposta <span aria-hidden="true">✓</span></button><button id="next" class="primary" hidden>${index===4?'Scopri il risultato':'Prossima domanda'} <span aria-hidden="true">→</span></button></div><p class="below" id="instruction">Scegli una risposta per attivare la conferma.</p></section></div></div>`;
 app.querySelectorAll('[data-option]').forEach(button=>button.onclick=()=>{
 if(confirmed)return;
 selected=Number(button.dataset.option);
 app.querySelectorAll('[data-option]').forEach(b=>{
 const active=Number(b.dataset.option)===selected;
 b.classList.toggle('selected',active);
 b.setAttribute('aria-pressed',String(active));
 });
 document.getElementById('confirm').disabled=false;
 document.getElementById('instruction').textContent='Puoi cambiare scelta. Premi Conferma risposta per verificare.';
 });
 document.getElementById('confirm').onclick=()=>{
 if(selected===null||confirmed)return;
 confirmed=true;
 answers.push(selected);
 const correct=selected===q.correct;
 app.querySelectorAll('[data-option]').forEach(b=>{
 const option=Number(b.dataset.option),active=option===selected;
 b.disabled=true;
 b.classList.toggle('selected',active);
 b.classList.toggle('correct',option===q.correct);
 b.classList.toggle('incorrect',active&&!correct);
 b.setAttribute('aria-pressed',String(active));
 if(option===q.correct)b.querySelector('.radio').textContent='✓';
 else if(active)b.querySelector('.radio').textContent='×';
 });
 const feedback=document.getElementById('feedback');
 feedback.hidden=false;feedback.className='feedback '+(correct?'is-correct':'is-incorrect');
 feedback.innerHTML=`<strong>${correct?'Risposta corretta!':'Risposta sbagliata.'}</strong><span>${correct?'Esatto: ':'La risposta corretta è: '}<b>${q.options[q.correct]}</b>.</span>`;
 document.getElementById('confirm').hidden=true;
 document.getElementById('next').hidden=false;
 document.getElementById('next').focus();
 document.getElementById('instruction').textContent='Leggi il risultato, poi prosegui quando vuoi.';
 };
 document.getElementById('next').onclick=()=>{if(!confirmed)return;index++;selected=null;confirmed=false;render();window.scrollTo({top:0,behavior:'instant'});const heading=app.querySelector('h1');heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});};
 }
}
function restart(){index=0;selected=null;confirmed=false;answers=[];started=true;render();window.scrollTo({top:0,behavior:'instant'});const heading=app.querySelector('h1');heading.focus({preventScroll:true});}
function renderLanding(){
 app.innerHTML=`<div class="question-area landing"><div class="intro-line"><div class="eyebrow"><i></i> BENVENUTO ALLA SFIDA</div><div class="stepcount">5 domande · Una risposta alla volta</div></div><div class="layout"><div class="visual landing-visual"><img class="hero-art" src="assets/christmas-office.png" alt="Albero natalizio pixel art, laptop con cuffie, regali e una tazza calda"></div><section class="content landing-content"><div class="small-label">CHRISTMAS.EXE / PRONTO A GIOCARE?</div><h1>MERRY<br><span>X-SMART</span></h1><p class="landing-lead">Presepe dei PM.<br>Quest'anno in smart working.</p><p class="hint">Cinque domande, quattro opzioni e una sola risposta corretta. Seleziona e conferma ogni risposta, scopri se hai indovinato e arriva al tuo punteggio finale.</p><div class="landing-facts"><span><b>05</b> domande</span><span><b>04</b> opzioni</span><span><b>01</b> sfida</span></div><button class="primary" id="start">Inizia quiz <span aria-hidden="true">→</span></button><p class="below">Prenditi il tuo tempo. Si comincia dalla prima domanda.</p></section></div></div>`;
 document.getElementById('start').onclick=()=>{started=true;restart();};
}
render();
