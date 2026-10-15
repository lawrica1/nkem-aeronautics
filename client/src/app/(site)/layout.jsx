import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AssistantWidget } from "@/components/AssistantWidget";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <AssistantWidget />
    </>
  );
}
