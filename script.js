document.addEventListener('DOMContentLoaded', function() {

  // Utility function to parse cookies into a key-value object
  function parseCookies() {
    const cookies = {};
    document.cookie.split(';').forEach((cookie) => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      if (name && value) {
        cookies[name] = value;
      }
    });
    return cookies;
  }

  const allCookies = parseCookies();

  Object.keys(allCookies).forEach((cookieName) => {
    const cookieValue = allCookies[cookieName];
    Sentry.setTag(cookieName, cookieValue);
  });

  Sentry.captureMessage('All cookies logged dynamically', {
    level: 'info',
    extra: {
      cookies: allCookies,
      location: window.location.href,
    },
  });

  function logDebug(message) {
    console.log("Debug: " + message);
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  let queryString = window.location.search;
  queryString = queryString.replace("?%3Fsub2=", "&sub2=");
  console.log(queryString);

  const urlParams = new URLSearchParams(queryString);
  const paramsObject = Object.fromEntries(urlParams.entries());

  Object.keys(paramsObject).forEach((key) => {
    Sentry.setTag(key, paramsObject[key]);
  });

  Sentry.captureMessage('Captured All URL Parameters', {
    level: 'info',
    extra: {
      urlParams: paramsObject,
      location: window.location.href,
      cookies: document.cookie,
    },
  });

  Sentry.addBreadcrumb({
    category: 'URL Parameters',
    message: 'URL parameters captured dynamically',
    level: 'info',
    data: paramsObject,
  });

  let sub2Value;
  if (!urlParams.has('sub2') || !urlParams.get('sub2').trim()) {
    const utmAdsetId = urlParams.get('utm_term') || urlParams.get('utm_source') || urlParams.get('utm_campaign') || 'w';
    sub2Value = utmAdsetId;
    urlParams.set('sub2', sub2Value);
    logDebug(`sub2 parameter missing; set to: ${sub2Value}`);
  } else {
    sub2Value = urlParams.getAll('sub2').join(", ");
    logDebug(`sub2 parameter captured with values: ${sub2Value}`);
  }

  if (sub2Value) {
    Sentry.captureMessage('sub-two value set', {
      level: 'info',
      extra: { 'sub-two': sub2Value },
    });
    Sentry.setTag('sub-two', sub2Value);
    logDebug(`Sentry tag 'sub-two' set with value: ${sub2Value}`);
  }

  const fbpCookie = getCookie('_fbp');
  const fbcCookie = getCookie('_fbc');
  const sub5Value = fbcCookie || fbpCookie;
  if (sub5Value) {
    urlParams.set('sub5', sub5Value);
    logDebug(`sub5 parameter set from fbp cookie: ${sub5Value}`);
  }

  const pathArray = window.location.pathname.split('/').filter(Boolean);
  const slug = pathArray.pop();
  if (slug && !urlParams.has('sub3')) {
    urlParams.set('sub3', slug);
    logDebug(`sub3 parameter set from URL slug: ${slug}`);
  }

  const updatedParams = urlParams.toString();

  function updateLinks() {
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(function(link) {
      if (link.href && !link.href.includes(window.location.hostname)) {
        const linkUrl = new URL(link.href);
        linkUrl.search += (linkUrl.search ? '&' : '?') + updatedParams;
        link.href = linkUrl.href;
        logDebug("Updated link URL: " + link.href);

        link.addEventListener('click', function() {
          fbq('track', 'Subscribe');
          _tfa.push({notify: 'event', name: 'ArticleLinkClick', id: 1790277});
          gtag('event', 'conversion', {
            'send_to': 'AW-16661394375/KFtbCL7Q76AaEMfn4og-',
            'value': 1.0,
            'currency': 'USD',
            'transaction_id': ''
          });

          if (typeof ttq !== 'undefined') {
            ttq.track('ClickButton');
            console.log('TikTok Pixel Event Fired: ClickButton');
          } else {
            console.warn('TikTok Pixel is not loaded.');
          }
        });
      }
    });
  }

  updateLinks();
  const observer = new MutationObserver(updateLinks);
  observer.observe(document.body, { childList: true, subtree: true });

  logDebug(`URL parameters applied to all links: ${updatedParams}`);

  const userAgent = navigator.userAgent.toLowerCase();
  const iosContent = document.querySelector(".ios-content");
  const samsungContent = document.querySelector(".samsung-content");
  const androidContent = document.querySelector(".android-content");
  const desktopContent = document.querySelector(".desktop-content");

  if (iosContent) iosContent.style.display = "none";
  if (samsungContent) samsungContent.style.display = "none";
  if (androidContent) androidContent.style.display = "none";
  if (desktopContent) desktopContent.style.display = "none";

  if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ipod")) {
    if (iosContent) iosContent.style.display = "block";
  } else if (userAgent.includes("android") && userAgent.includes("sm-")) {
    if (samsungContent) samsungContent.style.display = "block";
  } else if (userAgent.includes("android")) {
    if (androidContent) androidContent.style.display = "block";
  } else if (desktopContent) {
    desktopContent.style.display = "block";
  }

});
