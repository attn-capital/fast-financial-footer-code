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

    // Parse all cookies
  const allCookies = parseCookies();

  // Log all cookies as dynamic tags in Sentry
  Object.keys(allCookies).forEach((cookieName) => {
    const cookieValue = allCookies[cookieName];
    Sentry.setTag(cookieName, cookieValue); // Set each cookie name as a dynamic tag
  });

  // Log all cookies as an "extra" field for detailed debugging
  Sentry.captureMessage('All cookies logged dynamically', {
    level: 'info',
    extra: {
      cookies: allCookies,
      location: window.location.href, // Include the current page URL for context
    },
  });


    
    // Utility function to log messages for debugging
    function logDebug(message) {
      console.log("Debug: " + message);
    }

    // Function to retrieve cookies
    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }
	
    let queryString = window.location.search;

    // Fix improperly encoded "?%3Fsub2"
    queryString = queryString.replace("?%3Fsub2=", "&sub2=");
    // Capture URL parameters
	
	console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
	
    // Convert URL parameters to an object
    const paramsObject = Object.fromEntries(urlParams.entries());

    // Dynamically add all URL parameters as Sentry tags
    Object.keys(paramsObject).forEach((key) => {
      Sentry.setTag(key, paramsObject[key]);
    });

    // Capture a message with the full parameters for detailed debugging
    Sentry.captureMessage('Captured All URL Parameters', {
      level: 'info',
      extra: {
        urlParams: paramsObject, // Log all URL params in extra
        location: window.location.href, // Full page URL
        cookies: document.cookie, // Log cookies
      },
    });

    // Add a breadcrumb for URL parameters
    Sentry.addBreadcrumb({
      category: 'URL Parameters',
      message: 'URL parameters captured dynamically',
      level: 'info',
      data: paramsObject, // Log all URL params in breadcrumb data
    });

    // Check for 'sub2' or use UTM parameters to set 'sub2' if missing
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

    // Log to Sentry once sub2 is set and add as tag "sub-two"
    if (sub2Value) {
      Sentry.captureMessage('sub-two value set', {
        level: 'info',
        extra: {
          'sub-two': sub2Value,
        },
      });
      Sentry.setTag('sub-two', sub2Value); // Set "sub-two" as a tag for future events
      logDebug(`Sentry tag 'sub-two' set with value: ${sub2Value}`);
    }
	
// Retrieve the '_fbp' and '_fbc' cookies
const fbpCookie = getCookie('_fbp');
const fbcCookie = getCookie('_fbc');

// Decide which one to use for 'sub5' based on availability
const sub5Value = fbcCookie || fbpCookie;
    if (sub5Value) {
      urlParams.set('sub5', sub5Value);
      logDebug(`sub5 parameter set from fbp cookie: ${sub5Value}`);
    }

    // Get URL slug for 'sub3'
    const pathArray = window.location.pathname.split('/').filter(Boolean);
    const slug = pathArray.pop();
    if (slug && !urlParams.has('sub3')) {
      urlParams.set('sub3', slug);
      logDebug(`sub3 parameter set from URL slug: ${slug}`);
    }

    // Convert updated URL parameters to a query string
    const updatedParams = urlParams.toString();

    // Update all external links with URL parameters
    function updateLinks() {
      const allLinks = document.querySelectorAll('a');
      allLinks.forEach(function(link) {
        if (link.href && !link.href.includes(window.location.hostname)) {
          const linkUrl = new URL(link.href);
          linkUrl.search += (linkUrl.search ? '&' : '?') + updatedParams;
          link.href = linkUrl.href;
          logDebug("Updated link URL: " + link.href);

          // Meta Pixel "Subscribe" event on link click
          link.addEventListener('click', function() {
            //Fire Metea pixel event
            fbq('track', 'Subscribe');
            //Fire Taboola ArticleLinkClick event
            _tfa.push({notify: 'event', name: 'ArticleLinkClick', id: 1790277});
 //Fire Google Article Clicks
  gtag('event', 'conversion', {
      'send_to': 'AW-16661394375/KFtbCL7Q76AaEMfn4og-',
      'value': 1.0,
      'currency': 'USD',
      'transaction_id': ''
  });
            
            //Fire TikTok Pixel event
            if (typeof ttq !== 'undefined') {
            ttq.track('ClickButton'); // Replace 'ClickButton' with your desired TikTok event name
          console.log('TikTok Pixel Event Fired: ClickButton');
            } else {
             console.warn('TikTok Pixel is not loaded.');
            }

          });
        }
      });
    }

    // Initial update of links
    updateLinks();

    // Use MutationObserver for dynamically loaded links
    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    logDebug(`URL parameters applied to all links: ${updatedParams}`);

    // Device-Specific Content Display
    const userAgent = navigator.userAgent.toLowerCase();
    const iosContent = document.querySelector(".ios-content");
    const samsungContent = document.querySelector(".samsung-content");
    const androidContent = document.querySelector(".android-content");
    const desktopContent = document.querySelector(".desktop-content");

    // Hide all content initially
    iosContent.style.display = samsungContent.style.display =
      androidContent.style.display = desktopContent.style.display = "none";

    // Show content based on user agent
    if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ipod")) {
      iosContent.style.display = "block";
    } else if (userAgent.includes("android") && userAgent.includes("sm-")) {
      samsungContent.style.display = "block";
    } else if (userAgent.includes("android")) {
      androidContent.style.display = "block";
    } else {
      desktopContent.style.display = "block";
    }
  });
