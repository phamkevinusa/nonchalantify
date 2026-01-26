// Apply lowercase to everything
function nonchalantify() {
  document.body.style.textTransform = 'lowercase';
  
  // Count letters (rough estimate)
  const text = document.body.innerText;
  const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
  
  chrome.storage.local.get(['totalLowercased'], (result) => {
    const newTotal = (result.totalLowercased || 0) + uppercaseCount;
    chrome.storage.local.set({ totalLowercased: newTotal });
  });
}

// Check if enabled
chrome.storage.local.get(['enabled'], (result) => {
  if (result.enabled !== false) { // default on
    nonchalantify();
  }
});

// Listen for toggle
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    location.reload();
  }
});