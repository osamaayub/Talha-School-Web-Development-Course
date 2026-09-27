
  (function () {
  var toggle = document.getElementById("nav-toggle");
  if (!toggle) return;

  function closeMenu() {
  toggle.checked = false;
}

  document.querySelectorAll(".nav-links a, .logo").forEach(function (link) {
  link.addEventListener("click", closeMenu);
});
})();

