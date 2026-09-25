import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import CookieBanner from "./components/feature/CookieBanner";
import ScrollToTop from "./components/feature/ScrollToTop";
import PageLoader from "./components/feature/PageLoader";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <ScrollToTop />
          <PageLoader />
          <a href="#main-content" className="skip-to-content">Skip to content</a>
          <AppRoutes />
          <CookieBanner />
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;