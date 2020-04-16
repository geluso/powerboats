class Pages {
  static init() {
    console.log('pages');
    $(".close-welcome").click(() => {
      $("#welcome").toggle();
    });

    $(document).keyup(ev => {
      console.log('esc')
      if (ev.which === 27) { // ESC
        $("#welcome").toggle();
      }
    });
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Pages;
}