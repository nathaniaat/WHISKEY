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
  let allCatData = [];

  function generateCatCards(data) {
    const $cardContainer = $("#adoptionPage .grid.gap-8");
    $cardContainer.empty();

    data.forEach((cat) => {
      const cardHtml = `
                <div class="cat-card ${cat.bgColor} rounded-2xl overflow-hidden shadow-lg p-4 hover:shadow-xl transition" data-gender="${cat.dataGender}">
                    <img
                        src="${cat.image}"
                        alt="cat ${cat.name}"
                        class="w-full aspect-[4/3] object-cover rounded-xl mb-3"
                    />
                    <p class="text-[var(--dark-blue)] font-semibold text-xl mb-1 text-left">
                        ${cat.name}
                    </p>
                    <div class="flex justify-between items-center text-sm">
                        <p class="text-[var(--dark-blue)] opacity-70">${cat.age} | ${cat.gender}</p>
                        <button
                            class="view-detail-btn btn-green px-4 py-1 rounded-full font-medium"
                            data-name="${cat.name}"
                            data-age="${cat.age}"
                            data-gender="${cat.gender}"
                            data-backstory="${cat.backstory}"
                        >
                            View
                        </button>
                    </div>
                </div>
            `;
      $cardContainer.append(cardHtml);
    });

    // Panggil handler modal untuk kartu yang baru dibuat
    initializeModalHandlers();
  }

  // Fungsi untuk inisialisasi semua handler modal (View, Close, Adopt)
  function initializeModalHandlers() {
    // Hapus event click sebelumnya untuk menghindari binding ganda
    $(".view-detail-btn").off("click");
    $(".close-modal-btn").off("click");
    $("#openAdoptionFormBtn").off("click");
    $("#adoptionForm").off("submit");

    // Handler VIEW DETAIL (Modal Detail)
    $(".view-detail-btn").on("click", function () {
      const name = $(this).data("name");
      const age = $(this).data("age");
      const gender = $(this).data("gender");
      const backstory = $(this).data("backstory");

      $("#modalCatName").text(name);
      $("#modalCatAge").text(age);
      $("#modalCatGender").text(gender);
      $("#modalCatBackstory").text(backstory);

      const $modal = $("#catDetailModal");
      $modal.removeClass("hidden").addClass("flex");
      $modal.find("> div").removeClass("scale-95").addClass("scale-100");
    });

    // Handler CLOSE MODAL
    $(".close-modal-btn").on("click", function () {
      const modalId = $(this).data("modal");
      closeModal(`#${modalId}`);
    });

    // Handler OPEN ADOPTION FORM
    $("#openAdoptionFormBtn").on("click", function () {
      closeModal("#catDetailModal");

      const $formModal = $("#adoptionFormModal");
      $formModal.removeClass("hidden").addClass("flex");
      $formModal.find("> div").removeClass("scale-95").addClass("scale-100");
    });

    // Handler FORM SUBMIT
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
  } // End initializeModalHandlers

  // Fungsi untuk menutup modal
  function closeModal(modalSelector) {
    const $modal = $(modalSelector);

    $modal.find("> div").removeClass("scale-100").addClass("scale-95");

    setTimeout(() => {
      $modal.removeClass("flex").addClass("hidden");
    }, 200);
  }

  // --- LOGIKA UTAMA (LOAD DATA JSON) ---
  $.getJSON("cats.json", function (data) {
    allCatData = data;
    generateCatCards(allCatData); // Generate kartu pertama kali
  }).fail(function () {
    console.error(
      "Gagal memuat cats.json. Pastikan file ada dan path-nya benar."
    );
    // Tampilkan pesan error di UI jika perlu
    $("#adoptionPage .grid.gap-8").html(
      '<p class="col-span-4 text-center text-red-500">Gagal memuat data kucing. Silakan coba lagi.</p>'
    );
  });

  // --- LOGIKA FILTER ---
  $(".filter-btn").on("click", function () {
    const filterType = $(this).data("filter");

    // Update active button style
    $(".filter-btn").removeClass("btn-green").addClass("btn-outline-green");
    $(this).removeClass("btn-outline-green").addClass("btn-green");

    // Filter data
    let filteredData;
    if (filterType === "all") {
      filteredData = allCatData;
    } else {
      filteredData = allCatData.filter((cat) => cat.dataGender === filterType);
    }

    // Re-generate cards
    generateCatCards(filteredData);
  });

  // Pastikan tombol 'All Cats' aktif saat pertama kali load
  $('.filter-btn[data-filter="all"]')
    .removeClass("btn-outline-green")
    .addClass("btn-green");
});
