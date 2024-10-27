import { PageContainer } from "../_components/page-container";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageContainer>{children}</PageContainer>;
}
