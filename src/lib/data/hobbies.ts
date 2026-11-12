import { Hobby } from "@/types";

// TODO: Ganti dengan hobi asli Tahir (CV tidak mencantumkan hobi).
// Simpan gambar di public/images/hobbies/ lalu isi `images` dengan path-nya,
// misal "/images/hobbies/photography-1.webp". Gambar pertama dipakai sebagai
// cover di grid. Kalau `images` kosong, otomatis pakai gambar placeholder.
export const hobbiesData: Hobby[] = [
  {
    id: "photography",
    title: "Photography",
    description:
      "Capturing everyday moments, street scenes, and landscapes. Photography trains me to notice details and compose a clear story, the same mindset I bring to presenting data.",
    images: [],
  },
  {
    id: "badminton",
    title: "Badminton",
    description:
      "Playing badminton with friends on weekends to stay active, sharpen focus, and enjoy some friendly competition.",
    images: [],
  },
  {
    id: "reading",
    title: "Reading",
    description:
      "Reading books on business, technology, and self-development to keep learning beyond work and broaden my perspective.",
    images: [],
  },
];
