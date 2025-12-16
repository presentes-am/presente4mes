onload = () =>{
    document.body.classList.remove("container");
};

const GAME_PLAYER_SPEED = 2.5

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1444895860088635574/8JD73SakPXjpH6fkuCMIjvP92AqOOAJ6uOkscp7hwEzja72mzA4fslMhOg0iKmD8nSa9'

const VISIT_WEBHOOK_URL = 'a'

function now(){ return new Date().toLocaleString() }
function getDB(key){ return JSON.parse(localStorage.getItem(key) || '[]') }
function setDB(key,val){ localStorage.setItem(key, JSON.stringify(val)) }

function sendMessage(){
  const input = document.getElementById('msgInput')
  if(!input) return
  const txt = input.value.trim()
  if(!txt) return alert('Escreva Algo')
  
  const msgs = getDB('msgs')
  msgs.unshift({text:txt, user:'ela', time: now()}) 
  setDB('msgs', msgs)
  
  const payload = {
    content: `**NOVA MENSAGEM RECEBIDA**`, 
    embeds: [{
      title: "💌 Mensagem da Sua Princesinha ❤",
      description: txt,
      color: 16738749,
      footer: {
        text: `Enviada em: ${now()}`
      }
    }]
  }
  
  fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
  })
  .then(response => {
      if (response.ok) {
          console.log('Mensagem enviada com sucesso ao Discord.');
      } else {
          console.error('Erro ao enviar mensagem ao Discord:', response.status, response.statusText);
      }
  })
  .catch(error => {
      console.error('Erro de rede ao enviar ao Discord:', error);
  });

  alert('Mensagem enviada')
  input.value = ''
}

function salvarMensagem(){
  sendMessage()
}

function renderPainel(){
  const visitList = document.getElementById('visitList')
  const msgList = document.getElementById('msgList')
  if(visitList) {
    const visits = getDB('visits')
    visitList.innerHTML = visits.slice(0,50).map(v=>`<div style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.03)">${v.user} — ${v.page} — ${v.time}</div>`).join('') || '<div style="opacity:.7">Nenhum acesso</div>'
  }
  if(msgList){
    const msgs = getDB('msgs')
    msgList.innerHTML = msgs.map(m=>`<div style="padding:8px;margin-bottom:8px;border-radius:8px;background:rgba(255,255,255,0.02)">${m.text}<div style="opacity:.6;font-size:.85rem;margin-top:6px">${m.time}</div></div>`).join('') || '<div style="opacity:.7">nenhuma mensagem</div>'
  }
}

function clearFakeDB(){
  if(!confirm('Apagar Registros e Mensagens?')) return
  localStorage.removeItem('msgs')
  localStorage.removeItem('visits')
  localStorage.removeItem('unlocked4m')
  location.reload()
}

