'use strict';
// Values are estimates for the published scope, not a checkout or reach forecast.
function calculatePrice({quantity, materials}) {
  if (![1,4,8,10].includes(quantity) || !['provided','search'].includes(materials)) throw new RangeError('Opção inválida');
  const unit = materials === 'search' ? 70 : 50;
  return {unit,total:unit*quantity};
}
if (typeof module !== 'undefined') module.exports = {calculatePrice};
if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const money = value => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2});
  const views = value => value >= 1000000 ? `${value / 1000000} ${value === 1000000 ? 'milhão' : 'milhões'}` : `${value / 1000} mil`;
  function update() {
    const quantity = +$('quantity').value, materials = $('materials').value;
    const result = calculatePrice({quantity,materials});
    $('package-label').textContent = quantity === 1 ? '1 vídeo avulso · até 60 segundos' : quantity+' vídeos por mês · até 60 segundos cada';
    $('total').textContent = money(result.total);
    $('unit').textContent = money(result.unit)+' por vídeo';
    const rows = [['Edição com todos os materiais enviados',quantity+' × R$ 50']];
    if (materials === 'search') rows.push(['Busca de qualquer material na internet',quantity+' × R$ 20']);
    $('breakdown').replaceChildren(...rows.map(([label,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);return row;}));
    const message = 'Olá, Adrian! Quero '+(quantity === 1 ? '1 vídeo avulso' : quantity+' vídeos por mês')+', de até 60 segundos. Materiais: '+(materials === 'search' ? 'preciso que você busque material na internet' : 'vou enviar toda a base pronta')+'. Estimativa: '+money(result.total)+' ('+money(result.unit)+'/vídeo), com capa simples. Entendo que o serviço é online, sem filmagem ou gravação presencial. Meu tema é: ';
    $('quote').href = 'https://wa.me/5598984450784?text='+encodeURIComponent(message);
    updateReach();
  }
  function updateReach() {
    const quantity = +$('quantity').value, average = +$('scenario').value;
    $('single-bar').style.width = `${100/quantity}%`;
    $('single-views').textContent = views(average);
    $('total-views').textContent = views(average*quantity);
    $('chart-quantity').textContent = quantity === 1 ? '1 vídeo' : `${quantity} vídeos`;
    $('reach-equation').textContent = `${quantity} ${quantity === 1 ? 'vídeo' : 'vídeos'} × ${views(average)} views = ${(average*quantity).toLocaleString('pt-BR')} visualizações hipotéticas somadas.`;
    document.querySelector('.chart').setAttribute('aria-label',`Cenário hipotético: um vídeo com ${views(average)} visualizações; ${quantity} vídeos com ${views(average*quantity)} somadas. Não é uma previsão.`);
  }
  $('price-form').addEventListener('change',update);
  $('price-form').addEventListener('submit',event=>event.preventDefault());
  $('scenario').addEventListener('change',updateReach);
  function motionState(paused) {document.body.classList.toggle('motion-paused',paused);document.body.classList.toggle('motion-enabled',!paused);$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent = paused ? 'Animações pausadas' : 'Pausar animações';$('motion').setAttribute('aria-label',paused ? 'Retomar animações' : 'Pausar animações');}
  motionState(false);
  $('motion').addEventListener('click',()=>motionState(!document.body.classList.contains('motion-paused')));
  update();
}
