"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateDrone } from "@/hooks/usePilotsAndDrones";
import { DroneForm } from "../DronesAdminView";

export default function NewDronePage() {
  const router = useRouter();
  const createDrone = useCreateDrone();
  const back = () => router.push("/admin/drones");

  return (
    <div>
      <Link href="/admin/drones" className="text-sm text-brand-blue underline">← Back to Drones</Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy-dark">Add drone</h1>
      <p className="mt-1 text-sm text-muted-foreground">Add an aircraft to the operational fleet.</p>
      <div className="mt-8">
        <DroneForm mutation={createDrone} submitLabel="Add drone" onDone={back} onCancel={back} />
      </div>
    </div>
  );
}
