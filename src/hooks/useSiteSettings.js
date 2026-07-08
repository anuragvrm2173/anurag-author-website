import { useContext } from "react";

import SiteSettingsContext from "../context/siteSettingsContextValue";

function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export default useSiteSettings;