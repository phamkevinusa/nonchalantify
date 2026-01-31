// nonchalantify - making the internet less shouty
// content.js - where the magic happens

let currentLevel = 1;
let statsCollected = false;

// count uppercase letters and punctuation before we destroy them
function collectStats() {
  if (statsCollected) return;

  const text = document.body.innerText || '';
  const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
  const punctuationCount = (text.match(/[!?]/g) || []).length;

  chrome.storage.local.get(['totalLowercased', 'totalPunctuation'], (result) => {
    const newLowercased = (result.totalLowercased || 0) + uppercaseCount;
    const newPunctuation = (result.totalPunctuation || 0) + punctuationCount;

    chrome.storage.local.set({
      totalLowercased: newLowercased,
      totalPunctuation: newPunctuation
    });
  });

  statsCollected = true;
}

// Level 1: Casual - just CSS
function applyCasual() {
  const style = document.createElement('style');
  style.id = 'nonchalantify-style';
  style.textContent = `
    * {
      text-transform: lowercase !important;
    }
    /* Allow explicit uppercase classes to work */
    .text-uppercase,
    .uppercase,
    [class*="uppercase"],
    [class*="UPPERCASE"] {
      text-transform: uppercase !important;
    }
  `;
  document.head.appendChild(style);
}

// Level 2: Committed - remove uppercase classes and bold
function applyCommitted() {
  applyCasual();

  // // remove text-uppercase classes
  // const upperElements = document.querySelectorAll('[class*="uppercase"], [class*="UPPERCASE"]');
  // upperElements.forEach(el => {
  //   // remove all variations of uppercase classes
  //   const classes = el.className.split(' ').filter(cls =>
  //     !cls.toLowerCase().includes('uppercase')
  //   );
  //   el.className = classes.join(' ');
  // });

  // // remove inline uppercase styles
  // const allElements = document.querySelectorAll('*');
  // allElements.forEach(el => {
  //   if (el.style.textTransform === 'uppercase' || el.style.textTransform === 'UPPERCASE') {
  //     el.style.textTransform = 'lowercase';
  //   }
  //   // remove bold - being bold is try-hard
  //   if (el.style.fontWeight === 'bold' || parseInt(el.style.fontWeight) >= 700) {
  //     el.style.fontWeight = 'normal';
  //   }
  // });

  // tone down all headers
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headers.forEach(h => {
    h.style.fontWeight = 'normal';
  });

  // make everything 400 weight
  const style = document.createElement('style');
  style.id = 'nonchalantify-enlightened';
  style.textContent = `
    * {
      font-weight: 400 !important;
    }
  `;
  document.head.appendChild(style);
}

// Level 3: Unhinged - actually modify the DOM
function applyUnhinged() {
  applyCommitted();


  // /*
  //   // this breaks a lot of websites

  //   // walk through all text nodes and lowercase them
  //   const walker = document.createTreeWalker(
  //     document.body,
  //     NodeFilter.SHOW_TEXT,
  //     null,
  //     false
  //   );

  //   let node;
  //   while (node = walker.nextNode()) {
  //     if (node.nodeValue && node.nodeValue.trim()) {
  //       node.nodeValue = node.nodeValue.toLowerCase();
  //     }
  //   }
  // */

  // demote all headers to h6 (everything is equally unimportant)
  ['h1', 'h2', 'h3', 'h4', 'h5'].forEach(tag => {
    const headers = document.querySelectorAll(tag);
    headers.forEach(h => {
      const newH = document.createElement('h6');
      newH.innerHTML = h.innerHTML;
      Array.from(h.attributes).forEach(attr => {
        newH.setAttribute(attr.name, attr.value);
      });
      h.parentNode.replaceChild(newH, h);
    });
  });

  // Remove all !important from stylesheets (the irony)
  try {
    for (let sheet of document.styleSheets) {
      try {
        // Skip our own nonchalantify styles
        if (sheet.ownerNode && (sheet.ownerNode.id === 'nonchalantify-style' || sheet.ownerNode.id === 'nonchalantify-enlightened')) {
          continue;
        }
        for (let rule of sheet.cssRules) {
          if (rule.style) {
            const ruleStyle = rule.style;
            for (let i = 0; i < ruleStyle.length; i++) {
              const prop = ruleStyle[i];
              const value = ruleStyle.getPropertyValue(prop);
              const priority = ruleStyle.getPropertyPriority(prop);
              if (priority === 'important') {
                ruleStyle.setProperty(prop, value, '');
              }
            }
          }
        }
      } catch (e) {
        // cross-origin stylesheet, skip it
      }
    }
  } catch (e) {
    // just vibes, no errors
  }
}


