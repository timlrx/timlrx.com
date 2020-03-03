HTMLWidgets.widget({

  name: 'particles',

  type: 'output',

  factory: function(el, width, height) {

    return {

      renderValue: function(x) {

        var particles_id = el.id + "-particles";

        if (x.target_id === null) {
          var particlebody = document.body;
          var particleel = document.createElement("div");
          particleel.id = particles_id;
          particleel.classList.add("particles-full");
          document.body.appendChild(particleel);
          particlebody.insertBefore(particleel, particlebody.firstChild);
        } else {
          if (x.target_id == "body") {
            var body_particles = document.body;
            body_particles.id = particles_id;
          } else {
            particles_id = x.target_id;
          }
        }


        /*
        // with htmlDependency attachment: bug Chrome (access to xmlhttprequest at from origin 'null' has been blocked by cors policy)
        //var config = HTMLWidgets.getAttachmentUrl('particles-config', 'config-json');
        // With dataURI: bug IE
        var config = "data:text/plain;base64,"+window.btoa(JSON.stringify(x.config));
        particlesJS.load('particles-js', config, function() {
          console.log('callback - particles.js config loaded');
        });
        */
        // dont use XMLHttpRequest, use config JSON directly
        setTimeout(function() {
          particlesJS(particles_id, x.config);
        }, x.timeout);

      },

      resize: function(width, height) {
      }

    };
  }
});


if (HTMLWidgets.shinyMode) {

  Shiny.addCustomMessageHandler('update-particles',
    function(message) {
      particlesJS(message.id, message.config);
  });

}
