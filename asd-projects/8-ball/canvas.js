(() => {
  const canvas = document.getElementById('tbl');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const CUSHION = 26;
  const R = 10.5; // ball radius
  const FRICTION = 0.992;
  const MIN_SPEED = 0.045;
  const POCKET_R = 20;

  const pockets = [
    {x:CUSHION, y:CUSHION},
    {x:W/2, y:CUSHION-6},
    {x:W-CUSHION, y:CUSHION},
    {x:CUSHION, y:H-CUSHION},
    {x:W/2, y:H-CUSHION+6},
    {x:W-CUSHION, y:H-CUSHION},
  ];

  const BALL_COLORS = {
    1:'#e6b325', 2:'#1c4fbf', 3:'#c0272d', 4:'#5a3391',
    5:'#e0692b', 6:'#116a3a', 7:'#7a1f2b', 8:'#141414',
    9:'#e6b325', 10:'#1c4fbf', 11:'#c0272d', 12:'#5a3391',
    13:'#e0692b', 14:'#116a3a', 15:'#7a1f2b'
  };
  const STRIPE = n => n >= 9 && n <= 15;

  let balls = [];
  let cue = null;
  let aiming = false;
  let aimStart = null;
  let mousePos = {x:0,y:0};
  let potted = {solids:new Set(), stripes:new Set()};

  function rack(){
    balls = [];
    potted = {solids:new Set(), stripes:new Set()};
    cue = {num:0, x: W*0.25, y:H/2, vx:0, vy:0, active:true};
    balls.push(cue);

    const order = [1,9,2,10,3,8,4,11,5,12,6,13,7,14,15];
    let idx = 0;
    const startX = W*0.72;
    const spacing = R*2 + 0.6;
    for(let row=0; row<5; row++){
      for(let col=0; col<=row; col++){
        const n = order[idx++];
        const x = startX + row*spacing*0.87;
        const y = H/2 - row*spacing/2 + col*spacing;
        balls.push({num:n, x, y, vx:0, vy:0, active:true});
      }
    }
    updateHud();
    setMsg("Drag from the cue ball to aim & shoot");
  }

  function setMsg(t){ document.getElementById('msg').textContent = t; }

  function updateHud(){
    const solidsRow = document.getElementById('solidsRow');
    const stripesRow = document.getElementById('stripesRow');
    solidsRow.innerHTML = ''; stripesRow.innerHTML = '';
    for(let n=1;n<=7;n++){
      const d = document.createElement('div');
      d.className='dot';
      d.style.background = potted.solids.has(n) ? '#2a2a2a' : BALL_COLORS[n];
      d.style.opacity = potted.solids.has(n) ? .25 : 1;
      solidsRow.appendChild(d);
    }
    for(let n=9;n<=15;n++){
      const d = document.createElement('div');
      d.className='dot';
      d.style.background = potted.stripes.has(n) ? '#2a2a2a' : BALL_COLORS[n];
      d.style.opacity = potted.stripes.has(n) ? .25 : 1;
      stripesRow.appendChild(d);
    }
  }

  function allStopped(){
    return balls.every(b => Math.hypot(b.vx,b.vy) < MIN_SPEED);
  }

  function drawFeltTexture(){
    const grad = ctx.createRadialGradient(W/2,H/2,40, W/2,H/2, W*0.75);
    grad.addColorStop(0, '#12946a');
    grad.addColorStop(0.55, '#0e7a56');
    grad.addColorStop(1, '#0a5c42');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);
  }

  function drawTable(){
    drawFeltTexture();

    ctx.strokeStyle = 'rgba(0,0,0,.35)';
    ctx.lineWidth = CUSHION*0.9;
    ctx.strokeRect(CUSHION/2, CUSHION/2, W-CUSHION, H-CUSHION);

    ctx.fillStyle = 'rgba(243,234,217,.55)';
    for(let i=1;i<8;i++){
      if(i===4) continue;
      const x = CUSHION + (W-2*CUSHION)*(i/8);
      diamond(x, 9, 4);
      diamond(x, H-9, 4);
    }
    for(let i=1;i<4;i++){
      const y = CUSHION + (H-2*CUSHION)*(i/4);
      diamond(9, y, 4);
      diamond(W-9, y, 4);
    }

    pockets.forEach(p=>{
      const g = ctx.createRadialGradient(p.x,p.y,2,p.x,p.y,POCKET_R);
      g.addColorStop(0,'#000');
      g.addColorStop(1,'#1a1008');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x,p.y,POCKET_R,0,Math.PI*2);
      ctx.fill();
    });
  }

  function diamond(x,y,s){
    ctx.beginPath();
    ctx.moveTo(x,y-s); ctx.lineTo(x+s,y); ctx.lineTo(x,y+s); ctx.lineTo(x-s,y);
    ctx.closePath(); ctx.fill();
  }

  function drawBall(b){
    ctx.save();
    ctx.translate(b.x,b.y);

    ctx.beginPath();
    ctx.ellipse(1.5,3,R*0.95,R*0.7,0,0,Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0,0,R,0,Math.PI*2);
    ctx.clip();

    if(b.num===0){
      ctx.fillStyle = '#f2ede1';
      ctx.fillRect(-R,-R,2*R,2*R);
    } else if(STRIPE(b.num)){
      ctx.fillStyle = '#f2ede1';
      ctx.fillRect(-R,-R,2*R,2*R);
      ctx.fillStyle = BALL_COLORS[b.num];
      ctx.fillRect(-R,-R*0.62,2*R,R*1.24);
    } else {
      ctx.fillStyle = BALL_COLORS[b.num];
      ctx.fillRect(-R,-R,2*R,2*R);
    }

    if(b.num!==0){
      ctx.beginPath();
      ctx.arc(0,0,R*0.55,0,Math.PI*2);
      ctx.fillStyle = '#f2ede1';
      ctx.fill();
      ctx.fillStyle = '#1c120b';
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.num, 0, 0.5);
    }

    const gloss = ctx.createRadialGradient(-R*0.35,-R*0.4,1,-R*0.2,-R*0.3,R*1.3);
    gloss.addColorStop(0,'rgba(255,255,255,.85)');
    gloss.addColorStop(0.25,'rgba(255,255,255,.15)');
    gloss.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle = gloss;
    ctx.fillRect(-R,-R,2*R,2*R);

    ctx.restore();
  }

  function drawAim(){
    if(!aiming || !cue.active) return;
    const dx = mousePos.x - aimStart.x;
    const dy = mousePos.y - aimStart.y;
    const dist = Math.min(Math.hypot(dx,dy), 120);
    const angle = Math.atan2(dy,dx);

    const dirX = -Math.cos(angle), dirY = -Math.sin(angle);
    ctx.save();
    ctx.strokeStyle = 'rgba(243,234,217,.55)';
    ctx.setLineDash([5,6]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cue.x, cue.y);
    ctx.lineTo(cue.x + dirX*160, cue.y + dirY*160);
    ctx.stroke();
    ctx.restore();

    const stickLen = 220;
    const gap = 18 + dist;
    ctx.save();
    ctx.translate(cue.x - dirX*gap, cue.y - dirY*gap);
    ctx.rotate(angle);
    const grad = ctx.createLinearGradient(0,0,stickLen,0);
    grad.addColorStop(0,'#caa06a');
    grad.addColorStop(0.85,'#8a5a34');
    grad.addColorStop(1,'#3c2418');
    ctx.fillStyle = grad;
    ctx.fillRect(0,-3,stickLen,6);
    ctx.restore();

    const power = Math.round((dist/120)*100);
    document.getElementById('powerFill').style.width = power + '%';
  }

  function stepPhysics(){
    balls.forEach(b=>{
      if(!b.active) return;
      b.x += b.vx; b.y += b.vy;
      b.vx *= FRICTION; b.vy *= FRICTION;
      if(Math.abs(b.vx) < MIN_SPEED) b.vx = 0;
      if(Math.abs(b.vy) < MIN_SPEED) b.vy = 0;

      const left = CUSHION + R, right = W - CUSHION - R;
      const top = CUSHION + R, bottom = H - CUSHION - R;
      if(b.x < left){ b.x = left; b.vx *= -0.88; }
      if(b.x > right){ b.x = right; b.vx *= -0.88; }
      if(b.y < top){ b.y = top; b.vy *= -0.88; }
      if(b.y > bottom){ b.y = bottom; b.vy *= -0.88; }
    });

    for(let i=0;i<balls.length;i++){
      for(let j=i+1;j<balls.length;j++){
        const a = balls[i], b = balls[j];
        if(!a.active || !b.active) continue;
        const dx = b.x-a.x, dy = b.y-a.y;
        const dist = Math.hypot(dx,dy);
        if(dist < 2*R && dist > 0){
          const overlap = (2*R - dist)/2;
          const nx = dx/dist, ny = dy/dist;
          a.x -= nx*overlap; a.y -= ny*overlap;
          b.x += nx*overlap; b.y += ny*overlap;

          const kx = a.vx - b.vx, ky = a.vy - b.vy;
          const p = 2*(kx*nx + ky*ny)/2;
          a.vx -= p*nx; a.vy -= p*ny;
          b.vx += p*nx; b.vy += p*ny;
        }
      }
    }

    balls.forEach(b=>{
      if(!b.active) return;
      pockets.forEach(p=>{
        if(Math.hypot(b.x-p.x, b.y-p.y) < POCKET_R*0.75){
          b.active = false;
          if(b.num === 0){
            setMsg("Scratch! Cue ball respotted.");
            setTimeout(()=>{ b.x = W*0.25; b.y = H/2; b.vx=0; b.vy=0; b.active=true; },500);
          } else if(b.num === 8){
            setMsg("The 8-ball is down — nice shot!");
          } else if(STRIPE(b.num)){
            potted.stripes.add(b.num);
            setMsg("Stripe potted: " + b.num);
          } else {
            potted.solids.add(b.num);
            setMsg("Solid potted: " + b.num);
          }
          updateHud();
        }
      });
    });
  }

  function loop(){
    stepPhysics();
    drawTable();
    balls.forEach(b => { if(b.active) drawBall(b); });
    drawAim();
    requestAnimationFrame(loop);
  }

  function toCanvasCoords(e){
    const r = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return { x: cx * (W / r.width), y: cy * (H / r.height) };
  }

  canvas.addEventListener('mousedown', e => {
    if(!allStopped() || !cue.active) return;
    const p = toCanvasCoords(e);
    if(Math.hypot(p.x-cue.x, p.y-cue.y) < 60){
      aiming = true;
      aimStart = p;
      mousePos = p;
    }
  });
  window.addEventListener('mousemove', e => {
    if(aiming) mousePos = toCanvasCoords(e);
  });
  window.addEventListener('mouseup', e => {
    if(!aiming) return;
    aiming = false;
    const p = toCanvasCoords(e);
    const dx = p.x - aimStart.x, dy = p.y - aimStart.y;
    const dist = Math.min(Math.hypot(dx,dy), 120);
    if(dist > 6){
      const angle = Math.atan2(dy,dx);
      const power = (dist/120) * 13;
      cue.vx = -Math.cos(angle) * power;
      cue.vy = -Math.sin(angle) * power;
      setMsg("Shot!");
    }
    document.getElementById('powerFill').style.width = '0%';
  });

  document.getElementById('resetBtn').addEventListener('click', rack);

  rack();
  loop();
})();