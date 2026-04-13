const BLK = '_';
const MAX_STEPS = 3000;
const NS = 'http://www.w3.org/2000/svg';

const MDEF = {
  palindrome:{
    label:'Palindrome  { w = wᴿ | w ∈ {0,1}* }',
    states:['q0','q1','q2','q3','q4','q5','qacc','qrej'],
    ia:['0','1'], ta:['0','1','X','Y','_'],
    q0:'q0', qa:'qacc', qr:'qrej',
    d:{
      'q0,0':['q2','X','R'],'q0,1':['q3','X','R'],
      'q0,X':['qacc','X','R'],'q0,Y':['qacc','Y','R'],'q0,_':['qacc','_','R'],
      'q2,0':['q2','0','R'],'q2,1':['q2','1','R'],'q2,X':['q2','X','R'],'q2,Y':['q2','Y','R'],'q2,_':['q4','_','L'],
      'q3,0':['q3','0','R'],'q3,1':['q3','1','R'],'q3,X':['q3','X','R'],'q3,Y':['q3','Y','R'],'q3,_':['q5','_','L'],
      'q4,0':['q1','Y','L'],'q4,Y':['q4','Y','L'],'q4,X':['qacc','X','R'],'q4,1':['qrej','1','R'],
      'q5,1':['q1','Y','L'],'q5,Y':['q5','Y','L'],'q5,X':['qacc','X','R'],'q5,0':['qrej','0','R'],
      'q1,0':['q1','0','L'],'q1,1':['q1','1','L'],'q1,X':['q0','X','R'],'q1,Y':['q1','Y','L'],
    },
    tests:[{i:'0110',e:'accept'},{i:'101',e:'accept'},{i:'',e:'accept'},{i:'0',e:'accept'},{i:'01',e:'reject'},{i:'0100',e:'reject'},{i:'1001',e:'accept'}]
  },
  equal01:{
    label:'Equal #0s and #1s',
    states:['q0','q1','q2','q3','q4','qacc','qrej'],
    ia:['0','1'],ta:['0','1','X','Y','_'],
    q0:'q0',qa:'qacc',qr:'qrej',
    d:{
      'q0,0':['q1','X','R'],'q0,1':['q2','Y','R'],
      'q0,X':['q0','X','R'],'q0,Y':['q0','Y','R'],'q0,_':['qacc','_','R'],
      'q1,0':['q1','0','R'],'q1,1':['q3','Y','L'],'q1,X':['q1','X','R'],'q1,Y':['q1','Y','R'],'q1,_':['qrej','_','R'],
      'q2,1':['q2','1','R'],'q2,0':['q4','X','L'],'q2,X':['q2','X','R'],'q2,Y':['q2','Y','R'],'q2,_':['qrej','_','R'],
      'q3,0':['q3','0','L'],'q3,1':['q3','1','L'],'q3,X':['q0','X','R'],'q3,Y':['q3','Y','L'],'q3,_':['q0','_','R'],
      'q4,0':['q4','0','L'],'q4,1':['q4','1','L'],'q4,X':['q0','X','R'],'q4,Y':['q4','Y','L'],'q4,_':['q0','_','R'],
    },
    tests:[{i:'01',e:'accept'},{i:'0011',e:'accept'},{i:'0101',e:'accept'},{i:'',e:'accept'},{i:'001',e:'reject'},{i:'0111',e:'reject'},{i:'1100',e:'accept'}]
  },
  anbn:{
    label:'aⁿbⁿ  { aⁿbⁿ | n ≥ 1 }',
    states:['q0','q1','q2','q3','qacc','qrej'],
    ia:['a','b'],ta:['a','b','X','Y','_'],
    q0:'q0',qa:'qacc',qr:'qrej',
    d:{
      'q0,a':['q1','X','R'],'q0,Y':['q3','Y','R'],'q0,_':['qrej','_','R'],'q0,b':['qrej','b','R'],
      'q1,a':['q1','a','R'],'q1,b':['q2','Y','L'],'q1,Y':['q1','Y','R'],'q1,_':['qrej','_','R'],
      'q2,a':['q2','a','L'],'q2,X':['q0','X','R'],'q2,Y':['q2','Y','L'],
      'q3,Y':['q3','Y','R'],'q3,_':['qacc','_','R'],'q3,b':['qrej','b','R'],
    },
    tests:[{i:'ab',e:'accept'},{i:'aabb',e:'accept'},{i:'aaabbb',e:'accept'},{i:'a',e:'reject'},{i:'aab',e:'reject'},{i:'ba',e:'reject'},{i:'',e:'reject'}]
  },
  anbncn:{
    label:'aⁿbⁿcⁿ  { aⁿbⁿcⁿ | n ≥ 1 }',
    states:['q0','q1','q2','q3','q4','qacc','qrej'],
    ia:['a','b','c'],ta:['a','b','c','X','Y','Z','_'],
    q0:'q0',qa:'qacc',qr:'qrej',
    d:{
      'q0,a':['q1','X','R'],'q0,Y':['q4','Y','R'],'q0,_':['qrej','_','R'],'q0,b':['qrej','b','R'],'q0,Z':['qrej','Z','R'],
      'q1,a':['q1','a','R'],'q1,Y':['q1','Y','R'],'q1,b':['q2','Y','R'],'q1,_':['qrej','_','R'],
      'q2,b':['q2','b','R'],'q2,Z':['q2','Z','R'],'q2,c':['q3','Z','L'],'q2,_':['qrej','_','R'],
      'q3,a':['q3','a','L'],'q3,b':['q3','b','L'],'q3,Y':['q3','Y','L'],'q3,Z':['q3','Z','L'],'q3,X':['q0','X','R'],
      'q4,Y':['q4','Y','R'],'q4,Z':['q4','Z','R'],'q4,_':['qacc','_','R'],'q4,b':['qrej','b','R'],'q4,c':['qrej','c','R'],
    },
    tests:[{i:'abc',e:'accept'},{i:'aabbcc',e:'accept'},{i:'aaabbbccc',e:'accept'},{i:'aabb',e:'reject'},{i:'aabbccc',e:'reject'},{i:'ab',e:'reject'}]
  },
  even0:{
    label:'Even Number of 0s',
    states:['qe','qo','qacc','qrej'],
    ia:['0','1'],ta:['0','1','_'],
    q0:'qe',qa:'qacc',qr:'qrej',
    d:{
      'qe,0':['qo','0','R'],'qe,1':['qe','1','R'],'qe,_':['qacc','_','R'],
      'qo,0':['qe','0','R'],'qo,1':['qo','1','R'],'qo,_':['qrej','_','R'],
    },
    tests:[{i:'',e:'accept'},{i:'00',e:'accept'},{i:'0011',e:'accept'},{i:'1001',e:'accept'},{i:'0',e:'reject'},{i:'010',e:'reject'}]
  },
  ww:{
    label:'ww  { ww | w ∈ {0,1}* }',
    states:['start','qacc','qrej'],
    ia:['0','1'],ta:['0','1','_'],
    q0:'start',qa:'qacc',qr:'qrej',d:{},algo:true,
    sim(s){if(s.length%2!==0)return'reject';return s.slice(0,s.length/2)===s.slice(s.length/2)?'accept':'reject';},
    tests:[{i:'0101',e:'accept'},{i:'1010',e:'accept'},{i:'0000',e:'accept'},{i:'',e:'accept'},{i:'01',e:'reject'},{i:'001',e:'reject'},{i:'0110',e:'reject'}]
  },
  prime:{
    label:'Prime Length Strings',
    states:['start','qacc','qrej'],
    ia:['0','1'],ta:['0','1','_'],
    q0:'start',qa:'qacc',qr:'qrej',d:{},algo:true,
    sim(s){const n=s.length;if(n<2)return'reject';for(let i=2;i<=Math.sqrt(n);i++)if(n%i===0)return'reject';return'accept';},
    tests:[{i:'01',e:'accept'},{i:'010',e:'accept'},{i:'01010',e:'accept'},{i:'',e:'reject'},{i:'0',e:'reject'},{i:'0000',e:'reject'}]
  },
  arith:{
    label:'Valid Arithmetic Expressions',
    states:['start','qacc','qrej'],
    ia:['0-9','+','-','*','/','(',')'],ta:['0-9','+','-','*','/','(',')','.','_'],
    q0:'start',qa:'qacc',qr:'qrej',d:{},algo:true,
    sim(s){
      if(!s.trim())return'reject';
      if(/[^0-9+\-*/().\s]/.test(s))return'reject';
      let d=0;for(const c of s){if(c==='(')d++;if(c===')')d--;if(d<0)return'reject';}
      if(d!==0)return'reject';
      try{const r=new Function('return '+s)();return(typeof r==='number'&&isFinite(r))?'accept':'reject';}
      catch(e){return'reject';}
    },
    tests:[{i:'1+2',e:'accept'},{i:'(3+4)*2',e:'accept'},{i:'10/2+3',e:'accept'},{i:'1+',e:'reject'},{i:'(1+2',e:'reject'},{i:'abc',e:'reject'}]
  }
};

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
let M=null, tape=[], head=0, curState='', stepN=0, halted=false, running=false, timer=null, lastEK=null;

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
(function(){
  const sel=document.getElementById('lsel');
  Object.entries(MDEF).forEach(([k,v])=>{
    const o=document.createElement('option');
    o.value=k;o.textContent=v.label;sel.appendChild(o);
  });
  onLangChange();
})();