if(location.pathname.endsWith('jogo.html') || location.pathname.endsWith('/jogo.html')){
  (function initGame(){
    const canvas = document.getElementById('game')
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height

    let speed = GAME_PLAYER_SPEED

    const player = {x:40, y: H/2 - 12, w:28, h:28, color:'#ff99dd'}
    
    const hearts = []
    const particles = [] 
    const HEART_COUNT = 10
    let score = 0
    let lastTime = 0

    function drawHeart(c, x, y, size, color, fill=true, shadow=false){
      c.save()
      c.fillStyle = color
      c.beginPath()
      const k = 0.3
      c.moveTo(x, y + k * size)
      c.bezierCurveTo(x + size / 2, y - size / 2, x + size * 1.5, y + size / 3, x, y + size)
      c.bezierCurveTo(x - size * 1.5, y + size / 3, x - size / 2, y - size / 2, x, y + k * size)
      c.closePath()
      if(shadow){
        c.shadowBlur = 10;
        c.shadowColor = color;
      }
      if(fill) c.fill()
      c.restore()
    }

    for(let i=0;i<HEART_COUNT;i++){
      hearts.push({
        x: 60 + Math.random()*(W-120),
        y: 40 + Math.random()*(H-80),
        r: 12,
        collected:false,
        hue: 320 + Math.random()*40,
        floatOffset: Math.random() * Math.PI * 2 
      })
    }

    function createParticles(x, y, count = 10, color = '#fff') {
      for(let i = 0; i < count; i++) {
        particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 3, 
          vy: (Math.random() - 0.5) * 3, 
          size: Math.random() * 3 + 1,
          life: 60, 
          color: color
        })
      }
    }

    const keys = {up:false,down:false,left:false,right:false}
    document.addEventListener('keydown',e=>{
      if(e.key==='ArrowUp' || e.key==='w') keys.up = true
      if(e.key==='ArrowDown' || e.key==='s') keys.down = true
      if(e.key==='ArrowLeft' || e.key==='a') keys.left = true
      if(e.key==='ArrowRight' || e.key==='d') keys.right = true
    })
    document.addEventListener('keyup',e=>{
      if(e.key==='ArrowUp' || e.key==='w') keys.up = false
      if(e.key==='ArrowDown' || e.key==='s') keys.down = false
      if(e.key==='ArrowLeft' || e.key==='a') keys.left = false
      if(e.key==='ArrowRight' || e.key==='d') keys.right = false
    })

    const resetBtn = document.getElementById('resetBtn')
    resetBtn && resetBtn.addEventListener('click', ()=> location.reload())

    function update(deltaTime){
      const move = speed * deltaTime / 16.67 
      if(keys.up) player.y -= move
      if(keys.down) player.y += move
      if(keys.left) player.x -= move
      if(keys.right) player.x += move
      player.x = Math.max(4, Math.min(W - player.w - 4, player.x))
      player.y = Math.max(4, Math.min(H - player.h - 4, player.y))

      hearts.forEach(h=>{
        if(!h.collected){
          const dx = (player.x + player.w/2) - h.x
          const dy = (player.y + player.h/2) - h.y
          const distance = Math.sqrt(dx*dx + dy*dy)
          if(distance < (player.w/2 + h.r * 0.7)){ 
            h.collected = true
            score++
            createParticles(h.x, h.y, 20, `hsl(${h.hue}, 100%, 70%)`)
            document.getElementById('score').textContent = `${score} / ${HEART_COUNT}`
            const visits = getDB('visits')
            visits.unshift({user:'game', action:'collected', time: now()})
            setDB('visits', visits)
          }
        }
      })

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1 
        p.life--
        if (p.life <= 0) particles.splice(i, 1)
      }

      if(score >= HEART_COUNT){
        localStorage.setItem('unlocked4m', 'true')
        const finish = document.getElementById('finish')
        if(finish) finish.style.opacity = 1
      }
    }

    function draw(){
      ctx.clearRect(0,0,W,H)
      const g = ctx.createLinearGradient(0,0,0,H)
      g.addColorStop(0, '#0b0810'); g.addColorStop(1, '#15061a')
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H)

      const pulse = Math.sin(Date.now() / 400) * 0.1 + 1.0 
      hearts.forEach(h=>{
        if(h.collected){
          return
        }
        
        const floatY = h.y + Math.sin(h.floatOffset + Date.now() / 300) * 3 

        const size = h.r * pulse * 0.8 
        const color = `hsl(${h.hue}, 80%, 70%)`
        
        drawHeart(ctx, h.x, floatY, size, color, true, true)
      })

      const playerSize = player.w * 0.7 
      drawHeart(ctx, player.x + player.w / 2, player.y + player.h / 2, playerSize, player.color, true, true)


      particles.forEach(p => {
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.life / 60
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (p.life/60), 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1.0 
    }

    function loop(timestamp){
      const deltaTime = timestamp - lastTime
      lastTime = timestamp
      update(deltaTime)
      draw()
      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  })();
}

