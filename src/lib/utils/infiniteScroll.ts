import { writable, type Writable } from 'svelte/store';

interface InfiniteScrollOptions {
  callback: () => void;
  loading: Writable<boolean>;
  threshold?: number; // Distance from bottom to trigger callback
}

export function setupInfiniteScroll(options: InfiniteScrollOptions) {
  const { callback, loading, threshold = 200 } = options;
  let isLoading = false;
  let unsubscribeLoading: () => void;

  const handleScroll = async () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold && !isLoading) {
      loading.set(true);
      await callback();
      loading.set(false);
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
