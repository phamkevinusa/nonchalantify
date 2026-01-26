// load stats
chrome.storage.local.get(['totalLowercased', 'enabled'], (result) => {
  document.getElementById('count').textContent = 
    (result.totalLowercased || 0).toLocaleString();
  document.getElementById('toggle').checked = result.enabled !== false;
});

// toggle handler
document.getElementById('toggle').addEventListener('change', (e) => {
  chrome.storage.local.set({ enabled: e.target.checked });
});