import { Hobby } from "@/types";

// Gambar disimpan di public/images/hobbies/<hobi>/. Gambar pertama dipakai
// sebagai cover di carousel. Kalau `images` kosong, otomatis pakai placeholder.
export const hobbiesData: Hobby[] = [
  {
    id: "motorcycle",
    title: "Motorcycle Riding",
    description:
      "Riding my sport bike and joining group rides with fellow riders. Being on the road helps me clear my head, and riding in a convoy teaches discipline, awareness, and trust in the people around you.",
    images: ["/images/hobbies/bike/1.webp"],
  },
  {
    id: "mini-soccer",
    title: "Mini Soccer",
    description:
      "Playing mini soccer with friends and colleagues to stay active and build team spirit. Every match is a reminder that good communication and teamwork matter on the field as much as they do at work.",
    images: [
      "/images/hobbies/minisoccer/1.webp",
      "/images/hobbies/minisoccer/2.webp",
    ],
  },
];
