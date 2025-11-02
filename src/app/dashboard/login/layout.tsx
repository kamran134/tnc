/**
 * Layout для login страницы
 * НЕ требует аутентификации и НЕ использует DashboardClientWrapper
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