if(location.pathname.endsWith('especial.html')){
  (function checkUnlock(){
    const unlocked = localStorage.getItem('unlocked4m') === 'true'
    const cont = document.getElementById('textoEspecial')
    const lockNotice = document.getElementById('lockNotice')
    if(!unlocked){
      lockNotice.innerHTML = `<div style="padding:14px;background:rgba(255,255,255,0.02);border-radius:12px">AMORRR... O texto aindaa ta bloqueadoo, joga o mini-joguinhoo pra desbloquearr...</div>`
      cont.textContent = ''
      const go = document.createElement('div')
      go.style.marginTop = '12px'
      go.innerHTML = `<a class="btn" href="jogo.html">Ir ao Mini-Joguinho</a>`
      lockNotice.appendChild(go)
    } else {
      lockNotice.innerHTML = `<div style="padding:12px;background:linear-gradient(90deg,#ff9bd6,#ff61c9);color:#000;border-radius:12px">Surpresaaa Liberada Meu Amor...</div>`
      cont.textContent = 
    `Quatro meses. E quando eu olho pra tudo isso amor, eu não penso em números, nem em datas, nem em marcações no calendário. O que me vem primeiro é a sensação, aquela que só você consegue despertar... A sensação de que minha vida ganhou direção no exato momento em que você entrou, e que desde então tudo tem seguido um caminho que finalmente faz sentido pra mim.

    Eu não olho pra nós como algo pequeno, passageiro ou indefinido, eu olho pra nós como a coisa mais real que já aconteceu no meu peito... E hoje, depois de tudo o que a gente viveu, depois de cada conversa, cada silêncio, cada detalhe que só nós dois entendemos... eu tenho uma certeza tranquila dentro de mim, eu quero continuar construindo tudo com você, todos os dias, sem pausa, sem espaço pra dúvidas...

    Porque nesses quatro meses amor, você se tornou algo que eu nunca tinha sentido antes... Não é só vontade de estar perto, não é só saudade quando você não tá aqui. Não é só carinho quando você fala comigo. É algo maior, mais profundo, mais inteiro... É como se meu coração tivesse encontrado onde repousar, como se, pela primeira vez, eu tivesse alguém que eu realmente escolho todos os dias, e que eu quero continuar escolhendo amanhã, depois, no futuro inteiro que a gente sonha...

    Quando eu penso em você, eu penso em paz, penso em cuidado, penso em alguém que eu quero sempre proteger, acompanhar, apoiar e ver crescer, eu penso em alguém que eu quero ver vencendo, rindo, descansando, vivendo do jeito mais leve possível, penso em alguém que eu quero ao meu lado nos dias bons e nos dias difíceis, pq você se tornou parte do que eu sou, e isso não é exagero... Não é frase bonita... É o que eu sinto de verdade...

    Quatro meses com você me mostraram o quanto tudo muda quando a pessoa certa aparece, você mudou meu jeito de ver o mundo, meu jeito de sentir, meu jeito de me entregar.. Com você, eu aprendi que o amor não precisa ser complicado pra ser forte, não precisa ser dramático pra ser intenso, não precisa ser perfeito pra ser verdadeiro, ele só precisa ser nosso, e o nosso é tudo o que eu sempre quis sem saber que queria.

    Eu penso na gente no futuro e o sentimento não é medo, não é pressão, não é insegurança, é vontade, é tranquilidade, é aquela certeza silenciosa que fica ali no fundo do peito dizendo, "continua... pq é aqui que você pertence..."

    E quando eu digo que penso no nosso futuro, não é fantasia ou frase que se joga ao vento. É real... Eu penso na nossa casinha, no nosso canto, no nosso ritmo, nas nossas conquistas, nos planos que vão tomando forma aos poucos, nos nossos filhos, nos nossos dias que vão começar juntos e terminar juntos. Eu penso em você fazendo parte da minha vida de um jeito que ninguém nunca ocupou.

    Nesses quatro meses, você se tornou parte das minhas lembranças, dos meus hábitos, dos meus pensamentos, das minhas expectativas. E o mais bonito é que você fez isso sem forçar nada. Só sendo você. Só existindo do seu jeitinho, com suas manias, sua voz, seus detalhes que só eu enxergo do jeito que enxergo.

    Eu quero que você saiba que nada do que eu sinto é pequeno, nada é raso, nada é dúvida, eu tô com você pq meu coração sabe que é aqui que ele precisa estar, pq você se tornou a pessoa que eu quero ter por perto não apenas quando tudo vai bem, mas principalmente quando o mundo pesa... Eu quero aliviar suas preocupações, segurar seu cansaço, ouvir suas dores, dividir suas alegrias e estar com você no que a vida trouxer...

    A verdade amor... é que nesses quatro meses eu descobri algo que eu nunca tinha encontrado antes, eu descobri que amar também pode ser casa... E você virou exatamente isso pra mim, um lugar onde eu não preciso fingir nada, onde eu posso ser eu mesmo, onde eu descanso, onde eu escolho ficar...

    Hoje é nosso quarto mês, mas pra mim meu amor, ele não significa "quatro", ele significa "continua", significa "a gente", significa "é você"...
    Significa que, de tudo que já vivi, nada chega perto do que sinto quando penso no nosso caminho.

    Parabéns pra nós meu amorrr...
    E muito obrigado por existir na minha vida do jeito mais lindo possível...
    Eu te amo com tudo o que eu sou, e com tudo que ainda vou ser ao seu lado...`
    }
  })();
}

if(location.pathname.endsWith('painel.html')){
  renderPainel()
}

(function registerPageVisit(){
  const path = location.pathname.split('/').pop() || 'index.html'
  const time = now()
  
  const visits = getDB('visits')
  visits.unshift({user:'ela', page:path, time: time}) 
  setDB('visits', visits)

  if ((path === 'index.html' || path === '') && VISIT_WEBHOOK_URL.length > 30) {
      const payload = {
        content: `**❤️ ALERTA DE ACESSO!**`, 
        embeds: [{
          title: "💻 Site Acessado!",
          description: `Sua Deusa acabou de entrar no site!`,
          color: 3326154,
          fields: [
              {
                  name: "Página Visitada",
                  value: path,
                  inline: true
              },
              {
                  name: "Hora do Acesso",
                  value: time,
                  inline: true
              }
          ],
          footer: {
            text: `Data: ${time}`
          }
        }]
      }
      
      fetch(VISIT_WEBHOOK_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      })
      .then(response => {
          if (response.ok) {
              console.log('Alerta de visita enviado com sucesso.');
          }
      })
      .catch(error => {
          console.error('Erro de rede ao enviar alerta de visita:', error);
      });
  }

})();

function sendMessageCompat(){
  sendMessage()
}

window.sendMessage = sendMessage
window.salvarMensagem = salvarMensagem
window.clearFakeDB = clearFakeDB
window.sendMessageCompat = sendMessageCompat