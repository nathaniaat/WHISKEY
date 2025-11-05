$(document).ready(function () {
  const navLinks = document.querySelector(".nav-links");
  function onToggleMenu(e) {
    e.name = e.name === "menu" ? "close" : "menu";
    navLinks.classList.toggle("top-[9%]");
  }
  const transitionDuration = 600;

  $("#homeNav").on("click", function () {
    $("#aboutUs, #adoptPage, #header").fadeOut(0, function () {
      $("#header").fadeIn(transitionDuration);
      $("#aboutUs").fadeIn(transitionDuration);
      $("#adoptPage").fadeIn(transitionDuration);
    });
  });

  $("#aboutNav").on("click", function () {
    $("#header, #adoptPage").fadeOut(transitionDuration, function () {
      $("#aboutUs").fadeIn(transitionDuration);
    });
  });

  $("#adoptNav").on("click", function () {
    $("#header, #aboutUs").fadeOut(transitionDuration, function () {
      $("#adoptPage").fadeIn(transitionDuration);
    });
  });
});
