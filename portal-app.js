(() => {
  const button = document.getElementById('installPortalApp');
  const help = document.getElementById('portalInstallHelp');
  const status = document.getElementById('portalInstallStatus');
  const standalone = window.matchMedia('(display-mode: standalone)');
  let installPrompt = null;
  const refresh = () => {
    const installed = standalone.matches || navigator.standalone === true;
    document.getElementById('portalAppControls').hidden = installed;
    if (installed) help.hidden = true;
  };
  refresh();
  standalone.addEventListener('change', refresh);
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    document.getElementById('portalAppControls').hidden = true;
  });
  button.addEventListener('click', async () => {
    if (!installPrompt) {
      help.hidden = !help.hidden;
      button.setAttribute('aria-expanded', String(!help.hidden));
      return;
    }
    const prompt = installPrompt;
    installPrompt = null;
    button.disabled = true;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      status.textContent = choice.outcome === 'accepted' ? 'Installation requested. Your browser will finish setting up the app.' : 'You can install the app later.';
    } catch {
      help.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      status.textContent = 'Use the browser instructions below to install the app.';
    } finally {
      button.disabled = false;
    }
  });
})();
