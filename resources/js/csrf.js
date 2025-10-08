// Mengambil CSRF Token dari meta tag
const getCsrfToken = () => {
    return document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
};

// Simpan fetch asli
const originalFetch = window.fetch;

// Modifikasi window.fetch untuk menambahkan CSRF Token
window.fetch = async function (url, options = {}) {
    const token = getCsrfToken();

    // Jika request bukan GET dan token ada
    if (token && options.method !== "GET" && options.method !== "HEAD") {
        // Pastikan headers ada, jika tidak buat objek headers baru
        if (!options.headers) {
            options.headers = {};
        }

        // Menambahkan CSRF Token ke headers
        options.headers["X-CSRF-TOKEN"] = token;

        // Jika request body ada, pastikan Content-Type diatur dengan benar
        if (options.body && !(options.body instanceof FormData)) {
            options.headers["Content-Type"] = "application/json";
        }
    }

    // Lakukan fetch menggunakan fetch asli yang sudah dimodifikasi
    return originalFetch(url, options);
};
