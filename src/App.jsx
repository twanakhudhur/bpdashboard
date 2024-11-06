import ThemeProvider from "./context/themeContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layout/rootLayout";
import SettingsLayout from "./layout/settingsLayout";

import { Toaster } from "./components/ui/toaster";
import {
  CountryPage,
  Dashboard,
  Login,
  PiecePage,
  RollQualityPage,
  RollPage,
  SlitPage,
  TamburPage,
  UserPage,
  WastePage,
  RollTypePage,
  LinePage,
} from "./pages";
import { useGetCurrentUserQuery } from "./services/authApi";
import ProtectedRoute from "./auth/protectedRoute";

const App = () => {
  useGetCurrentUserQuery();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "/rolls",
          element: <RollPage />,
        },
        {
          path: "/slits",
          element: <SlitPage />,
        },
        {
          path: "/pieces",
          element: <PiecePage />,
        },
        {
          path: "/wastes",
          element: <WastePage />,
        },
        {
          path: "/tamburs",
          element: <TamburPage />,
        },
        {
          path: "/settings",
          element: <SettingsLayout />,
          children: [
            {
              path: "users",
              element: <UserPage />,
            },
            {
              path: "countries",
              element: <CountryPage />,
            },
            {
              path: "rollQualities",
              element: <RollQualityPage />,
            },
            {
              path: "rollTypes",
              element: <RollTypePage />,
            },
            {
              path: "lines",
              element: <LinePage />,
            },
          ],
        },
        {
          path: "*",
          element: <>404</>,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "*",
      element: <>404</>,
    },
  ]);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
