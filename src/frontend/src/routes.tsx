import { lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
} from "react-router-dom";
import ContextWrapper from "./contexts";
import CustomDashboardWrapperPage from "./customization/components/custom-DashboardWrapperPage";
import { CustomNavigate } from "./customization/components/custom-navigate";
import { BASENAME } from "./customization/config-constants";
import {
  ENABLE_CUSTOM_PARAM,
  ENABLE_FILE_MANAGEMENT,
} from "./customization/feature-flags";
import { CustomRoutesStore } from "./customization/utils/custom-routes-store";
import { CustomRoutesStorePages } from "./customization/utils/custom-routes-store-pages";
import { AppAuthenticatedPage } from "./pages/AppAuthenticatedPage";
import { AppWrapperPage } from "./pages/AppWrapperPage";
import FlowPage from "./pages/FlowPage";
import LoginPage from "./pages/LoginPage";
import FilesPage from "./pages/MainPage/pages/filesPage";
import HomePage from "./pages/MainPage/pages/homePage";
import KnowledgePage from "./pages/MainPage/pages/knowledgePage";
import CollectionPage from "./pages/MainPage/pages/main-page";
import SettingsPage from "./pages/SettingsPage";
import ApiKeysPage from "./pages/SettingsPage/pages/ApiKeysPage";
import GeneralPage from "./pages/SettingsPage/pages/GeneralPage";
import GlobalVariablesPage from "./pages/SettingsPage/pages/GlobalVariablesPage";
import MCPServersPage from "./pages/SettingsPage/pages/MCPServersPage";
import MessagesPage from "./pages/SettingsPage/pages/messagesPage";
import ShortcutsPage from "./pages/SettingsPage/pages/ShortcutsPage";
import ViewPage from "./pages/ViewPage";

const AdminPage = lazy(() => import("./pages/AdminPage"));
const LoginAdminPage = lazy(() => import("./pages/AdminPage/LoginPage"));
const DeleteAccountPage = lazy(() => import("./pages/DeleteAccountPage"));

const PlaygroundPage = lazy(() => import("./pages/Playground"));

const SignUp = lazy(() => import("./pages/SignUpPage"));

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/playground/:id/">
      <Route
        path=""
        element={
          <ContextWrapper key={1}>
            <PlaygroundPage />
          </ContextWrapper>
        }
      />
    </Route>,
    <Route
      path={ENABLE_CUSTOM_PARAM ? "/:customParam?" : "/"}
      element={
        <ContextWrapper key={2}>
          <Outlet />
        </ContextWrapper>
      }
    >
      {/* Directly render the authenticated app without login check */}
      <Route path="" element={<AppAuthenticatedPage />}>
        <Route path="" element={<AppWrapperPage />}>
          <Route path="" element={<CustomDashboardWrapperPage />}>
            <Route path="" element={<CollectionPage />}>
              <Route
                index
                element={<CustomNavigate replace to={"flows"} />}
              />
              {ENABLE_FILE_MANAGEMENT && (
                <Route path="assets">
                  <Route
                    index
                    element={<CustomNavigate replace to="files" />}
                  />
                  <Route path="files" element={<FilesPage />} />
                  <Route
                    path="knowledge-bases"
                    element={<KnowledgePage />}
                  />
                </Route>
              )}
              <Route
                path="flows/"
                element={<HomePage key="flows" type="flows" />}
              />
              <Route
                path="components/"
                element={<HomePage key="components" type="components" />}
              >
                <Route
                  path="folder/:folderId"
                  element={<HomePage key="components" type="components" />}
                />
              </Route>
              <Route
                path="all/"
                element={<HomePage key="flows" type="flows" />}
              >
                <Route
                  path="folder/:folderId"
                  element={<HomePage key="flows" type="flows" />}
                />
              </Route>
              <Route
                path="mcp/"
                element={<HomePage key="mcp" type="mcp" />}
              >
                <Route
                  path="folder/:folderId"
                  element={<HomePage key="mcp" type="mcp" />}
                />
              </Route>
            </Route>
            <Route path="settings" element={<SettingsPage />}>
              <Route
                index
                element={<CustomNavigate replace to={"general"} />}
              />
              <Route
                path="global-variables"
                element={<GlobalVariablesPage />}
              />
              <Route path="mcp-servers" element={<MCPServersPage />} />
              <Route path="api-keys" element={<ApiKeysPage />} />
              <Route
                path="general/:scrollId?"
                element={<GeneralPage />}
              />
              <Route path="shortcuts" element={<ShortcutsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              {CustomRoutesStore()}
            </Route>
            {CustomRoutesStorePages()}
            <Route path="account">
              <Route path="delete" element={<DeleteAccountPage />}></Route>
            </Route>
            <Route path="admin" element={<AdminPage />} />
          </Route>
          <Route path="flow/:id/">
            <Route path="" element={<CustomDashboardWrapperPage />}>
              <Route path="folder/:folderId/" element={<FlowPage />} />
              <Route path="" element={<FlowPage />} />
            </Route>
            <Route path="view" element={<ViewPage />} />
          </Route>
        </Route>
      </Route>

      {/* Login routes WITHOUT ProtectedLoginRoute wrapper */}
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="login/admin" element={<LoginAdminPage />} />

      {/* Redirect unknown routes to root */}
      <Route path="*" element={<CustomNavigate replace to="/" />} />
    </Route>,
  ]),
  { basename: BASENAME || undefined },
);

export default router;
