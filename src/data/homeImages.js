// Image manifest for the animated homepage wall.
// List just the filenames (relative to public/images/home/). The BASE_URL
// prefix is applied below so every path stays correct under the GitHub Pages
// subpath (e.g. /sorgot-website/). The wall derives the .webp variant from
// each filename automatically.
// To add images: drop files into public/images/home/ and add their filenames here.
const base = import.meta.env.BASE_URL;

const files = [
  'home-01.jpg',
  'home-02.jpg',
  'home-03.jpg',
  'home-04.jpg',
  'home-05.jpg',
  'home-06.jpg',
  'home-07.jpg',
  'home-08.jpg',
  'home-09.jpg',
  'home-10.jpg',
  'home-11.jpg',
  'home-12.jpg',
  'home-13.jpg',
  'home-14.png',
  'home-15.jpg',
  'home-16.jpg',
  'home-17.jpg',
  'home-18.jpg',
  'home-19.jpg',
  'home-20.jpg',
  'home-21.jpg',
  'home-22.jpg',
  'home-23.jpg',
  'home-24.jpg',
  'home-25.jpg',
  'home-26.jpg',
  'home-27.jpg',
  'home-28.jpg',
  'home-29.jpg',
  'home-30.jpg',
  'home-31.jpg',
  'home-32.jpg',
  'home-33.jpg',
  'home-34.jpg',
  'home-35.jpg',
  'home-36.jpg',
  'home-37.jpg',
  'home-38.jpg',
  'home-39.jpg',
  'home-40.jpg',
  'home-41.jpg',
];

export const homeImages = files.map((name) => `${base}images/home/${name}`);
