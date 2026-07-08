import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import useSiteSettings from "../../hooks/useSiteSettings";

function SiteMetadata() {
  const location = useLocation();
  const { siteConfig } = useSiteSettings();
  const googleVerification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;
  const bingVerification = import.meta.env.VITE_BING_SITE_VERIFICATION;
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

  useEffect(() => {
    if (!gaMeasurementId || typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("config", gaMeasurementId, {
      page_path: `${location.pathname}${location.search}`,
      page_location: window.location.href,
    });
  }, [gaMeasurementId, location.pathname, location.search]);

  return (
    <Helmet>
      <meta property="og:site_name" content={siteConfig.siteName} />
      {googleVerification ? <meta name="google-site-verification" content={googleVerification} /> : null}
      {bingVerification ? <meta name="msvalidate.01" content={bingVerification} /> : null}
      {gaMeasurementId ? <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} /> : null}
      {gaMeasurementId ? (
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}', { send_page_view: false });
          `}
        </script>
      ) : null}
      {clarityProjectId ? (
        <script>
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");
          `}
        </script>
      ) : null}
    </Helmet>
  );
}

export default SiteMetadata;