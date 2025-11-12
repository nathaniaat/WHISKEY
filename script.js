$(document).ready(function () {
  const $sections = $(
    "#header, #aboutUsPage, #adoptionPage, #donationPage, #educationPage"
  );

  function showSection(id) {
    $sections.hide();
    $(id).show();
  }

  $("#homeNav").on("click", function () {
    $sections.show();
  });

  $("#aboutNav").on("click", function () {
    showSection("#aboutUsPage");
  });

  $("#adoptNav").on("click", function () {
    showSection("#adoptionPage");
  });

  $("#donateNav").on("click", function () {
    showSection("#donationPage");
  });

  $("#eduNav").on("click", function () {
    showSection("#educationPage");
  });

  $sections.show();
});
