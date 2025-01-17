import type { CMSClient } from ".";
import { createContentfulClient } from "./contentful/client";

/**
 * create CMS client
 *
 * CAN NOT USE IN BROWSER ENVIRONMENT (server only)
 */
export const cmsClient = (): CMSClient => createContentfulClient();
