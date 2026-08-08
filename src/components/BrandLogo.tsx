import Image from "next/image";

/**
 * The Leaax mark, sized to sit inline next to the "Leaax" wordmark in
 * headers — roughly matching the wordmark's font size, with `alt=""`
 * since the adjacent visible text already conveys the brand name.
 */
export function BrandLogo() {
  return (
    <Image
      src="/Leaax_Logo_transparent.png"
      alt=""
      width={20}
      height={20}
      className="h-5 w-5 shrink-0"
    />
  );
}
