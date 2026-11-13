const container = document.querySelector('.swipe-container');
container.addEventListener('scroll', () => {
  const pageIndex = Math.round(container.scrollLeft / window.innerWidth);
  // pageIndex ist 0 (Bundesliga), 1 (2. Liga), 2 (3. Liga) oder 3 (Formel 1)
});
