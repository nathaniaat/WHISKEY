$(document).ready(function () {
  const $allSections = $(
    "#header, #aboutUsPage, #adoptionPage, #donationPage, #educationPage, #homeArticles"
  );

  function hideAllSections() {
    $allSections.hide();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $("#homeNav").on("click", function () {
    $("#educationPage").hide();

    $("#header").fadeIn();
    $("#aboutUsPage").fadeIn();
    $("#adoptionPage").fadeIn();
    $("#donationPage").fadeIn();
    $("#homeArticles").fadeIn();

    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $("#aboutNav").on("click", function () {
    hideAllSections();
    $("#aboutUsPage").fadeIn();
  });

  $("#adoptNav").on("click", function () {
    hideAllSections();
    $("#adoptionPage").fadeIn();
  });

  $("#donateNav").on("click", function () {
    hideAllSections();
    $("#donationPage").fadeIn();
  });

  $("#donate_btnDonateHero").on("click", function () {
    $("#donationModal").removeClass("hidden").addClass("flex");
  });

  $("#eduNav").on("click", function () {
    hideAllSections();
    $("#educationPage").fadeIn();
  });

  $("#btnGoToEducation").on("click", function () {
    hideAllSections();
    $("#educationPage").fadeIn();
  });

  $("#educationPage").hide();
  $("#header").show();
  $("#aboutUsPage").show();
  $("#adoptionPage").show();
  $("#donationPage").show();
  $("#homeArticles").show();

  // ADOPTION
  let allCatData = [];

  function generateCatCards(data) {
    const $cardContainer = $("#adoptionPage .grid.gap-8");
    $cardContainer.empty();

    data.forEach((cat) => {
      const cardHtml = `
        <div class="cat-card ${cat.bgColor} rounded-2xl overflow-hidden shadow-lg p-4 hover:shadow-xl transition" data-gender="${cat.dataGender}">
            <img src="${cat.image}" alt="cat ${cat.name}" class="w-full aspect-[4/3] object-cover rounded-xl mb-3" />
            <p class="text-[var(--dark-blue)] font-semibold text-xl mb-1 text-left">${cat.name}</p>
            <div class="flex justify-between items-center text-sm">
                <p class="text-[var(--dark-blue)] opacity-70">${cat.age} | ${cat.gender}</p>
                <button class="view-detail-btn btn-green px-4 py-1 rounded-full font-medium"
                    data-name="${cat.name}" data-age="${cat.age}" data-gender="${cat.gender}" data-backstory="${cat.backstory}">
                    View
                </button>
            </div>
        </div>`;
      $cardContainer.append(cardHtml);
    });

    initializeModalHandlers();
  }

  function initializeModalHandlers() {
    $(".view-detail-btn").off("click");
    $(".close-modal-btn").off("click");
    $("#openAdoptionFormBtn").off("click");
    $("#adoptionForm").off("submit");

    // View Detail
    $(".view-detail-btn").on("click", function () {
      $("#modalCatName").text($(this).data("name"));
      $("#modalCatAge").text($(this).data("age"));
      $("#modalCatGender").text($(this).data("gender"));
      $("#modalCatBackstory").text($(this).data("backstory"));

      $("#catDetailModal").removeClass("hidden").addClass("flex");
      $("#catDetailModal")
        .find("> div")
        .removeClass("scale-95")
        .addClass("scale-100");
    });

    // Close Modal
    $(".close-modal-btn").on("click", function () {
      const modalId = $(this).data("modal");
      closeModal(`#${modalId}`);
    });

    // Open Adoption Form
    $("#openAdoptionFormBtn").on("click", function () {
      closeModal("#catDetailModal");
      const $formModal = $("#adoptionFormModal");
      $formModal.removeClass("hidden").addClass("flex");
      $formModal.find("> div").removeClass("scale-95").addClass("scale-100");
    });

    // Submit Form
    $("#adoptionForm").on("submit", function (event) {
      event.preventDefault();
      const catName = $("#modalCatName").text() || "This Cat";
      const firstName = $("#firstName").val();
      alert(
        `Terima kasih, ${firstName}! Permintaan adopsi Anda untuk ${catName} telah berhasil dikirim.`
      );
      closeModal("#adoptionFormModal");
      this.reset();
    });
  }

  function closeModal(modalSelector) {
    const $modal = $(modalSelector);
    $modal.find("> div").removeClass("scale-100").addClass("scale-95");
    setTimeout(() => {
      $modal.removeClass("flex").addClass("hidden");
    }, 200);
  }

  // Load JSON Kucing
  $.getJSON("cats.json", function (data) {
    allCatData = data;
    generateCatCards(allCatData);
  }).fail(function () {
    console.error("Gagal memuat cats.json.");
  });

  // Filter Kucing
  $(".filter-btn").on("click", function () {
    const filterType = $(this).data("filter");
    $(".filter-btn").removeClass("btn-green").addClass("btn-outline-green");
    $(this).removeClass("btn-outline-green").addClass("btn-green");

    let filteredData =
      filterType === "all"
        ? allCatData
        : allCatData.filter((cat) => cat.dataGender === filterType);
    generateCatCards(filteredData);
  });
  $('.filter-btn[data-filter="all"]')
    .removeClass("btn-outline-green")
    .addClass("btn-green");

  // DONATION 
  const $customAmount = $("#donate_customAmount");
  const $donationOptions = $("#donate_donationOptions");
  const $donationSummary = $("#donate_donationSummary");
  const $paymentMethodSummary = $("#donate_paymentMethodSummary");
  const $paymentButtons = $(
    "#donate_paymentButtonsContainer .donate-payment-btn"
  );
  const $btnCheckout = $("#donate_btnCheckoutFinal");

  let currentAmount = 0;
  let currentMethod = "";

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const updateCheckoutButton = () => {
    $btnCheckout.prop("disabled", !(currentAmount > 0 && currentMethod));
  };

  const updateAmount = (newAmount) => {
    currentAmount = newAmount;
    if ($donationSummary.length)
      $donationSummary.text(formatRupiah(currentAmount));
    $("#donate_donationOptions .option-btn")
      .removeClass("btn-green border-green")
      .addClass("btn-outline-green");
    updateCheckoutButton();
  };

  function resetDonationForm() {
    currentAmount = 0;
    $donationSummary.text(formatRupiah(0));
    $("#donate_donationOptions .option-btn")
      .removeClass("btn-green border-green")
      .addClass("btn-outline-green");
    $customAmount.val("");
    currentMethod = "";
    $paymentMethodSummary.text("No Rekening: -");
    $paymentButtons.removeClass("btn-green").addClass("btn-outline-green");

    const proofInput = document.getElementById("proofUpload");
    const fileNameDisplay = document.getElementById("uploadedFileName");
    if (proofInput) proofInput.value = "";
    if (fileNameDisplay) fileNameDisplay.textContent = "";

    updateCheckoutButton();
  }

  // Scroll Button
  const scrollBtn = document.getElementById("scrollToContact");
  const contactSection = document.getElementById("contact");
  if (scrollBtn && contactSection) {
    scrollBtn.addEventListener("click", function () {
      contactSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Close Modal Donasi
  $("#closeDonationModal").on("click", function () {
    $("#donationModal").addClass("hidden").removeClass("flex");
    resetDonationForm();
  });

  // Tutup modal jika klik luar
  $("#donationModal").on("click", function (e) {
    if (e.target === this) {
      $(this).addClass("hidden").removeClass("flex");
      resetDonationForm();
    }
  });

  // Pilihan Nominal
  if ($donationOptions.length) {
    $donationOptions.on("click", ".option-btn", function () {
      const amount = parseInt($(this).data("amount"));
      updateAmount(amount);
      if ($customAmount.length) $customAmount.val("");
      $(this)
        .removeClass("btn-outline-green")
        .addClass("btn-green border-green");
    });
  }

  // Custom Input
  if ($customAmount.length) {
    $customAmount.on("input", function () {
      let raw = $(this)
        .val()
        .replace(/[^0-9]/g, "");
      if (!raw) {
        updateAmount(0);
        $(this).val("");
        return;
      }
      let amount = parseInt(raw);
      updateAmount(amount);
      $(this).val(amount.toLocaleString("id-ID"));
    });
  }

  // Payment Buttons
  if ($paymentButtons.length) {
    $paymentButtons.on("click", function () {
      currentMethod = $(this).data("method");
      $paymentMethodSummary.text("No Rekening: " + currentMethod);
      $paymentButtons.removeClass("btn-green").addClass("btn-outline-green");
      $(this).removeClass("btn-outline-green").addClass("btn-green");
      updateCheckoutButton();
    });
  }

  // File Upload
  const proofInput = document.getElementById("proofUpload");
  const fileNameDisplay = document.getElementById("uploadedFileName");
  if (proofInput) {
    proofInput.addEventListener("change", function () {
      const file = this.files[0];
      fileNameDisplay.textContent = file ? "File dipilih: " + file.name : "";
    });
  }

  // Submit Checkout
  if ($btnCheckout.length) {
    $btnCheckout.on("click", function () {
      if (currentAmount > 0 && currentMethod) {
        $("#successModal").removeClass("hidden").addClass("flex");
        $("#donationModal").addClass("hidden").removeClass("flex");
        resetDonationForm();
      }
    });
  }

  $("#closeSuccessModal").on("click", function () {
    $("#successModal").addClass("hidden").removeClass("flex");
  });

  if ($donationSummary.length) {
    $donationSummary.text(formatRupiah(0));
  }

  let articlesData = [];

  // RENDER ARTIKEL
  function renderArticles(data) {
    // --- render preview di home ---
    const homeContainer = $("#home-articles-container");
    if (homeContainer.length) {
      homeContainer.empty();
      const homeData = data.slice(0, 2);

      homeData.forEach((article) => {
        const html = `
            <article class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col">
                <div class="lg:flex h-full">
                    <img src="${article.image}" class="w-full lg:w-1/3 object-cover h-48 lg:h-auto" />
                    <div class="p-6 lg:w-2/3 flex flex-col justify-between">
                    <div>
                        <h3 class="text-xl headerTxt700 mb-2">${article.title}</h3>
                        <p class="text-sm text-gray-500 mb-2">${article.summary}</p>
                    </div>
                    <a href="#" class="text-green font-bold read-more-article mt-2"
                        data-title="${article.title}" data-content="${article.content}" data-image="${article.image}">Read More</a>
                    </div>
                </div>
            </article>`;
        homeContainer.append(html);
      });
    }

    // --- render full di edu page ---
    const eduContainer = $("#education-articles-container");
    if (eduContainer.length) {
      eduContainer.empty();
      data.forEach((article, index) => {
        const hiddenClass = index >= 2 ? "hidden" : "";

        let badgeColorClass = "bg-gray-100 text-dark-blue";

        if (article.category === "Health") {
          badgeColorClass = "bg-soft-pink text-dark-blue";
        } else if (article.category === "Tips") {
          badgeColorClass = "bg-soft-blue text-dark-blue";
        }

        const html = `
                <article class="article-item ${hiddenClass} bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div class="lg:flex">
                    <img src="${article.image}" class="w-full lg:w-1/3 object-cover aspect-[4/3]" />
                    <div class="p-6 lg:w-2/3">
                        <div class="flex items-center text-sm text-gray-500 mb-2">
                        <span class="mr-3">${article.date}</span> • <span>By ${article.author}</span>
                        </div>
                        <h3 class="text-2xl text-left headerTxt700 mb-2">${article.title}</h3>
                        <p class="bodyTxt text-left text-gray-700 mb-4">${article.summary}</p>
                        <div class="flex items-center justify-between">
                        <div class="flex gap-2">
                            <span class="px-3 py-1 rounded-full text-sm ${badgeColorClass} category-label font-medium">
                                ${article.category}
                            </span>
                        </div>
                        <a href="#" class="btn-outline-green px-4 py-2 rounded-full read-more-article font-medium"
                            data-title="${article.title}" data-content="${article.content}" data-image="${article.image}">
                            Read More
                        </a>
                        </div>
                    </div>
                    </div>
                </article>`;
        eduContainer.append(html);
      });
    }
  }

  // --- LOAD DATA DARI ARTICLES.JSON ---
  $.getJSON("articles.json", function (data) {
    articlesData = data;
    renderArticles(articlesData);
  }).fail(function () {
    console.error("Gagal memuat articles.json. Pastikan file ada.");
  });

  // MODAL READ MORE
  $(document).on("click", ".read-more-article", function (e) {
    e.preventDefault();
    $("#articleModalTitle").text($(this).data("title"));
    $("#articleModalContent").text($(this).data("content"));
    $("#articleModalImage").attr("src", $(this).data("image"));
    $("#articleModal").removeClass("hidden").addClass("flex");
  });

  $("#articleClose").on("click", function () {
    $("#articleModal").addClass("hidden").removeClass("flex");
  });

  $("#articleModal").on("click", function (e) {
    if (e.target === this) $(this).addClass("hidden").removeClass("flex");
  });

  // SEARCH
  function performSearch() {
    const value = $("#articleSearchInput").val().toLowerCase().trim();

    $(".category-filter").removeClass(
      "shadow-md font-bold ring-2 ring-offset-2 ring-blue-500 ring-pink-500 ring-green-500"
    );
    $('.category-filter:not(:contains("Show All"))').addClass("text-dark-blue");
    $('.category-filter:contains("Show All")').addClass("text-red-500");

    $(".article-item").each(function () {
      const text = $(this).text().toLowerCase();
      $(this).toggle(text.indexOf(value) > -1);
    });
  }

  $("#articleSearchInput").on("input", performSearch);
  $("#articleSearchBtn").on("click", performSearch);

  // FILTER CATEGORY
  $(".category-filter").on("click", function (e) {
    e.preventDefault();
    const category = $(this).text().trim();

    $(".category-filter").removeClass(
      "shadow-md font-bold ring-2 ring-offset-2 ring-blue-500 ring-pink-500 ring-green-500"
    );
    $('.category-filter:not(:contains("Show All"))').addClass("text-dark-blue");
    $('.category-filter:contains("Show All")').addClass("text-red-500");

    if (category === "Show All") {
      $(this).addClass("font-bold text-red-500");
      $("#articleSearchInput").val("");
      $(".article-item").show();
    } else {
      $(this).addClass("shadow-md font-bold ring-2 ring-offset-2");
      if (category === "Tips")
        $(this).addClass("ring-blue-500").removeClass("text-dark-blue");
      else if (category === "Health")
        $(this).addClass("ring-pink-500").removeClass("text-dark-blue");
      else $(this).addClass("ring-green-500").removeClass("text-dark-blue");

      $("#articleSearchInput").val("");
      $(".article-item").each(function () {
        const articleText = $(this).text();
        if (articleText.includes(category)) $(this).show();
        else $(this).hide();
      });
    }
  });

  // LOAD MORE / VIEW LESS
  $("#loadMoreBtn").on("click", function (e) {
    e.preventDefault();
    const $btn = $(this);

    if ($btn.text().trim() === "Load More") {
      const hiddenArticles = $(
        "#education-articles-container .article-item.hidden"
      );
      if (hiddenArticles.length > 0) {
        hiddenArticles
          .removeClass("hidden")
          .addClass("shown-article")
          .hide()
          .fadeIn("slow");
        $btn.text("View Less");
      } else {
        alert("No more articles to load!");
      }
    } else {
      const shownArticles = $(
        "#education-articles-container .article-item.shown-article"
      );
      shownArticles.fadeOut("fast", function () {
        $(this).addClass("hidden").removeClass("shown-article");
      });
      $("html, body").animate(
        { scrollTop: $("#educationPage").offset().top },
        500
      );
      $btn.text("Load More");
    }
  });
});