'use strict';
/* The Gilded Needle prototype — boot */
window.G = window.G || {};

(function () {

  function boot() {
    G.initCanvas('game');
    G.bindMouse();
    G.load();
    G.UI.init();
    G.loadImages({
      exterior: 'assets/reference/spindle-square-sunny.png',
      interior: 'assets/interior.png',
      home: 'assets/home-bare.png',
      home_upgrades: 'assets/home-upgrades.png',
      wardrobe: 'assets/wardrobe.png',
      town_map: 'assets/reference/auberlin-town-map.png',
      npc_sheet: 'assets/auberlin-npcs.png',
      street_cinder: 'assets/street-cinder-row.png',
      street_ribbon: 'assets/street-ribbon-row.png',
      street_larkspur: 'assets/street-larkspur.png',
      street_crownway: 'assets/street-crownway.png',
      marielle_sheet: 'assets/reference/marielle-character-sheet.png',
      elise_sheet: 'assets/reference/grandmother-character-sheet.png',
      logo_tailor: 'assets/logos/tailor.svg',
      logo_sheep_farm: 'assets/logos/sheep-farm.svg',
      logo_muslin_factory: 'assets/logos/muslin-factory.svg',
      logo_fabric_store: 'assets/logos/fabric-store.svg',
      logo_charity_store: 'assets/logos/charity-store.svg',
      logo_brickworks: 'assets/logos/brickworks.svg',
      logo_home: 'assets/logos/home.svg',
      logo_ship_deck: 'assets/logos/ship-deck.svg',
    }, () => {
      G.Sprites.init();
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
