"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useDrones } from "@/hooks/usePilotsAndDrones";
import { StatusPill } from "@/components/admin/AdminTable";
import { DetailCard } from "@/components/admin/DetailCard";

export default function DroneDetailPage() {
  const { id } = useParams();
  const { data: drones, isLoading, isError, error } = useDrones();
  const drone = drones?.find((d) => d.id === id);

  return (
    <div>
      <Link href="/admin/drones" className="text-sm text-brand-blue underline">← Back to Drones</Link>
      {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading drone…</p>}
      {isError && <p className="mt-8 text-sm text-destructive">{error.message}</p>}
      {drones && !drone && <p className="mt-8 text-sm text-muted-foreground">Drone not found.</p>}
      {drone && (
        <DetailCard
          title={drone.name}
          status={<StatusPill active={drone.active} />}
          editHref={`/admin/drones/${id}/edit`}
          fields={[
            ["Model", drone.model],
            ["Type", drone.type],
            ...(typeof drone.specs === "string" ? [["Spec notes", drone.specs]] : []),
          ]}
          specs={(drone.specList ?? []).map((s) => [s.label, s.value])}
          images={drone.images}
        />
      )}
    </div>
  );
}
