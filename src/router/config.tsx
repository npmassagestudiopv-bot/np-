import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AuthGuard from "@/components/base/AuthGuard";
import { landingPages } from "@/mocks/landingPages";

const AdminLoginPage = lazy(() => import("@/pages/admin/login/page"));
const AdminDashboardPage = lazy(() => import("@/pages/admin/dashboard/page"));
const AdminAppointmentsPage = lazy(() => import("@/pages/admin/appointments/page"));
const AdminBlogPage = lazy(() => import("@/pages/admin/blog/page"));
const AdminBlogNewPage = lazy(() => import("@/pages/admin/blog/new/page"));
const AdminBlogEditPage = lazy(() => import("@/pages/admin/blog/edit/page"));
const AdminMessagesPage = lazy(() => import("@/pages/admin/messages/page"));
const AdminHistoryPage = lazy(() => import("@/pages/admin/history/page"));

const Home = lazy(() => import("@/pages/home/page"));
const ServicesPage = lazy(() => import("@/pages/services/page"));
const ServiceDetailPage = lazy(() => import("@/pages/service-detail/page"));
const AboutPage = lazy(() => import("@/pages/about/page"));
const LocationsPage = lazy(() => import("@/pages/locations/page"));
const BlogPage = lazy(() => import("@/pages/blog/page"));
const BlogDetailPage = lazy(() => import("@/pages/blog/detail/page"));
const ContactPage = lazy(() => import("@/pages/contact/page"));
const LandingPageComponent = lazy(() => import("@/pages/landing/page"));
const BookingPage = lazy(() => import("@/pages/booking/page"));
const PrivacyPolicyPage = lazy(() => import("@/pages/privacy/page"));
const TermsPage = lazy(() => import("@/pages/terms/page"));
const CookiePolicyPage = lazy(() => import("@/pages/cookies/page"));
const EntityPage = lazy(() => import("@/pages/entity/page"));
const VouchersPage = lazy(() => import("@/pages/vouchers/page"));
const MassageComparisonPage = lazy(() => import("@/pages/massage-comparison/page"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageFallback() {
  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-foreground-500">Зареждане...</p>
      </div>
    </div>
  );
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

const routes: RouteObject[] = [
  // Admin routes
  { path: "/admin/login", element: <LazyPage><AdminLoginPage /></LazyPage> },
  { path: "/admin", element: <LazyPage><AuthGuard><AdminDashboardPage /></AuthGuard></LazyPage> },
  { path: "/admin/appointments", element: <LazyPage><AuthGuard><AdminAppointmentsPage /></AuthGuard></LazyPage> },
  { path: "/admin/blog", element: <LazyPage><AuthGuard><AdminBlogPage /></AuthGuard></LazyPage> },
  { path: "/admin/blog/new", element: <LazyPage><AuthGuard><AdminBlogNewPage /></AuthGuard></LazyPage> },
  { path: "/admin/blog/:id/edit", element: <LazyPage><AuthGuard><AdminBlogEditPage /></AuthGuard></LazyPage> },
  { path: "/admin/messages", element: <LazyPage><AuthGuard><AdminMessagesPage /></AuthGuard></LazyPage> },
  { path: "/admin/history", element: <LazyPage><AuthGuard><AdminHistoryPage /></AuthGuard></LazyPage> },

  // Public routes
  { path: "/", element: <LazyPage><Home /></LazyPage> },
  { path: "/en", element: <LazyPage><Home /></LazyPage> },
  { path: "/uslugi", element: <LazyPage><ServicesPage /></LazyPage> },
  { path: "/en/services", element: <LazyPage><ServicesPage /></LazyPage> },
  { path: "/uslugi/:slug", element: <LazyPage><ServiceDetailPage /></LazyPage> },
  { path: "/en/services/:slug", element: <LazyPage><ServiceDetailPage /></LazyPage> },
  // Redirect misspelled "aromatherapy" → "aromaterapiya"
  { path: "/uslugi/aromatherapy", element: <Navigate to="/uslugi/aromaterapiya" replace /> },
  { path: "/en/services/aromatherapy", element: <Navigate to="/en/services/aromaterapiya" replace /> },
  { path: "/za-nas", element: <LazyPage><AboutPage /></LazyPage> },
  { path: "/en/about", element: <LazyPage><AboutPage /></LazyPage> },
  { path: "/lokacii", element: <LazyPage><LocationsPage /></LazyPage> },
  { path: "/en/locations", element: <LazyPage><LocationsPage /></LazyPage> },
  { path: "/blog", element: <LazyPage><BlogPage /></LazyPage> },
  { path: "/en/blog", element: <LazyPage><BlogPage /></LazyPage> },
  { path: "/blog/:slug", element: <LazyPage><BlogDetailPage /></LazyPage> },
  { path: "/en/blog/:slug", element: <LazyPage><BlogDetailPage /></LazyPage> },
  { path: "/kontakti", element: <LazyPage><ContactPage /></LazyPage> },
  { path: "/en/contact", element: <LazyPage><ContactPage /></LazyPage> },
  { path: "/rezervaciya", element: <LazyPage><BookingPage /></LazyPage> },
  { path: "/en/booking", element: <LazyPage><BookingPage /></LazyPage> },
  { path: "/politika-poveritelnost", element: <LazyPage><PrivacyPolicyPage /></LazyPage> },
  { path: "/en/privacy", element: <LazyPage><PrivacyPolicyPage /></LazyPage> },
  { path: "/obshti-usloviya", element: <LazyPage><TermsPage /></LazyPage> },
  { path: "/en/terms", element: <LazyPage><TermsPage /></LazyPage> },
  { path: "/politika-biskvitki", element: <LazyPage><CookiePolicyPage /></LazyPage> },
  { path: "/en/cookies", element: <LazyPage><CookiePolicyPage /></LazyPage> },
  { path: "/za-np-massage-studio", element: <LazyPage><EntityPage /></LazyPage> },
  { path: "/en/about-np-massage-studio", element: <LazyPage><EntityPage /></LazyPage> },
  { path: "/vaucheri", element: <LazyPage><VouchersPage /></LazyPage> },
  { path: "/en/vouchers", element: <LazyPage><VouchersPage /></LazyPage> },
  { path: "/videos-masazhi", element: <LazyPage><MassageComparisonPage /></LazyPage> },
  { path: "/en/videos-masazhi", element: <LazyPage><MassageComparisonPage /></LazyPage> },
  ...landingPages.map((lp) => ({
    path: `/${lp.path}`,
    element: (
      <LazyPage>
        <LandingPageComponent title={lp.title} description={lp.description} location={lp.location} service={lp.service} canonicalPath={lp.path === 'naj-dobar-masazh-veliko-tarnovo' ? '/masazhi-veliko-tarnovo' : `/${lp.path}`} />
      </LazyPage>
    ),
  })),
  // 301 redirects: *-tarnovo → *-veliko-tarnovo
  { path: "/klassicheski-masazh-tarnovo", element: <Navigate to="/klassicheski-masazh-veliko-tarnovo" replace /> },
  { path: "/sporten-masazh-tarnovo", element: <Navigate to="/sporten-masazh-veliko-tarnovo" replace /> },
  { path: "/anticeluliten-masazh-tarnovo", element: <Navigate to="/anticeluliten-masazh-veliko-tarnovo" replace /> },
  { path: "/aromaterapiya-tarnovo", element: <Navigate to="/aromaterapiya-veliko-tarnovo" replace /> },
  { path: "/masazh-grab-tarnovo", element: <Navigate to="/masazh-grab-veliko-tarnovo" replace /> },
  { path: "/relaksirasht-masazh-tarnovo", element: <Navigate to="/relaksirasht-masazh-veliko-tarnovo" replace /> },
  { path: "/lecheben-masazh-tarnovo", element: <Navigate to="/lecheben-masazh-veliko-tarnovo" replace /> },
  { path: "/turski-masazh-tarnovo", element: <Navigate to="/turski-masazh-veliko-tarnovo" replace /> },
  { path: "/dubok-takannen-masazh-tarnovo", element: <Navigate to="/dubok-takannen-masazh-veliko-tarnovo" replace /> },
  { path: "*", element: <LazyPage><NotFound /></LazyPage> },
];

export default routes;