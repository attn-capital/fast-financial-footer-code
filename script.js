(function() {
  // ================== Core Constants ==================
  const COOKIE_TTL = 2592000; // 30 days in seconds

  // ================== Utility Functions ==================
  const parseCookies = () => {
    return document.cookie.split(';').reduce((cookies, str) => {
      const [key, value] = str.split('=').map(s => s.trim());
      if (key) cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});
  };

  // ================== Enhanced sub5 Handling ==================
  const resolveSub5 = () => {
    try {
      const cookies = parseCookies();
      const urlParams = new URLSearchParams(window.location.search);

      const sources = [
        { value: cookies._fbc, type: 'facebook_fbc' },
        { value: cookies._fbp, type: 'facebook_fbp' },
        { value: urlParams.get('sub5'), type: 'url_param' },
        { value: cookies.sub5_backup, type: 'backup_cookie' }
      ];

      const validSource = sources.find(s => s.value);
      if (validSource) return validSource;

      const newId = `sub5_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      document.cookie = `sub5_backup=${newId}; path=/; max-age=${COOKIE_TTL}; SameSite=Lax`;
      return { value: newId, type: 'generated' };

    } catch (err) {
      console.error('sub5 Resolution Error:', err);
      return { value: 'error', type: 'error' };
    }
  };

  // ================== Device Detection ==================
  const detectDevice = () => {
    const ua = navigator.userAgent.toLowerCase();
    return {
      isIOS: /iphone|ipad|ipod/.test(ua),
      isSamsung: /samsung|sm-|galaxy/.test(ua),
      isAndroid: /android/.test(ua)
    };
  };

  const displayDeviceContent = () => {
    document.querySelectorAll('.device-content').forEach(el => {
      el.style.display = 'none';
    });

    const { isIOS, isSamsung, isAndroid } = detectDevice();
    let deviceType = 'desktop';

    if (isIOS) deviceType = 'ios';
    else if (isSamsung) deviceType = 'samsung';
    else if (isAndroid) deviceType = 'android';

    const contentEl = document.querySelector(`.${deviceType}-content`);
    if (contentEl) {
      contentEl.style.display = 'block';
      console.log(`Displaying ${deviceType} content`);
    } else {
      console.error(`Missing ${deviceType}-content element`);
      const fallbackEl = document.querySelector('.desktop-content');
      if (fallbackEl) {
        fallbackEl.style.display = 'block';
      }
    }
  };

  // ================== Link Management ==================
  const updateLinks = (params) => {
    document.querySelectorAll('a').forEach(link => {
      if (!link.href.includes(window.location.hostname)) {
        try {
          const url = new URL(link.href);
          params.forEach((value, key) => url.searchParams.set(key, value));
          link.href = url.toString();

          if (!link.dataset.tracked) {
            link.addEventListener('click', () => {
              fbq('track', 'Subscribe');
              _tfa.push({ notify: 'event', name: 'ArticleLinkClick', id: 1790277 });
              gtag('event', 'conversion', {
                'send_to': 'AW-16661394375/KFtbCL7Q76AaEMfn4og-',
                'value': 1.0,
                'currency': 'USD'
              });
              ttq?.track('ClickButton');
            });
            link.dataset.tracked = true;
          }
        } catch (err) {
          console.error('Link processing failed:', err);
        }
      }
    });
  };

  // ================== Main Logic ==================
  const initializeApp = () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (!urlParams.has('sub2')) {
      const utmSource = urlParams.get('utm_term') || urlParams.get('utm_source') || 'default';
      urlParams.set('sub2', utmSource);
      console.log('sub2 set from UTM:', utmSource);
    }

    const slug = window.location.pathname.split('/').pop();
    if (slug && !urlParams.has('sub3')) {
      urlParams.set('sub3', slug);
      console.log('sub3 set from slug:', slug);
    }

    const sub5Data = resolveSub5();
    urlParams.set('sub5', sub5Data.value);
    console.info('Final Tracking Parameters:', {
      sub2: urlParams.get('sub2'),
      sub3: urlParams.get('sub3'),
      sub5: sub5Data.value,
      sub5_source: sub5Data.type
    });

    displayDeviceContent();
    updateLinks(urlParams);

    let updateTimeout;
    new MutationObserver(() => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => updateLinks(urlParams), 100);
    }).observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  document.addEventListener('DOMContentLoaded', initializeApp);
  window.addEventListener('load', () => {
    setTimeout(initializeApp, 3000);
  });
})();
