export function Partners() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 px-6 py-16 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/partners/partners-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-brand-navy-dark/80" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-4 text-center">
        <p className="text-xs font-semibold tracking-widest text-brand-gold uppercase">
          In Partnership With
        </p>
        <div className="rounded-lg bg-white/95 p-3 shadow-lg">
          <img
            src="/images/partners/soweda-logo.jpg"
            alt="South West Development Authority (SOWEDA)"
            className="h-20 w-auto"
          />
        </div>
        <p className="text-sm text-white/70">South West Development Authority (SOWEDA)</p>
      </div>
    </section>
  );
}
