import { type Writable } from 'svelte/store';

interface InfiniteScrollOptions {
  callback: () => void | Promise<void>;
  loading: Writable<boolean>;
  threshold?: number; // Distance from bottom to trigger callback
}

export function setupInfiniteScroll(options: InfiniteScrollOptions) {
  const { callback, loading, threshold = 200 } = options;
  let isLoading = false;
  let unsubscribeLoading: () => void;

  const handleScroll = async () => {
    if (isLoading) {
      return;
    }

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      isLoading = true;
      loading.set(true);
      try {
        await callback();
      } catch (error) {
        console.error('Infinite scroll callback error:', error);
      } finally {
        loading.set(false);
        isLoading = false;
      }
    }
  };

  const init = () => {
    unsubscribeLoading = loading.subscribe(value => {
      isLoading = value;
    });
    window.addEventListener('scroll', handleScroll);
  };

  const destroy = () => {
    window.removeEventListener('scroll', handleScroll);
    if (unsubscribeLoading) {
      unsubscribeLoading();
    }
  };

  init();

  return { destroy };
}