function onLangChange(){
  const k=document.getElementById('lsel').value;
  renderTCs(k);
  document.getElementById('hbadge').textContent=MDEF[k].label;
}

function renderTCs(k){
  const m=MDEF[k],c=document.getElementById('tcs');
  c.innerHTML='';
  (m.tests||[]).forEach(tc=>{
    const d=document.createElement('div');d.className='tci';
    d.innerHTML=`<span class="tcstr">${tc.i===''?'ε (empty)':tc.i}</span><span class="tcbadge tc${tc.e[0]}">${tc.e}</span>`;
    d.onclick=()=>{document.getElementById('instr').value=tc.i;loadM();};
    c.appendChild(d);
  });
}

// ══════════════════════════════════════════════
// LOAD
// ══════════════════════════════════════════════
function loadM(){
  stopRun();
  const k=document.getElementById('lsel').value;
  M=MDEF[k];
  const inp=document.getElementById('instr').value;
  tape=inp===''?[BLK]:[...inp,BLK];
  head=0;curState=M.q0;stepN=0;halted=false;lastEK=null;
  setSt('');
  updateInfo();
  renderTable();
  renderDiagram();
  renderTape();
  updateStepPill();
  clearLog();
  addLog(`Loaded: ${M.label}`,'');
  addLog(`Input: "${inp}"`,'');
  document.getElementById('bstep').disabled=false;
  document.getElementById('brun').disabled=false;
  document.getElementById('breset').disabled=false;
}

