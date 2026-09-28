/* Mobile menu overlay — shared by every page.
   Progressive enhancement: with JS off the toggle never appears and the
   .nav-links list is still in the markup. */
(function () {
  'use strict';

  var nav = document.querySelector('nav');
  if (!nav) return;

  var toggle = nav.querySelector('.nav-toggle');
  var sheet  = nav.querySelector('.nav-sheet');
  if (!toggle || !sheet) return;

  var body = document.body;
  var lastFocus = null;

  function isOpen() { return body.classList.contains('nav-open'); }

  function open() {
    lastFocus = document.activeElement;
    body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    var first = sheet.querySelector('a');
    if (first) first.focus();
  }

  function close(returnFocus) {
    body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    if (returnFocus !== false) (lastFocus || toggle).focus();
  }

  toggle.addEventListener('click', function () {
    isOpen() ? close() : open();
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;

    if (e.key === 'Escape') { close(); return; }

    // Keep focus inside the overlay while it is open
    if (e.key === 'Tab') {
      var items = [toggle].concat(
        Array.prototype.slice.call(sheet.querySelectorAll('a'))
      );
      var i = items.indexOf(document.activeElement);
      if (i === -1) return;
      var step = e.shiftKey ? -1 : 1;
      items[(i + step + items.length) % items.length].focus();
      e.preventDefault();
    }
  });

  // Resizing past the breakpoint while open would leave body scroll locked
  var mq = window.matchMedia('(min-width: 641px)');
  var onChange = function () { if (mq.matches && isOpen()) close(false); };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);
})();
