// apply lowercase to everything
function nonchalantify() {
  document.body.style.textTransform = 'lowercase';
  
  // count letters (rough estimate)
  const text = document.body.innerText;
  const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
  
  chrome.storage.local.get(['totalLowercased'], (result) => {
    const newTotal = (result.totalLowercased || 0) + uppercaseCount;
    chrome.storage.local.set({ totalLowercased: newTotal });
  });
}

// check if enabled
chrome.storage.local.get(['enabled'], (result) => {
  if (result.enabled !== false) { // default on
    nonchalantify();
  }
});

// listen for toggle
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    location.reload();
  }
});