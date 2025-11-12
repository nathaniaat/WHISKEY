$(document).ready(function () {
  const $navLinks = $(".nav-links");

  $(".menu-icon").on("click", function () {
    const $icon = $(this);
    const currentName = $icon.attr("name");
    $icon.attr("name", currentName === "menu" ? "close" : "menu");
    $navLinks.toggleClass("top-[9%]");
  });

  $("#homeNav").on("click", function () {
    $("#aboutUs, #adoptPage").hide();
    $("#header").show();
  });

  $("#aboutNav").on("click", function () {
    $("#header, #adoptPage").hide();
    $("#aboutUs").show();
  });

  $("#adoptNav").on("click", function () {
    $("#header, #aboutUs").hide();
    $("#adoptPage").show();
  });
});