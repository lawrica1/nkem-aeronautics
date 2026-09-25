"use client";

import { useAdminStats } from "@/hooks/useAdminStats";

function StatTable({ title, rows = [], labelKey = "value" }) {
  if (rows.length === 0) {
    return (
      <div>
        <h2 className="font-semibold text-brand-navy-dark">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">No data yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-semibold text-brand-navy-dark">{title}</h2>
      <table className="mt-3 w-full text-left text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={`${title}-${row.value}`} className="border-b border-border last:border-0">
              <td className="py-2 pr-4 text-muted-foreground">{row[labelKey] ?? row.value}</td>
              <td className="py-2 font-medium text-brand-navy-dark">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminReportsPage() {
  const { data: stats, isLoading, isError, error } = useAdminStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-navy-dark">Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Real registered-user counts and service demand summaries from the Node.js backend.
      </p>

      {isLoading ? (
        <div className="mt-6 rounded-lg border border-border bg-brand-input/40 p-4 text-sm text-muted-foreground">
          Loading reports...
        </div>
      ) : null}

      {isError ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error.message}
        </div>
      ) : null}

      {stats ? (
        <>
          <div className="mt-6 rounded-lg border border-border bg-brand-input/40 p-4 text-sm text-muted-foreground">
            Verified users:{" "}
            <span className="font-semibold text-brand-navy-dark">{stats.totalUsers}</span>.
            Service requests logged:{" "}
            <span className="font-semibold text-brand-navy-dark">{stats.totalRequests}</span>.
          </div>

          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            <StatTable title="By Sector" rows={stats.bySector} />
            <StatTable title="By Country" rows={stats.byCountry} />
            <StatTable title="By Region" rows={stats.byRegion} />
            <StatTable title="By Firm Affiliation" rows={stats.byFirm} labelKey="label" />
            <StatTable title="By Crop" rows={stats.byCrop} />
            <StatTable title="Service Requests by Status" rows={stats.byStatus} />
          </div>
        </>
      ) : null}
    </div>
  );
}
