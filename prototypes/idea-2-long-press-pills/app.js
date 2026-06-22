const fab          = document.getElementById('fab');
const scrim        = document.getElementById('scrim');
const pillStack    = document.getElementById('pill-stack');
const stocks       = document.getElementById('stocks');
const stBack       = document.getElementById('st-back');
const styleseg     = document.getElementById('styleseg');
const home         = document.getElementById('home');
const statusbarFixed = document.getElementById('statusbar-fixed');

let pillsOpen      = false;
let pressTimer     = null;
let pressing       = false;
let longPressReady = false;

function buzz(ms){ if (navigator.vibrate) navigator.vibrate(ms); }

/* ── Pills open / close ── */
function openPills(){
  pillsOpen = true;
  fab.classList.add('open');
  pillStack.classList.remove('closing');
  pillStack.classList.add('open');
  scrim.classList.add('show');
  statusbarFixed.classList.add('pills-open');
}

function closePills(){
  if (!pillsOpen) return;
  pillsOpen = false;
  fab.classList.remove('open');
  pillStack.classList.remove('open');
  pillStack.classList.add('closing');
  scrim.classList.remove('show');
  statusbarFixed.classList.remove('pills-open');
  // remove closing class once animation is done so it doesn't interfere with next open
  pillStack.addEventListener('transitionend', () => pillStack.classList.remove('closing'), { once: true });
}

/* ── Long-press detection ── */
fab.addEventListener('pointerdown', e => {
  if (e.button !== 0 && e.button !== undefined) return;
  pressing = true;
  longPressReady = false;
  pressTimer = setTimeout(() => {
    if (pressing){
      longPressReady = true;
      buzz(10); // haptic cue: "ready, release now"
    }
  }, 400);
});

fab.addEventListener('pointerup', () => {
  pressing = false;
  clearTimeout(pressTimer);
  if (longPressReady)   openPills();
  else if (pillsOpen)   closePills();
  longPressReady = false;
});

fab.addEventListener('pointercancel', () => {
  pressing = false;
  longPressReady = false;
  clearTimeout(pressTimer);
});

// prevent context menu on long-press on mobile
fab.addEventListener('contextmenu', e => e.preventDefault());

/* ── Scrim tap → dismiss ── */
scrim.addEventListener('click', closePills);

/* ── Pill taps ── */
pillStack.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const action = pill.dataset.action;
    if (action === 'ng-stocks'){
      closePills();
      // slight delay so pills close before the push starts
      setTimeout(() => {
        compactStatusbarDuringSlide();
        stocks.classList.add('show');
        home.classList.add('pushed');
      }, 80);
    } else {
      closePills();
    }
  });
});

/* ── Stocks screen → back ── */
stBack.addEventListener('click', () => {
  compactStatusbarDuringSlide();
  stocks.classList.remove('show');
  home.classList.remove('pushed');
});

/* ── Status-bar strip: compact during slides, tall+feathered at rest ── */
function compactStatusbarDuringSlide(){
  statusbarFixed.classList.add('compact');
  stocks.addEventListener('transitionend', () => statusbarFixed.classList.remove('compact'), { once: true });
}

/* ── Ctrl+H — hide/show controls ── */
document.addEventListener('keydown', e => {
  if (e.key === 'h' && (e.ctrlKey || e.metaKey)){
    e.preventDefault();
    document.getElementById('controls').classList.toggle('hidden');
  }
});

/* ── FAB style toggle ── */
styleseg.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  styleseg.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const style = btn.dataset.style;
  fab.classList.toggle('blue',  style === 'blue');
  fab.classList.toggle('glass', style === 'glass');
});
