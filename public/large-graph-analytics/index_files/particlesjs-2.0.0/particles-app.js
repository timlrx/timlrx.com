
var sel = document.body;
var selid = sel.id;
sel.id = "particles-js";


particlesJS.load('particles-js', 'particles/particlesjs-config.json', function() {
  console.log('callback - particles.js config loaded');
});

