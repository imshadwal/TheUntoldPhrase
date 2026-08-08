import { Helmet } from 'react-helmet-async'
import site from '../../content/site.json'
import { absoluteUrl, ogImageUrl } from '../../lib/siteUrl'

/**
 * Shared head tags: title, description, canonical, OG/Twitter, optional JSON-LD.
 */
export default function Seo({
  title,
  description = site.defaultDescription || site.supportLine,
  path = '/',
  image,
  type = 'website',
  jsonLd,
  noIndex = false,
}) {
  const fullTitle = title.includes(site.brand) ? title : `${title} · ${site.brand}`
  const url = absoluteUrl(path)
  const img = ogImageUrl(image)

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={site.brand} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  )
}
