export function infiniteScroll(node: HTMLElement, callback: () => void | Promise<void>) {
  let observer: IntersectionObserver;

  const init = () => {
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the target is visible
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          void callback();
        }
      });
    }, options);

    observer.observe(node);
  };

  init();

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
