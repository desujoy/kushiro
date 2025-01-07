$(function () {
  $(".synopsis").moreLess({
    wordsCount: 50,
    moreClass: "toggle-text",
    lessClass: "toggle-text",
  });

});
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('show');
  });
});