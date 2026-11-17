"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateIdCard } from "@/hooks/useIdCards";
import { IdCardForm } from "../IdRegistryView";

export default function NewIdCardPage() {
  const router = useRouter();
  const createCard = useCreateIdCard();
  const back = () => router.push("/admin/id-registry");

  return (
    <div>
      <Link href="/admin/id-registry" className="text-sm text-brand-blue underline">← Back to ID Registry</Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy-dark">Add ID card</h1>
      <p className="mt-1 text-sm text-muted-foreground">Record a newly printed staff ID card.</p>
      <div className="mt-8">
        <IdCardForm mutation={createCard} submitLabel="Add ID card" onDone={back} onCancel={back} />
      </div>
    </div>
  );
}
