// Sinyal sederhana "preloader sudah selesai", dipakai animasi yang harus
// menunggu preloader hilang (misalnya nama di hero).

const EVENT = "preloader:done";
let done = false;

export function markPreloaderDone() {
  if (done) return;
  done = true;
  window.dispatchEvent(new Event(EVENT));
}

/** Panggil `cb` sekali saat preloader selesai (langsung, kalau sudah selesai). */
export function onPreloaderDone(cb: () => void): () => void {
  if (done) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}
