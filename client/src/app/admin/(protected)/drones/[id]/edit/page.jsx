"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDrones, useUpdateDrone } from "@/hooks/usePilotsAndDrones";
import { DroneForm } from "../../DronesAdminView";

export default function EditDronePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: drones, isLoading, isError, error } = useDrones();
  const updateDrone = useUpdateDrone();
  const drone = drones?.find((d) => d.id === id);
  const back = () => router.push(`/admin/drones/${id}`);

  return (
    <div>
      <Link href="/admin/drones" className="text-sm text-brand-blue underline">← Back to Drones</Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy-dark">Edit drone</h1>
      <div className="mt-8">
        {isLoading && <p className="text-sm text-muted-foreground">Loading drone…</p>}
        {isError && <p className="text-sm text-destructive">{error.message}</p>}
        {drones && !drone && <p className="text-sm text-muted-foreground">Drone not found.</p>}
        {drone && <DroneForm drone={drone} mutation={updateDrone} submitLabel="Save changes" onDone={back} onCancel={back} />}
      </div>
    </div>
  );
}
