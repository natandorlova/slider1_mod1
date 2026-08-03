const sliderTrack = document.getElementById("sliderTrack");
const sliderHandle = document.getElementById("sliderHandle");

const invoiceMarkers = document.getElementById("invoiceMarkers");
const packingMarkers = document.getElementById("packingMarkers");

let dragging = false;
let progress = 0;


// ========================================
// Создание подсветок
// ========================================

function createMarkers() {

    data.forEach(item => {

        createMarker(invoiceMarkers, item.invoice, item);
        createMarker(packingMarkers, item.packing, item);

    });

}


function createMarker(parent, coords, item) {

    const marker = document.createElement("div");

    marker.className = "marker";

    marker.id = parent.id + "-" + item.id;

    marker.style.left = coords.x + "%";
    marker.style.top = coords.y + "%";
    marker.style.width = coords.w + "%";
    marker.style.height = coords.h + "%";

    marker.style.borderColor = item.color;

    if (item.outlineOnly) {

        marker.style.background = "transparent";

    } else {

        marker.style.background = item.color + "55";

        const title = document.createElement("div");

        title.className = "marker-title";

        title.textContent = item.title;

        title.style.color = item.color;

        marker.appendChild(title);

    }

    parent.appendChild(marker);

}


// ========================================
// Показ подсветок
// ========================================

function updateMarkers() {

    data.forEach(item => {

        const invoice =
            document.getElementById(
                "invoiceMarkers-" + item.id
            );

        const packing =
            document.getElementById(
                "packingMarkers-" + item.id
            );

        if (progress >= item.showAt) {

            invoice.classList.add("active");
            packing.classList.add("active");

        } else {

            invoice.classList.remove("active");
            packing.classList.remove("active");

        }

    });

}



// ========================================
// Высота трека
// ========================================

function resizeTrack() {

    const invoiceImage =
        document.querySelector("#invoiceBox img");

    sliderTrack.style.height =
        invoiceImage.getBoundingClientRect().height + "px";

}



// ========================================
// Ползунок
// ========================================

function setProgress(value) {

    progress = Math.max(
        0,
        Math.min(100, value)
    );

    sliderHandle.style.top =
        progress + "%";

    updateMarkers();

}


function getProgress(clientY) {

    const rect =
        sliderTrack.getBoundingClientRect();

    return (
        (clientY - rect.top)
        / rect.height
    ) * 100;

}



// ========================================
// Мышь
// ========================================

sliderHandle.addEventListener("mousedown", e => {

    dragging = true;

    e.preventDefault();

});


window.addEventListener("mousemove", e => {

    if (!dragging) return;

    setProgress(
        getProgress(e.clientY)
    );

});


window.addEventListener("mouseup", () => {

    dragging = false;

});



// ========================================
// Телефон
// ========================================

sliderHandle.addEventListener("touchstart", e => {

    dragging = true;

    e.preventDefault();

}, { passive: false });


window.addEventListener("touchmove", e => {

    if (!dragging) return;

    setProgress(
        getProgress(
            e.touches[0].clientY
        )
    );

}, { passive: false });


window.addEventListener("touchend", () => {

    dragging = false;

});



// ========================================
// Загрузка страницы
// ========================================

window.addEventListener("load", () => {

    createMarkers();

    resizeTrack();

    setProgress(0);

});



// ========================================
// Изменение размера окна
// ========================================

window.addEventListener("resize", () => {

    resizeTrack();

});
