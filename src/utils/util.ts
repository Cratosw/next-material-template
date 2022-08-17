export const isSSR = (function () {
    try {
      return !(typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement);
    } catch (e) {
      return true;
    }
  })();