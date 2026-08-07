import { createBrandOgImage, OG_IMAGE_SIZE } from "@/lib/brandOgImage";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return createBrandOgImage();
}
