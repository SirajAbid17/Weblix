export const IMAGE_DATABASE = {

  heroes: [
    'https://picsum.photos/id/104/1200/400', 
    'https://picsum.photos/id/106/1200/400', 
    'https://picsum.photos/id/15/1200/400',   
    'https://picsum.photos/id/20/1200/400',   
    'https://picsum.photos/id/26/1200/400',   
    'https://picsum.photos/id/29/1200/400',  
    'https://picsum.photos/id/39/1200/400',   
    'https://picsum.photos/id/42/1200/400',   
    'https://picsum.photos/id/48/1200/400',  
    'https://picsum.photos/id/58/1200/400',   
  ],
  
 
  gallery: [
    'https://picsum.photos/id/100/400/300',
    'https://picsum.photos/id/101/400/300',
    'https://picsum.photos/id/102/400/300',
    'https://picsum.photos/id/103/400/300',
    'https://picsum.photos/id/104/400/300',
    'https://picsum.photos/id/105/400/300',
    'https://picsum.photos/id/106/400/300',
    'https://picsum.photos/id/107/400/300',
  ],
  

  about: [
    'https://picsum.photos/id/64/600/400',
    'https://picsum.photos/id/65/600/400',
    'https://picsum.photos/id/66/600/400',
    'https://picsum.photos/id/67/600/400',
    'https://picsum.photos/id/68/600/400',
  ],
  
 
  cta: [
    'https://picsum.photos/id/30/1200/300',
    'https://picsum.photos/id/31/1200/300',
    'https://picsum.photos/id/32/1200/300',
    'https://picsum.photos/id/33/1200/300',
  ]
};

export const getRandomImage = (category = 'heroes') => {
  const images = IMAGE_DATABASE[category] || IMAGE_DATABASE.heroes;
  return images[Math.floor(Math.random() * images.length)];
};

export const getMultipleImages = (category = 'gallery', count = 3) => {
  const images = IMAGE_DATABASE[category] || IMAGE_DATABASE.gallery;
  const shuffled = [...images];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};