import { Helmet } from "react-helmet-async";

import siteConfig from "../../data/siteConfig";

function SEO({
  title,
  description,
  canonicalUrl,
  openGraph,
  structuredData,
  noindex = false,
}) {
  const resolvedTitle = title || siteConfig.defaultTitle;
  const resolvedDescription = description || siteConfig.defaultDescription;
  const resolvedUrl = canonicalUrl || siteConfig.url;
  const og = openGraph || {};

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={resolvedUrl} />

      <meta property="og:title" content={og.title || resolvedTitle} />
      <meta property="og:description" content={og.description || resolvedDescription} />
      <meta property="og:type" content={og.type || "website"} />
      <meta property="og:url" content={og.url || resolvedUrl} />
      <meta property="og:site_name" content={siteConfig.siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={og.title || resolvedTitle} />
      <meta name="twitter:description" content={og.description || resolvedDescription} />

      {og.image ? <meta property="og:image" content={og.image} /> : null}
      {og.image ? <meta name="twitter:image" content={og.image} /> : null}
      {structuredData ? <script type="application/ld+json">{JSON.stringify(structuredData)}</script> : null}
    </Helmet>
  );
}

export default SEO;
