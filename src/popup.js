// Popup logic
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const levelRadios = document.querySelectorAll('input[name="level"]');
  const lowercasedCount = document.getElementById('lowercased-count');
  const punctuationCount = document.getElementById('punctuation-count');
  
  // Load saved settings
  chrome.storage.local.get(['enabled', 'level', 'totalLowercased', 'totalPunctuation'], (result) => {
    // Set toggle
    toggle.checked = result.enabled !== false;
    
    // Set level
    const level = result.level || 1;
    document.getElementById(`level-${level}`).checked = true;
    
    // Animate stats
    animateValue(lowercasedCount, 0, result.totalLowercased || 0, 1000);
    animateValue(punctuationCount, 0, result.totalPunctuation || 0, 1000);
  });
  
  // Toggle handler
  toggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ enabled: e.target.checked }, () => {
      // Reload current tab
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });
  
  // Level change handler
  levelRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const level = parseInt(e.target.value);
      chrome.storage.local.set({ level }, () => {
        // Reload current tab
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.reload(tabs[0].id);
          }
        });
      });
    });
  });
  
  // Animate number counting up
  function animateValue(element, start, end, duration) {
    if (start === end) {
      element.textContent = end.toLocaleString();
      return;
    }
    
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }
});