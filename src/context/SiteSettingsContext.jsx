import { useEffect, useMemo, useState } from "react";

import fallbackSiteConfig from "../data/siteConfig";
import fallbackSocialLinks from "../data/socialLinks";
import { hasSupabase, supabase } from "../services/supabaseClient";
import SiteSettingsContext from "./siteSettingsContextValue";

function mergeSiteConfig(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return fallbackSiteConfig;
  }

  return {
    ...fallbackSiteConfig,
    ...value,
    url: String(value.url || fallbackSiteConfig.url).replace(/\/+$/, ""),
  };
}

function resolveSocialLinks(value) {
  return Array.isArray(value) && value.length > 0 ? value : fallbackSocialLinks;
}

async function fetchPublicSiteSettings() {
  if (!hasSupabase()) {
    return {
      siteConfig: fallbackSiteConfig,
      socialLinks: fallbackSocialLinks,
    };
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("id, value")
    .in("id", ["site", "socialLinks"]);

  if (error) {
    throw error;
  }

  const rows = data || [];
  const siteRow = rows.find((row) => row.id === "site");
  const socialLinksRow = rows.find((row) => row.id === "socialLinks");

  return {
    siteConfig: mergeSiteConfig(siteRow?.value),
    socialLinks: resolveSocialLinks(socialLinksRow?.value),
  };
}

export function SiteSettingsProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(fallbackSiteConfig);
  const [socialLinks, setSocialLinks] = useState(fallbackSocialLinks);
  const [loading, setLoading] = useState(hasSupabase());
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (!hasSupabase()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const next = await fetchPublicSiteSettings();
        if (!isActive) {
          return;
        }

        setSiteConfig(next.siteConfig);
        setSocialLinks(next.socialLinks);
        setError(null);
      } catch (nextError) {
        if (!isActive) {
          return;
        }

        setError(nextError);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isActive = false;
    };
  }, []);

  const value = useMemo(() => ({
    siteConfig,
    socialLinks,
    loading,
    error,
  }), [error, loading, siteConfig, socialLinks]);

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}