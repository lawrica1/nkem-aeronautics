import { DroneDetailView } from "./DroneDetailView";

export default async function DroneDetailPage({ params }) {
  const { slug } = await params;
  return <DroneDetailView slug={slug} />;
}
