'use strict';
/* The Gilded Needle prototype — boot */
window.G = window.G || {};

(function () {

  function boot() {
    G.initCanvas('game');
    G.bindMouse();
    G.load();
    G.UI.init();
    G.Sprites.init();

    G.loadImages({
      exterior: 'assets/exterior.png',
      interior: 'assets/interior.png',
      wardrobe: 'assets/wardrobe.png',
    }, () => {
      G.setMode('title');
      G.start();
    });

    // loading splash while images stream in
    const ctx = G.ctx;
    ctx.fillStyle = '#241708';
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.fillStyle = '#e8d3a8';
    ctx.font = 'italic 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('threading the needle…', G.W / 2, G.H / 2);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