// ══════════════════════════════════════════════
// STEP
// ══════════════════════════════════════════════
function doStep(){
  if(!M||halted)return;
  if(stepN>MAX_STEPS){halted=true;setSt('loop');addLog('∞ LOOP — max steps','lrej');stopRun();return;}

  if(M.algo){
    const inp=tape.filter(c=>c!==BLK).join('');
    const res=M.sim(inp);
    stepN=inp.length;curState=res==='accept'?M.qa:M.qr;
    halted=true;updateStepPill();renderTape();setSt(res);
    addLog(`Result: ${res.toUpperCase()}`,res==='accept'?'lacc':'lrej');
    hlNode(curState);stopRun();return;
  }

  const sym=tape[head]!==undefined?tape[head]:BLK;
  const key=`${curState},${sym}`;
  const tr=M.d[key];

  if(!tr){
    addLog(`No δ(${curState}, ${sym}) → REJECT`,'lrej');
    curState=M.qr;halted=true;setSt('reject');hlNode(curState);renderTape();stopRun();return;
  }

  const prev=curState;
  addLog(`δ(${curState}, ${sym}) → (${tr[0]}, ${tr[1]}, ${tr[2]})`,'lcur');
  lastEK=`${curState}__${tr[0]}`;

  const whead=head;
  tape[head]=tr[1];
  curState=tr[0];
  head+=tr[2]==='R'?1:-1;
  if(head<0)head=0;
  if(head>=tape.length)tape.push(BLK);

  stepN++;
  updateStepPill();
  renderTape(whead);
  hlNode(curState);
  hlEdge(prev,tr[0]);
  hlTableRow(key);

  if(curState===M.qa){halted=true;setSt('accept');addLog('✓ ACCEPTED','lacc');stopRun();}
  else if(curState===M.qr){halted=true;setSt('reject');addLog('✗ REJECTED','lrej');stopRun();}
}

