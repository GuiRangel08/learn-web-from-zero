(() => {
  FirstCode.router = {
    read() {
      const parts = location.hash.replace(/^#\/?/, '').split('/');
      return { page: parts[0] || 'inicio', id: parts[1] || '' };
    },
    go(path) { location.hash = path; }
  };
})();
