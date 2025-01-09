import { requireAdminLogin } from "./requireAdmin";

export const onRequest = requireAdminLogin;
