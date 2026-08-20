import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { Contact } from "@/pages/Contact";
import { LogbookPortal } from "@/pages/LogbookPortal";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const FULL_BLEED_ROUTES = ["/login", "/signup"];

function App() {
  const { pathname } = useLocation();
  const isFullBleed = FULL_BLEED_ROUTES.includes(pathname);

  return (
    <>
      {!isFullBleed && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/logbook" element={<LogbookPortal />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {!isFullBleed && <Footer />}
      {!isFullBleed && <WhatsAppButton />}
    </>
  );
}

export default App;
