class URLUtils {
  static getGameName() {
    const gameName = window.location.search.split('?game=')[1];
    return gameName;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = URLUtils;
}