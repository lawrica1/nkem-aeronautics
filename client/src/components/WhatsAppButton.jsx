import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "237670439117";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="animate-float fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-brand-green text-white shadow-lg transition-transform hover:scale-110"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