function doRun(){
  if(!M||halted)return;
  running=true;
  document.getElementById('brun').disabled=true;
  document.getElementById('bpause').disabled=false;
  if(!halted)setSt('running');
  const spd=2080-parseInt(document.getElementById('spd').value);
  timer=setInterval(()=>{if(!halted)doStep();else stopRun();},spd);
}
function doPause(){stopRun();if(!halted)setSt('');}
function stopRun(){
  clearInterval(timer);running=false;
  document.getElementById('brun').disabled=!M||halted;
  document.getElementById('bpause').disabled=true;
}
function doReset(){
  if(!M)return;stopRun();
  const inp=document.getElementById('instr').value;
  tape=inp===''?[BLK]:[...inp,BLK];
  head=0;curState=M.q0;stepN=0;halted=false;lastEK=null;
  setSt('');clearLog();renderTape();updateStepPill();hlNode(curState);clrEdge();clrTableHL();
  document.getElementById('bstep').disabled=false;
  document.getElementById('brun').disabled=false;
}

// ══════════════════════════════════════════════
// TAPE RENDER
// ══════════════════════════════════════════════
function renderTape(written=-1){
  const track=document.getElementById('tptrack');
  track.innerHTML='';
  const vs=Math.max(0,head-7);
  const ve=Math.max(tape.length+3,head+14);
  for(let i=vs;i<ve;i++){
    const sym=i<tape.length?tape[i]:BLK;
    const cell=document.createElement('div');
    cell.className='tpcell';
    if(sym===BLK||sym===undefined)cell.classList.add('blank');
    if(i===head)cell.classList.add('hd');
    if(i===written&&i!==head)cell.classList.add('flash');
    const ci=document.createElement('div');ci.className='ci';ci.textContent=i;
    cell.appendChild(ci);
    const s=document.createElement('span');
    s.textContent=sym!==undefined?sym:BLK;cell.appendChild(s);
    track.appendChild(cell);
  }
  // auto-scroll
  const scroll=document.getElementById('tpscroll');
  const hi=head-vs;
  const cells=track.children;
  if(cells[hi]){
    const cLeft=cells[hi].offsetLeft;
    scroll.scrollLeft=Math.max(0,cLeft-scroll.clientWidth/2+20);
  }
}

function updateStepPill(){document.getElementById('stpp').textContent=`STEP ${stepN}`;}

// ══════════════════════════════════════════════
// STATUS
// ══════════════════════════════════════════════
function setSt(s){
  const el=document.getElementById('stbadge');
  el.className='';
  if(s==='accept'){el.className='sh sacc';el.textContent='✓  ACCEPTED';}
  else if(s==='reject'){el.className='sh srej';el.textContent='✗  REJECTED';}
  else if(s==='running'){el.className='sh srun';el.textContent='⟳  RUNNING';}
  else if(s==='loop'){el.className='sh slp';el.textContent='∞  LOOP DETECTED';}
}

// ══════════════════════════════════════════════
// MACHINE INFO
// ══════════════════════════════════════════════
function updateInfo(){
  if(!M)return;
  document.getElementById('ii-s').textContent=M.states.join(', ');
  document.getElementById('ii-a').textContent=M.ia.join(', ');
  document.getElementById('ii-t').textContent=M.ta.join(', ');
  document.getElementById('ii-q0').textContent=M.q0;
  document.getElementById('ii-qa').textContent=M.qa;
  document.getElementById('ii-qr').textContent=M.qr;
  document.getElementById('ii-d').textContent=M.algo?'Algorithmic':Object.keys(M.d).length;
}

// ══════════════════════════════════════════════
// TRANSITION TABLE
// ══════════════════════════════════════════════
function renderTable(){
  const w=document.getElementById('tblwrap'),dc=document.getElementById('dcnt');
  if(!M||M.algo){
    w.innerHTML=`<div class="anote">This language uses <strong>algorithmic simulation</strong>.<br>No explicit δ table is generated.</div>`;
    dc.textContent='—';return;
  }
  const ents=Object.entries(M.d);dc.textContent=ents.length;
  let h=`<table class="tt"><thead><tr><th>State</th><th>Read</th><th>→ State</th><th>Write</th><th>Move</th></tr></thead><tbody>`;
  ents.forEach(([key,tr])=>{
    const[s,sym]=key.split(',');
    h+=`<tr data-key="${key}"><td>${s}</td><td>${sym}</td><td>${tr[0]}</td><td>${tr[1]}</td><td class="mv${tr[2]}">${tr[2]}</td></tr>`;
  });
  h+='</tbody></table>';w.innerHTML=h;
}
function hlTableRow(key){
  document.querySelectorAll('.tt tr').forEach(r=>r.classList.remove('arow'));
  const row=document.querySelector(`.tt tr[data-key="${CSS.escape(key)}"]`);
  if(row){row.classList.add('arow');row.scrollIntoView({block:'nearest',behavior:'smooth'});}
}
function clrTableHL(){document.querySelectorAll('.tt tr').forEach(r=>r.classList.remove('arow'));}

