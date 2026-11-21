'use strict';
// Values are estimates for the published scope, not a checkout or reach forecast.
function calculatePrice({duration, quantity, research, editing, captions}) {
  if (![30,60].includes(duration) || ![1,4,8].includes(quantity) || ![0,150].includes(research) || ![0,180].includes(editing) || typeof captions !== 'boolean') throw new RangeError('Opção inválida');
  const base = duration === 30 ? 280 : 350;
  const unit = base + research + editing + (captions ? 50 : 0);
  const subtotal = unit * quantity;
  const discount = quantity >= 4 ? subtotal * .10 : 0;
  return {base, unit, subtotal, discount, total: subtotal-discount, discountedUnit:(subtotal-discount)/quantity};
}
if (typeof module !== 'undefined') module.exports = {calculatePrice};
if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const money = value => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2});
  const views = value => value >= 1000000 ? `${value / 1000000} ${value === 1000000 ? 'milhão' : 'milhões'}` : `${value / 1000} mil`;
  function update() {
    const duration = +$('duration').value, quantity = +$('quantity').value;
    const research = +$('research').value, editing = +$('editing').value, captions = $('captions').checked;
    const result = calculatePrice({duration,quantity,research,editing,captions});
    $('package-label').textContent = quantity === 1 ? '1 vídeo avulso' : `${quantity} vídeos por mês`;
    $('total').textContent = money(result.total);
    $('unit').textContent = `${money(result.discountedUnit)} por vídeo`;
    const rows = [[`${quantity} × ${money(result.unit)}`,money(result.subtotal)]];
    if (result.discount) rows.push(['Desconto de pacote (10%)',`− ${money(result.discount)}`]);
    $('breakdown').replaceChildren(...rows.map(([label,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);return row;}));
    const message = `Olá, Adrian! Quero conversar sobre ${quantity === 1 ? '1 vídeo avulso' : quantity+' vídeos por mês'}, de até ${duration} segundos. Roteiro: ${research ? 'com pesquisa aprofundada' : 'a partir do briefing'}. Edição: ${editing ? 'avançada, com animações personalizadas' : 'dinâmica'}. Legendas completas: ${captions ? 'sim' : 'não'}. Estimativa: ${money(result.total)} (${money(result.discountedUnit)}/vídeo), sujeita à avaliação do briefing. Meu tema é: `;
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
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function motionState(paused) {document.body.classList.toggle('motion-paused',paused);$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent = paused ? 'Animações pausadas' : 'Pausar animações';$('motion').setAttribute('aria-label',paused ? 'Retomar animações' : 'Pausar animações');}
  motionState(reduced.matches);
  $('motion').addEventListener('click',()=>motionState(!document.body.classList.contains('motion-paused')));
  reduced.addEventListener('change',()=>motionState(reduced.matches));
  update();
}
