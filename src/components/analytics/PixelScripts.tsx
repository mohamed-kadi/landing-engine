import Script from 'next/script';

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
const googleAdsConversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID?.trim();
const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim();

const googleTagId = ga4MeasurementId || googleAdsConversionId;

export function PixelScripts() {
  return (
    <>
      {metaPixelId && (
        <Script id="meta-pixel-bootstrap" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;
              n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
              t=b.createElement(e);t.async=!0;t.src=v;
              s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
            }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${JSON.stringify(metaPixelId)});
          `}
        </Script>
      )}

      {googleTagId && (
        <>
          <Script id="google-tag-bootstrap" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${
                ga4MeasurementId
                  ? `gtag('config', ${JSON.stringify(ga4MeasurementId)}, { send_page_view: false });`
                  : ''
              }
              ${
                googleAdsConversionId
                  ? `gtag('config', ${JSON.stringify(googleAdsConversionId)}, { send_page_view: false });`
                  : ''
              }
            `}
          </Script>
          <Script
            id="google-tag-manager"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagId)}`}
            strategy="afterInteractive"
          />
        </>
      )}

      {tiktokPixelId && (
        <Script id="tiktok-pixel-bootstrap" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){
                var r="https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};
                var s=d.createElement("script");s.type="text/javascript";s.async=!0;s.src=r+"?sdkid="+e+"&lib="+t;
                var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(s,a)
              };
              ttq.load(${JSON.stringify(tiktokPixelId)});
            }(window, document, 'ttq');
          `}
        </Script>
      )}
    </>
  );
}
