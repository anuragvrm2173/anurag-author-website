import { createContext } from "react";

import fallbackSiteConfig from "../data/siteConfig";
import fallbackSocialLinks from "../data/socialLinks";

const SiteSettingsContext = createContext({
  siteConfig: fallbackSiteConfig,
  socialLinks: fallbackSocialLinks,
  loading: false,
  error: null,
});

export default SiteSettingsContext;