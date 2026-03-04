// MyState App - Screen Navigation

function showScreen(screenName) {
  // Hide all screens
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));

  // Show target screen
  const target = document.getElementById('screen-' + screenName);
  if (target) {
    target.classList.add('active');
  }

  // Update switcher buttons
  document.querySelectorAll('.switch-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.screen === screenName) {
      btn.classList.add('active');
    }
  });

  // Update bottom nav active states
  updateBottomNav(screenName);
}

function updateBottomNav(screenName) {
  document.querySelectorAll('.app-screen.active .nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Set active based on screen
  const activeScreen = document.getElementById('screen-' + screenName);
  if (!activeScreen) return;

  const navItems = activeScreen.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const label = item.querySelector('span')?.textContent?.toLowerCase();
    if (screenName === 'home' && label === 'home') item.classList.add('active');
    if (screenName === 'features' && label === 'features') item.classList.add('active');
    if (screenName === 'makerspace' && label === 'features') item.classList.add('active');
    if (screenName === 'profile' && label === 'profile') item.classList.add('active');
  });
}

// Switcher button clicks
document.querySelectorAll('.switch-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showScreen(btn.dataset.screen);
  });
});

// Location filter buttons in Makerspace screen
document.querySelectorAll('.loc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.loc-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Popular Times day selector
document.querySelectorAll('.pt-day').forEach(day => {
  day.addEventListener('click', () => {
    document.querySelectorAll('.pt-day').forEach(d => d.classList.remove('active'));
    day.classList.add('active');
  });
});

// Push notification toggle
function toggleNotifications() {
  const overlay = document.getElementById('notifOverlay');
  const btn = document.querySelector('.notif-toggle-btn');
  overlay.classList.toggle('visible');
  btn.classList.toggle('active');
}
