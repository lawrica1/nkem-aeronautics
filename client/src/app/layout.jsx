import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Nkem Aeronautics Ltd",
  description:
    "Advanced aerial UAV solutions for agriculture, wildlife & surveillance, and real estate across Zambia and Sub-Saharan Africa.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
