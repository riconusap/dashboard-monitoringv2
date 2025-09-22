import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    heading: "dashboard",
    route: "/dashboard",
    keenthemesIcon: "black-right",
    bootstrapIcon: "bi-arrow-right",
    pages: [],
  },
  {
    heading: "layoutBuilder",
    route: "/builder",
    keenthemesIcon: "black-right",
    bootstrapIcon: "bi-arrow-right",
    pages: [],
  },
  {
    sectionTitle: "crafted",
    keenthemesIcon: "abstract-39",
    bootstrapIcon: "bi-arrow-right",
    pages: [
      {
        sectionTitle: "account",
        route: "/account",
        keenthemesIcon: "profile-circle",
        bootstrapIcon: "bi-arrow-right",
        sub: [
          {
            heading: "accountOverview",
            route: "/crafted/account/overview",
          },
          {
            heading: "settings",
            route: "/crafted/account/settings",
          },
        ],
      },
      {
        sectionTitle: "authentication",
        keenthemesIcon: "fingerprint-scanning",
        bootstrapIcon: "bi-arrow-right",
        sub: [
          {
            sectionTitle: "basicFlow",
            sub: [
              {
                heading: "signIn",
                route: "/sign-in",
              },
              {
                heading: "signUp",
                route: "/sign-up",
              },
              {
                heading: "passwordReset",
                route: "/password-reset",
              },
            ],
          },
          {
            heading: "error404",
            route: "/404",
          },
          {
            heading: "error500",
            route: "/500",
          },
        ],
      },
      {
        sectionTitle: "modals",
        route: "/modals",
        keenthemesIcon: "design",
        bootstrapIcon: "bi-arrow-right",
        sub: [
          {
            heading: "viewUsers",
            route: "/crafted/modals/general/view-user",
          },
        ],
      },
    ],
  },
  {
    sectionTitle: "management",
    route: "/management",
    keenthemesIcon: "black-right",
    bootstrapIcon: "bi-arrow-right",
    pages: [
      {
        sectionTitle: "users",
        route: "/users",
        keenthemesIcon: "abstract-38",
        bootstrapIcon: "bi-arrow-right",
        sub: [
          {
            heading: "usersList",
            route: "/users/list",
          },
          {
            heading: "userDetails",
            route: "/users/details",
          },
        ],
      },
    ],
  },
];

export default MainMenuConfig;