// ══════════════════════════════════════════════
// LOG
// ══════════════════════════════════════════════
function addLog(msg,cls){
  const c=document.getElementById('logent'),d=document.createElement('div');
  d.className=`lrow ${cls}`;
  d.innerHTML=`<span class="sn">[${stepN}]</span>${msg}`;
  c.insertBefore(d,c.firstChild);
  while(c.children.length>80)c.removeChild(c.lastChild);
}
function clearLog(){document.getElementById('logent').innerHTML='';}

// ══════════════════════════════════════════════
// SVG DIAGRAM
// ══════════════════════════════════════════════
const NR=28;
function mkSVG(tag,attrs={}){
  const el=document.createElementNS(NS,tag);
  for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);
  return el;
}

function renderDiagram(){
  const svg=document.getElementById('svgd');
  svg.innerHTML='';
  if(!M)return;

  const W=svg.clientWidth||600, H=svg.clientHeight||400;
  if(W<10||H<10)return; // not yet rendered

  // Defs
  const defs=mkSVG('defs');
  const mkArr=(id,col)=>{
    const m=mkSVG('marker',{id,markerWidth:'10',markerHeight:'7',refX:'9',refY:'3.5',orient:'auto'});
    m.appendChild(mkSVG('polygon',{points:'0 0, 10 3.5, 0 7',fill:col}));
    return m;
  };
  defs.appendChild(mkArr('an','#3a4a68'));
  defs.appendChild(mkArr('aa','#4f8ef7'));
  svg.appendChild(defs);

  const states=M.states, n=states.length;
  const cx=W/2, cy=H/2;
  const R=Math.min(W*0.4,H*0.38);

  // Positions
  const pos={};
  if(n===1){pos[states[0]]={x:cx,y:cy};}
  else{
    states.forEach((s,i)=>{
      const ang=(2*Math.PI*i/n)-Math.PI/2;
      pos[s]={x:cx+R*Math.cos(ang),y:cy+R*Math.sin(ang)};
    });
  }

  // Build edge map
  const emap={};
  if(!M.algo){
    for(const[key,tr]of Object.entries(M.d)){
      const[s,sym]=key.split(',');
      const ek=`${s}__${tr[0]}`;
      if(!emap[ek])emap[ek]={from:s,to:tr[0],labels:[]};
      emap[ek].labels.push(`${sym}→${tr[1]},${tr[2]}`);
    }
  }

  const eg=mkSVG('g',{id:'eg'}), lg=mkSVG('g',{id:'lg'});

  for(const[ek,e]of Object.entries(emap)){
    const fp=pos[e.from],tp=pos[e.to];
    if(!fp||!tp)continue;
    const self=e.from===e.to;
    const path=mkSVG('path',{'class':'epath','data-ek':ek,'marker-end':'url(#an)'});
    let d,lx,ly;

    if(self){
      const ang=Math.atan2(fp.y-cy,fp.x-cx);
      const ox=Math.cos(ang)*48,oy=Math.sin(ang)*48;
      const ex=fp.x+ox,ey=fp.y+oy;
      const p1x=fp.x+NR*Math.cos(ang-0.55),p1y=fp.y+NR*Math.sin(ang-0.55);
      const p2x=fp.x+NR*Math.cos(ang+0.55),p2y=fp.y+NR*Math.sin(ang+0.55);
      d=`M ${p1x} ${p1y} C ${ex-20} ${ey-20}, ${ex+20} ${ey-20}, ${p2x} ${p2y}`;
      lx=ex;ly=ey-30;
    } else {
      const dx=tp.x-fp.x,dy=tp.y-fp.y,dist=Math.sqrt(dx*dx+dy*dy);
      const ux=dx/dist,uy=dy/dist;
      const perp=26,px=-uy*perp,py=ux*perp;
      const sx=fp.x+ux*NR,sy=fp.y+uy*NR;
      const ex=tp.x-ux*NR,ey=tp.y-uy*NR;
      const mx=(sx+ex)/2+px,my=(sy+ey)/2+py;
      d=`M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`;
      lx=mx;ly=my-8;
    }
    path.setAttribute('d',d);
    eg.appendChild(path);

    const ltext=e.labels.length>2?e.labels.slice(0,2).join(' | ')+'…':e.labels.join(' | ');
    const lbl=mkSVG('text',{'class':'elbl','data-ek':ek,x:lx,y:ly,'text-anchor':'middle'});
    lbl.textContent=ltext;lg.appendChild(lbl);
  }

  svg.appendChild(eg);svg.appendChild(lg);

  // Algo label
  if(M.algo){
    const t=mkSVG('text',{x:cx,y:cy+R+40,'text-anchor':'middle',fill:'#4a5870','font-family':'JetBrains Mono, monospace','font-size':'12'});
    t.textContent='[ Algorithmic simulation ]';svg.appendChild(t);
  }

  // Nodes
  const ng=mkSVG('g',{id:'ng'});
  states.forEach(s=>{
    const p=pos[s];
    const g=mkSVG('g',{'data-state':s});

    // Accept double ring
    if(s===M.qa){
      g.appendChild(mkSVG('circle',{cx:p.x,cy:p.y,r:NR+7,fill:'none',stroke:'#3dba74','stroke-width':'1.5',opacity:'0.55'}));
    }

    let sc='#3a4a68';
    if(s===M.qa)sc='#3dba74';
    else if(s===M.qr)sc='#e05c5c';
    if(s===curState)sc='#4f8ef7';

    const fill=mkSVG('circle',{
      cx:p.x,cy:p.y,r:NR,'class':'nfill'+(s===M.qa?' acc':s===M.qr?' rej':s===curState?' cur':''),
      stroke:sc,'stroke-width':s===curState?'3':'2'
    });
    g.appendChild(fill);

    const lbl=mkSVG('text',{x:p.x,y:p.y,'class':'nlbl'+(s===curState?' cur':'')});
    lbl.textContent=s;g.appendChild(lbl);
    ng.appendChild(g);
  });

  // Start arrow
  const sp=pos[M.q0];
  if(sp){
    svg.appendChild(mkSVG('line',{
      x1:sp.x-NR-34,y1:sp.y,x2:sp.x-NR-2,y2:sp.y,
      stroke:'#4f8ef7','stroke-width':'2','marker-end':'url(#aa)'
    }));
  }
  svg.appendChild(ng);
}

