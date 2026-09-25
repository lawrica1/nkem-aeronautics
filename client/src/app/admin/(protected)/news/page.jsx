import { NewsAdminView } from "./NewsAdminView";

export default function AdminNewsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy-dark">News</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Company and industry news shown on the public homepage. Unpublished posts stay hidden.
      </p>
      <div className="mt-8">
        <NewsAdminView />
      </div>
    </div>
  );
}
