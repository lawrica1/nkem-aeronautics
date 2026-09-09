"use client";

import { MapPin, Users, FileText, ShieldCheck, Rocket, BadgeCheck } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Milestone figures reused from the About copy (founding year, patent counts, qualifications) —
// no separate Milestone copy was supplied by the client; confirm this is the intended presentation.
const MILESTONES = [
  { icon: Rocket, value: "2022", label: "R&D initiated" },
  { icon: BadgeCheck, value: "2026", label: "Officially registered" },
  { icon: Users, value: "200+", label: "Employees, 60% researchers & developers" },
  { icon: FileText, value: "700+", label: "Intellectual properties applied for" },
  { icon: ShieldCheck, value: "500+", label: "Patents authorized for drones" },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function AboutTab() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-16">
      <p className="text-lg leading-relaxed text-brand-navy-dark">
        Nkem Aeronautics focuses on autonomous flight, UAV control systems and digital sky
        operation technologies. By leveraging big data and artificial intelligence, we make UAVs
        safer, smarter, and more economical — enabling the sky to better serve a wide range of
        industries.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about/manufacturing-facility.jpeg"
          alt="Nkem Aeronautics manufacturing facility"
          className="aspect-video w-full rounded-xl object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/about/patents-wall.jpeg"
          alt="Wall of Nkem Aeronautics patent and intellectual property certificates"
          className="aspect-video w-full rounded-xl object-cover"
        />
      </div>

      <p className="text-lg leading-relaxed text-brand-navy-dark">
        Initiated in 2022 and officially registered in 2026, Nkem Aeronautics has over four years
        of independent experience in the R&amp;D and manufacturing of UAV "brains" — flight
        control systems. Our headquarters is located in Lusaka, Zambia.
      </p>
      <p className="text-lg leading-relaxed text-brand-navy-dark">
        Our business now covers complete drone systems, integrated sensors, high-precision
        payloads and industry-specific application software. These technologies are widely used
        in agricultural crop protection, logistics and delivery, powerline inspection, and public
        safety management.
      </p>
      <p className="text-lg leading-relaxed text-brand-navy-dark">
        Of more than 200 employees in our company, 60% are researchers and developers. The core
        R&amp;D personnel, having graduated from University of Bamenda, University of Buea, The
        Copperbelt University, Kwame Nkrumah University, Zambia University College of Technology
        (ZUT) and other well-known colleges and universities, possess rich experience and
        established technologies for the R&amp;D of military aircraft and large flight vehicles.
        Most main parts are manufactured in-house.
      </p>
      <p className="text-lg leading-relaxed text-brand-navy-dark">
        Since its foundation, Nkem has been making breakthroughs in technology, with 700+
        intellectual properties applied for and almost 500+ patents authorized for drones. Nkem
        holds qualifications including High Technology Enterprise, among others. Our UAVs have
        passed Africa's harsh climate tests.
      </p>

      <div className="grid gap-6 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-5">
        {MILESTONES.map(({ icon: Icon, value, label }) => (
          <div key={label} className="rounded-2xl border border-border bg-background p-5 text-center">
            <div className="mx-auto flex size-9 items-center justify-center rounded-md bg-brand-green/10">
              <Icon className="size-4.5 text-brand-green" />
            </div>
            <p className="mt-3 text-xl font-bold text-brand-navy-dark">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-6 text-center">
        <MapPin className="size-5 shrink-0 text-brand-blue" />
        <p className="text-muted-foreground">Headquarters: Lusaka, Zambia</p>
      </div>
    </div>
  );
}

function MissionTab() {
  return (
    <div className="mx-auto max-w-3xl py-20 text-center">
      <p className="text-2xl leading-relaxed font-medium text-brand-navy-dark sm:text-3xl">
        Nkem Aeronautics focuses on autonomous flight, UAV control systems and digital sky
        operation technologies. By leveraging big data and artificial intelligence, we make UAVs
        safer, smarter, and more economical — enabling the sky to better serve a wide range of
        industries.
      </p>
    </div>
  );
}

function CompanyTab() {
  const { data: posts, isLoading } = useNews();

  return (
    <div className="mx-auto max-w-6xl py-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-brand-navy-dark sm:text-3xl">News &amp; Updates</h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          What&rsquo;s happening at Nkem Aeronautics — updates, milestones, and events.
        </p>
      </div>

      {isLoading && (
        <p className="mt-10 text-center text-sm text-muted-foreground">Loading updates…</p>
      )}

      {!isLoading && !posts?.length && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          No updates yet. Check back soon.
        </p>
      )}

      {!isLoading && posts?.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="h-full rounded-xl border border-border bg-background p-5">
              <span className="inline-flex rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-medium capitalize text-brand-blue">
                {post.category}
              </span>
              <h3 className="mt-3 font-semibold text-brand-navy-dark">{post.title}</h3>
              {post.summary && <p className="mt-2 text-sm text-muted-foreground">{post.summary}</p>}
              <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function AboutView() {
  return (
    <main className="flex-1">
      {/* Page hero */}
      <section className="bg-brand-navy px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold tracking-widest text-white/60 uppercase">
            Lusaka, Zambia
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            About <span className="text-white">Nkem Aeronautics</span>
          </h1>
        </div>
      </section>

      <section className="px-6">
        <Tabs defaultValue="about" className="mx-auto w-full max-w-6xl">
          <TabsList className="mx-auto mt-10 h-11 w-fit gap-1 bg-brand-gray-light p-1">
            <TabsTrigger value="about" className="px-5 text-sm">About</TabsTrigger>
            <TabsTrigger value="mission" className="px-5 text-sm">Mission</TabsTrigger>
            <TabsTrigger value="company" className="px-5 text-sm">Company</TabsTrigger>
          </TabsList>
          <TabsContent value="about"><AboutTab /></TabsContent>
          <TabsContent value="mission"><MissionTab /></TabsContent>
          <TabsContent value="company"><CompanyTab /></TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
