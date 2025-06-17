import { createRootRoute } from "@tanstack/react-router";
import { homePageRoute } from "./homepage";
import { authRoute } from "./auth";
import { dashboardRoute } from "./dashboard";
import RootLayout from "../RootLayout";

export const rootRoute = createRootRoute({
  component: RootLayout,
});

export const routeTree = rootRoute.addChildren([
  homePageRoute,
  authRoute,
  dashboardRoute,
]);
