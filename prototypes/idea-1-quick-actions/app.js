const fab     = document.getElementById('fab');
const scrim   = document.getElementById('scrim');
const sheet   = document.getElementById('sheet');
const portfolio = document.getElementById('portfolio');
const psBack  = document.getElementById('ps-back');
const styleseg = document.getElementById('styleseg');
const home    = document.getElementById('home');
const statusbarFixed = document.getElementById('statusbar-fixed');

/* shrink the fixed status strip to just the status bar while a screen slides
   (so the moving back button / status bar don't ghost through its feather),
   then restore the tall feathered strip once the slide settles. */
function compactStatusbarDuringSlide(){
  statusbarFixed.classList.add('compact');
  portfolio.addEventListener('transitionend', () => statusbarFixed.classList.remove('compact'), { once: true });
}

let open = false;

/* light haptic-style feedback if the device supports it */
function buzz(ms){ if (navigator.vibrate) navigator.vibrate(ms); }

function openSheet(){
  open = true;
  fab.classList.add('open');
  scrim.classList.add('show');
  sheet.classList.add('show');
  buzz(8);
}
function closeSheet(){
  open = false;
  fab.classList.remove('open');
  scrim.classList.remove('show');
  sheet.classList.remove('show');
}

fab.addEventListener('click', () => open ? closeSheet() : openSheet());
scrim.addEventListener('click', closeSheet);

/* route the sheet rows */
sheet.querySelectorAll('.sheet-row').forEach(row => {
  row.addEventListener('click', () => {
    const action = row.dataset.action;
    if (action === 'naira'){
      buzz(8);
      compactStatusbarDuringSlide();
      portfolio.classList.add('show');
      home.classList.add('pushed');                // parallax the outgoing screen
      // collapse the sheet behind the pushed screen
      setTimeout(closeSheet, 220);
    } else {
      // Savings / Dollar — not part of idea #1 flow yet; just close for now
      closeSheet();
    }
  });
});

/* back from portfolio */
psBack.addEventListener('click', () => {
  compactStatusbarDuringSlide();
  portfolio.classList.remove('show');
  home.classList.remove('pushed');
});

/* Ctrl+H — hide/show the controls strip for clean preview */
document.addEventListener('keydown', e => {
  if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    document.getElementById('controls').classList.toggle('hidden');
  }
});

/* FAB style toggle: blue vs glass */
styleseg.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  styleseg.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const style = btn.dataset.style;
  fab.classList.toggle('blue', style === 'blue');
  fab.classList.toggle('glass', style === 'glass');
});
