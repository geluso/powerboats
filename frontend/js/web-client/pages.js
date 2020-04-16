class Pages {
  static init() {
    console.log('pages');
    $(".close-welcome").click(() => {
      $("#welcome").toggle();
    });
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Pages;
}