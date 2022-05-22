export const getStep = () => {
  // md
  if (window.innerWidth >= 768) {
    return 4;
  }
  // sm
  if (window.innerWidth >= 576) {
    return 2;
  }
  return 1;
};
