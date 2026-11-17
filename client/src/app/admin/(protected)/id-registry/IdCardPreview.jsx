import Image from "next/image";
import { UserRound } from "lucide-react";

// Credit-card size (85.6 × 54 mm), so the preview has the printed card's proportions.
const CARD = "relative aspect-[85.6/54] w-full max-w-sm overflow-hidden rounded-xl border border-border bg-white shadow-md";

const dateOrBlank = (value) => (value ? value.slice(0, 10) : "—");

function Stamp({ status }) {
  if (!status || status === "active") return null;
  return (
    <span
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-md border-4 px-3 py-1 text-2xl font-black tracking-widest uppercase opacity-80 ${
        status === "lost" ? "border-red-600 text-red-600" : "border-gray-500 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-2 bg-brand-navy px-3 py-2 text-white">
      <Image src="/images/logo.png" alt="" width={20} height={20} className="size-5 rounded-full" />
      <p className="text-[11px] font-bold tracking-wide">NKEM AERONAUTICS LTD</p>
    </div>
  );
}

// Front and back of the printed staff ID card. card: form values plus employeeId/status when known.
export function IdCardPreview({ card }) {
  const isDirector = card.cardType === "director";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <figure>
        <figcaption className="mb-1.5 text-xs font-semibold text-muted-foreground">Front</figcaption>
        <div className={CARD}>
          <Header />
          <div className="flex gap-3 p-3">
            <div className="flex aspect-[3/4] w-[30%] shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-slate-100">
              {card.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={card.photoUrl} alt={card.fullName} className="size-full object-cover" />
              ) : (
                <UserRound className="size-8 text-slate-400" aria-label="No photo" />
              )}
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-sm font-bold text-brand-navy-dark">{card.fullName || "Full name"}</p>
              <p className="truncate text-xs text-slate-600">{card.jobTitle || "Job title"}</p>
              <p className="truncate text-xs text-slate-500">{card.department || "Department"}</p>
              <p className="pt-1 font-mono text-[11px] text-brand-navy-dark">
                {card.employeeId || `NKEM-${isDirector ? "DIR" : "EMP"}-####`}
              </p>
            </div>
          </div>
          <p
            className={`absolute inset-x-0 bottom-0 py-1 text-center text-[11px] font-bold tracking-[0.2em] text-white uppercase ${
              isDirector ? "bg-amber-600" : "bg-brand-blue"
            }`}
          >
            {isDirector ? "Director" : "Employee"}
          </p>
          <Stamp status={card.status} />
        </div>
      </figure>

      <figure>
        <figcaption className="mb-1.5 text-xs font-semibold text-muted-foreground">Back</figcaption>
        <div className={CARD}>
          <Header />
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 px-3 pt-2 text-[11px]">
            <dt className="text-slate-500">Issued</dt>
            <dd className="font-medium text-brand-navy-dark">{dateOrBlank(card.issueDate)}</dd>
            <dt className="text-slate-500">Expires</dt>
            <dd className="font-medium text-brand-navy-dark">{dateOrBlank(card.expiryDate)}</dd>
            <dt className="text-slate-500">Country</dt>
            <dd className="truncate font-medium text-brand-navy-dark">{card.country || "—"}</dd>
          </dl>
          <p className="px-3 pt-2 text-[10px] leading-snug text-slate-500">
            This card is the property of Nkem Aeronautics Ltd and must be returned on request. If found, please return
            it to any Nkem Aeronautics office.
          </p>
          <div className="absolute inset-x-3 bottom-2 border-t border-slate-400 pt-0.5 text-[9px] text-slate-500">
            Authorised signature
          </div>
          <Stamp status={card.status} />
        </div>
      </figure>
    </div>
  );
}
