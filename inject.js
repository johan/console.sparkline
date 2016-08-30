((root) => {
  if (!root) return;

  const js = document.createElement('script');
  js.src = chrome.extension.getURL('console.sparkline.js');
  js.onload = () => root.removeChild(js);
  root.appendChild(js);

})(document.documentElement);
