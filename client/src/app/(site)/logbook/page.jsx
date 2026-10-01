"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2, Sprout, Binoculars, Pickaxe } from "lucide-react";
import { getToken, signOut } from "@/lib/api";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFarmerServiceRequests } from "@/hooks/useFarmerServiceRequests";
import { ProfileCard } from "@/components/portal/ProfileCard";
import { ServiceRequestList } from "@/components/portal/ServiceRequestList";
import { ShopSection } from "@/components/portal/ShopSection";
import { OrdersList } from "@/components/portal/OrdersList";
import { PartRequestSection } from "@/components/portal/PartRequestSection";
import { DroneRecommendation } from "@/components/portal/DroneRecommendation";
import { MediaGallery } from "@/components/portal/MediaGallery";

const MEDIA_SECTORS = ["wildlife"];

const SECTOR_META = {
  agricultural: { label: "Agricultural Operations Portal", Icon: Sprout, color: "text-brand-green" },
  wildlife: { label: "Wildlife & Surveillance Portal", Icon: Binoculars, color: "text-brand-blue" },
  mining: { label: "Mining Operations Portal", Icon: Pickaxe, color: "text-brand-gold" },
};

function SectorHeader({ sector }) {
  const meta = SECTOR_META[sector];
  if (!meta) return null;
  const { label, Icon, color } = meta;
  return (
    <div className="flex items-center gap-2">
      <Icon className={`size-5 ${color}`} />
      <h1 className="text-xl font-bold text-brand-navy-dark">{label}</h1>
    </div>
  );
}

function GuestView() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-2xl font-semibold text-brand-navy-dark">Service Portal</h1>
      <p className="mt-2 text-muted-foreground">
        Log in to view your logbook and manage service requests.
      </p>
      <Link
        href="/login"
        className="mt-6 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
      >
        Log In
      </Link>
    </main>
  );
}

const SECTOR_WELCOME = {
  agricultural: "Submit spraying or field-treatment requests and track their progress here.",
  wildlife: "Submit surveillance or monitoring mission requests and track their progress here.",
  mining: "Submit site-survey or inspection requests and track their progress here.",
};

function WelcomeBanner({ name, sector }) {
  const detail = SECTOR_WELCOME[sector] ?? "Submit service requests and track their progress here.";
  return (
    <div className="flex items-start gap-3 rounded-xl border-l-4 border-brand-green bg-brand-green/5 p-4 text-sm text-brand-navy-dark">
      <Bell className="mt-0.5 size-4 shrink-0 text-brand-green" />
      <p>
        Welcome back{name ? `, ${name}` : ""}! {detail} A member of the Nkem Aeronautics team will review your requests.
      </p>
    </div>
  );
}

export default function LogbookPortalPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync auth state after mount (localStorage not available on server).
  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  // Only run queries after we've confirmed the token exists on the client.
  // Without `enabled`, both queries fire before useEffect reads localStorage,
  // cache a 401, and never retry once isLoggedIn becomes true.
  const profile = useFarmerProfile({ enabled: isLoggedIn });
  const serviceRequests = useFarmerServiceRequests({ enabled: isLoggedIn });

  // Gate: redirect to onboarding until profile is complete.
  // Wait for the profile query to settle before redirecting so we don't flash.
  useEffect(() => {
    if (isLoggedIn && profile.isFetched && profile.data && !profile.data.isProfileComplete) {
      router.replace("/onboarding");
    }
  }, [isLoggedIn, profile.isFetched, profile.data, router]);

  async function handleLogout() {
    await signOut();
    queryClient.clear();
    router.push("/");
  }

  function handleRefreshRequests() {
    queryClient.invalidateQueries({ queryKey: ["farmer", "service-requests"] });
  }

  if (!isLoggedIn) {
    return <GuestView />;
  }

  // Show a spinner while we determine whether to redirect or render the dashboard.
  if (!profile.isFetched || (profile.data && !profile.data.isProfileComplete)) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand-blue" />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileCard
          farmer={profile.data}
          onLogout={handleLogout}
        />

        <div className="space-y-8">
          <SectorHeader sector={profile.data?.sector} />

          {profile.isError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              Could not load your profile. Please refresh the page or{" "}
              <button type="button" onClick={handleLogout} className="underline">log in again</button>.
            </div>
          )}

          <WelcomeBanner name={profile.data?.name} sector={profile.data?.sector} />

          <ServiceRequestList
            requests={serviceRequests.data}
            isLoading={serviceRequests.isLoading}
            isError={serviceRequests.isError}
            sector={profile.data?.sector}
            onRefresh={handleRefreshRequests}
          />

          {MEDIA_SECTORS.includes(profile.data?.sector) && (
            <>
              <MediaGallery requests={serviceRequests.data} />
              <DroneRecommendation sector={profile.data?.sector} />
            </>
          )}

          <OrdersList />
          <div className="border-t border-border pt-8">
            <ShopSection />
          </div>
          <div className="border-t border-border pt-8">
            <PartRequestSection />
          </div>
        </div>
      </div>
    </main>
  );
}
