import { Footer } from "./components/design/Footer/Footer";
import { FooterClient } from "./components/design/Footer/FooterClient";
import { HeaderClient } from "./components/design/SiteHeader/HeaderClient";
import { SiteHeader } from "./components/design/SiteHeader/SiteHeader";
import Providers from "./providers";
import "./styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerDefaultProps = SiteHeader.defaultProps;
  const footerDefaultProps = Footer.defaultProps;
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <HeaderClient {...headerDefaultProps} />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <FooterClient {...footerDefaultProps} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
