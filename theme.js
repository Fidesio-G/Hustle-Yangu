(function () {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try { preference = localStorage.getItem('hustleyangu-theme'); } catch (_) {}
  if (preference !== 'light' && preference !== 'dark') preference = null;

  function apply(theme) {
    root.dataset.theme = theme;
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.querySelector('[data-theme-label]').textContent = theme === 'dark' ? 'Dark' : 'Light';
      toggle.querySelector('[data-theme-icon]').textContent = theme === 'dark' ? '☾' : '☀';
      toggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      toggle.hidden = false;
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#121313' : '#f5f3ee');
  }

  apply(preference || (system.matches ? 'dark' : 'light'));
  document.addEventListener('DOMContentLoaded', function () {
    apply(root.dataset.theme);
    document.getElementById('theme-toggle').addEventListener('click', function () {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('hustleyangu-theme', preference); } catch (_) {}
      apply(preference);
    });
  });
  system.addEventListener('change', function (event) {
    if (!preference) apply(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== 'hustleyangu-theme' && event.key !== null) return;
    preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    apply(preference || (system.matches ? 'dark' : 'light'));
  });
})();
