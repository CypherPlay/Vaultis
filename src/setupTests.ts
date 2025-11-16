import '@testing-library/jest-dom';

// Mock the Web Animations API for jsdom environment
if (typeof Element !== 'undefined') {
  Element.prototype.animate = () => ({
    cancel: () => {},
    finished: Promise.resolve(),
    play: () => {},
    pause: () => {},
    reverse: () => {},
    commitStyles: () => {},
    finish: () => {},
    onfinish: null,
    oncancel: null,
    pending: false,
    playState: 'idle',
    ready: Promise.resolve(),
    startTime: 0,
    currentTime: 0,
    effect: null,
    timeline: null,
  });
}