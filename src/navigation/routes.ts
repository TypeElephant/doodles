type Routes<T extends string> = Record<T, T>

export type NavigatorRoute = "TabNavigator"

export const NavigatorRoutes: Routes<NavigatorRoute> = {
  TabNavigator: "TabNavigator",
}

export type TabRoute = "Tab1" | "Tab2" | "Tab3" | "Tab4" | "Tab5"

export const TabLabels: Record<TabRoute, string> = {
  Tab1: "",
  Tab2: "",
  Tab3: "",
  Tab4: "",
  Tab5: "",
}

export const TabRoutes: Routes<TabRoute> = {
  Tab1: "Tab1",
  Tab2: "Tab2",
  Tab3: "Tab3",
  Tab4: "Tab4",
  Tab5: "Tab5",
}

type UnauthenticatedRoute = "SignIn" | "SignUp"

export const UnauthenticatedRoutes: Routes<UnauthenticatedRoute> = {
  SignIn: "SignIn",
  SignUp: "SignUp",
}
