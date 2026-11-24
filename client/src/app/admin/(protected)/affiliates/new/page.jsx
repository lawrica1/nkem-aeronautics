"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateAffiliate } from "@/hooks/useAffiliates";
import { AffiliateForm } from "../AffiliatesView";

export default function NewAffiliatePage() {
  const router = useRouter();
  const createAffiliate = useCreateAffiliate();
  const back = () => router.push("/admin/affiliates");

  return (
    <div>
      <Link href="/admin/affiliates" className="text-sm text-brand-blue underline">← Back to Affiliates</Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy-dark">Add affiliate</h1>
      <p className="mt-1 text-sm text-muted-foreground">Register a referral partner. Their referral code is created for you.</p>
      <div className="mt-8">
        <AffiliateForm mutation={createAffiliate} submitLabel="Add affiliate" onDone={back} onCancel={back} />
      </div>
    </div>
  );
}
