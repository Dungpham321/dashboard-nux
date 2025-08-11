import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as brands from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
const dynamicIcons: (keyof typeof brands)[] = ["faGithub", "faTwitter"]

dynamicIcons.forEach((iconName) => {
  const icon = brands[iconName] as IconDefinition;
  if (icon) {
    library.add(icon);
  }
});

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
});