function hlNode(s){
  document.querySelectorAll('#ng g').forEach(g=>{
    const ns=g.getAttribute('data-state');
    const fill=g.querySelector('.nfill'),lbl=g.querySelector('.nlbl');
    if(!fill||!lbl)return;
    fill.classList.remove('cur');lbl.classList.remove('cur');
    let sc='#3a4a68';
    if(ns===M.qa)sc='#3dba74';
    else if(ns===M.qr)sc='#e05c5c';
    fill.setAttribute('stroke',sc);fill.setAttribute('stroke-width','2');
    if(ns===s){
      fill.classList.add('cur');lbl.classList.add('cur');
      fill.setAttribute('stroke','#4f8ef7');fill.setAttribute('stroke-width','3');
    }
  });
}

function hlEdge(from,to){
  clrEdge();
  const ek=`${from}__${to}`;
  const path=document.querySelector(`.epath[data-ek="${CSS.escape(ek)}"]`);
  const lbl=document.querySelector(`.elbl[data-ek="${CSS.escape(ek)}"]`);
  if(path){path.classList.add('act');path.setAttribute('marker-end','url(#aa)');}
  if(lbl)lbl.classList.add('act');
}
function clrEdge(){
  document.querySelectorAll('.epath').forEach(p=>{p.classList.remove('act');p.setAttribute('marker-end','url(#an)');});
  document.querySelectorAll('.elbl').forEach(l=>l.classList.remove('act'));
}

// ══════════════════════════════════════════════
// RESIZE OBSERVER — redraw diagram on resize
// ══════════════════════════════════════════════
new ResizeObserver(()=>{if(M)renderDiagram();}).observe(document.getElementById('diagpanel'));

// ══════════════════════════════════════════════
// DRAG-RESIZE right panel
// ══════════════════════════════════════════════
(function(){
  const h=document.getElementById('rzh'),rp=document.getElementById('rp');
  let drag=false,sx=0,sw=0;
  h.addEventListener('mousedown',e=>{drag=true;sx=e.clientX;sw=rp.offsetWidth;document.body.style.cursor='col-resize';e.preventDefault();});
  window.addEventListener('mousemove',e=>{if(!drag)return;const nw=Math.max(200,Math.min(520,sw+(sx-e.clientX)));rp.style.width=nw+'px';});
  window.addEventListener('mouseup',()=>{if(drag){drag=false;document.body.style.cursor='';if(M)renderDiagram();}});
})();

// Initial state
renderDiagram();