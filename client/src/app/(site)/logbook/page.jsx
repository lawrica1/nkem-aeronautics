"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, ArrowRight } from "lucide-react";
import { getToken, clearToken } from "@/lib/api";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFarmerServiceRequests } from "@/hooks/useFarmerServiceRequests";
import { ProfileCard } from "@/components/portal/ProfileCard";
import { ServiceRequestList } from "@/components/portal/ServiceRequestList";

function GuestView() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-2xl font-semibold text-brand-navy-dark">Logbook Portal</h1>
      <p className="mt-2 text-muted-foreground">
        Log in to view your farmer logbook and manage service requests.
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

function WelcomeBanner({ name }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border-l-4 border-brand-green bg-brand-green/5 p-4 text-sm text-brand-navy-dark">
      <Bell className="mt-0.5 size-4 shrink-0 text-brand-green" />
      <p>
        Welcome back{name ? `, ${name}` : ""}! You can submit new service requests and track their
        progress here. A member of the Nkem Aeronautics team will review your requests.
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

  function handleLogout() {
    clearToken();
    queryClient.clear();
    router.push("/");
  }

  function handleRefreshRequests() {
    queryClient.invalidateQueries({ queryKey: ["farmer", "service-requests"] });
  }

  if (!isLoggedIn) {
    return <GuestView />;
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileCard
          farmer={profile.data}
          onLogout={handleLogout}
        />

        <div className="space-y-8">
          {profile.data && !profile.data.isProfileComplete && (
            <Link
              href="/onboarding"
              className="flex items-center justify-between gap-3 rounded-xl border-2 border-brand-blue/30 bg-brand-blue/5 px-4 py-3 text-sm text-brand-navy-dark transition-colors hover:border-brand-blue/60"
            >
              <div>
                <p className="font-semibold">Complete your profile</p>
                <p className="text-muted-foreground">Add your name, sector, and location to unlock full logbook features.</p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-brand-blue" />
            </Link>
          )}

          <WelcomeBanner name={profile.data?.name} />

          <ServiceRequestList
            requests={serviceRequests.data}
            isLoading={serviceRequests.isLoading}
            isError={serviceRequests.isError}
            sector={profile.data?.sector}
            onRefresh={handleRefreshRequests}
          />
        </div>
      </div>
    </main>
  );
}
