import "./globals.css";
import { Providers } from "./providers";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

export const metadata = {
  title: "Nkem Aeronautics",
  description:
    "Advanced aerial UAV solutions for agriculture, wildlife & surveillance, and mining across Zambia and Africa.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