// Level 4: Enlightened - peak nonchalance
function applyEnlightened() {
  applyUnhinged();

  // replace chalant language
  const replacements = {
    'urgent': 'whenever',
    'breaking news': 'some stuff happened',
    'important': 'maybe relevant',
    'call now': 'maybe later',
    'limited time': 'no rush',
    'act now': 'or dont',
    'hurry': 'whenever',
    'exclusive': 'whatever',
    'don\'t miss': 'you might see',
    'last chance': 'another chance probably',
    'must see': 'could look at',
    'must read': 'could read',
    'must have': 'could get',
    'alert': 'fyi',
    'warning': 'heads up maybe',
    'critical': 'kinda matters',
    'now': 'eventually',
    'asap': 'when you feel like it',
    'immediately': 'at some point',
    'final': 'another',
    'deadline': 'suggestion',
    'ends soon': 'goes on forever',
    'today only': 'available',
    'click here': 'maybe click',
    'buy now': 'buy whenever',
    'order now': 'order if you want',
    'subscribe now': 'subscribe maybe',
    'sign up now': 'sign up sometime',
    'free': 'included',
    'save now': 'save later',
    'limited offer': 'regular offer',
    'amazing': 'ok',
    'incredible': 'decent',
    'unbelievable': 'believable',
    'guaranteed': 'probably'
  };

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    if (node.nodeValue && node.nodeValue.trim()) {
      let text = node.nodeValue;

      // replace chalant phrases
      Object.keys(replacements).forEach(key => {
        const regex = new RegExp(key, 'gi');
        text = text.replace(regex, replacements[key]);
      });

      // replace chalant punctuation
      text = text.replace(/!+/g, '...');

      text = text.replace(/\?{2,}/g, '?');

      node.nodeValue = text;
    }
  }

}

// Apply the appropriate level
function nonchalantify(level) {
  // Remove existing styles first
  const existingStyle = document.getElementById('nonchalantify-style');
  if (existingStyle) existingStyle.remove();

  const existingEnlightened = document.getElementById('nonchalantify-enlightened');
  if (existingEnlightened) existingEnlightened.remove();

  currentLevel = level;

  switch (level) {
    case 1:
      applyCasual();
      break;
    case 2:
      applyCommitted();
      break;
    case 3:
      applyUnhinged();
      break;
    case 4:
      applyEnlightened();
      break;
  }
}

// Apply level 1 and 2 (CSS) immediately
chrome.storage.local.get(['enabled', 'level'], (result) => {
  if (result.enabled === false) return;
  
  const level = result.level || 1;
  const style = document.createElement('style');
  style.id = 'nonchalantify-instant';
  
  if (level === 1) {
    // Just lowercase
    style.textContent = `* { text-transform: lowercase !important; }`;
  } else if (level >= 2) {
    // Lowercase + remove bold
    style.textContent = `
      * { 
        text-transform: lowercase !important;
        font-weight: 400 !important;
      }
    `;
  }

  document.head.appendChild(style);
});

// Then wait for full DOM for other levels
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['enabled', 'level'], (result) => {
    if (result.enabled !== false) {
      collectStats();
      const level = result.level || 1;
      
      // If level 1 or 2, CSS already applied
      if (level > 2) {
        nonchalantify(level);
      }
    }
  });
});


// Initialize
chrome.storage.local.get(['enabled', 'level'], (result) => {
  if (result.enabled !== false) {
    collectStats();
    const level = result.level || 1;
    nonchalantify(level);
  }
});

// Listen for changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    location.reload();
  }
  if (changes.level && changes.level.newValue) {
    location.reload();
  }
});