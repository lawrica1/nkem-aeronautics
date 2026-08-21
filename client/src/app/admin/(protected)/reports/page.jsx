import { getFarmerStats } from "@/lib/server/stats";

function StatTable({ title, rows, labelKey = "value" }) {
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
            <tr key={row.value} className="border-b border-border last:border-0">
              <td className="py-2 pr-4 text-muted-foreground">{row[labelKey]}</td>
              <td className="py-2 font-medium text-brand-navy-dark">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminReportsPage() {
  const stats = await getFarmerStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-navy-dark">Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Real registered-farmer counts, replacing estimate-based allocation.
      </p>

      <div className="mt-6 rounded-lg border border-border bg-brand-input/40 p-4 text-sm text-muted-foreground">
        No per-region breakdown yet — farmer addresses are free text, not a structured
        region/district field, so a reliable region count isn't available in this data. Verified
        farmers: <span className="font-semibold text-brand-navy-dark">{stats.totalFarmers}</span>.
        Service requests logged:{" "}
        <span className="font-semibold text-brand-navy-dark">{stats.totalRequests}</span>.
      </div>

      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <StatTable title="By Sector" rows={stats.bySector} />
        <StatTable title="By Firm Affiliation (agricultural)" rows={stats.byFirm} labelKey="label" />
        <StatTable title="By Crop (agricultural)" rows={stats.byCrop} />
        <StatTable title="Service Requests by Status" rows={stats.byStatus} />
        <StatTable title="Service Requests by Type" rows={stats.byService} />
      </div>
    </div>
  );
}
