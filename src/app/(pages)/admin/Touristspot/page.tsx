import { ResourceManager } from "@/components/admin";
import { adminResources } from "@/data/admin-resources";

export default function Touristspot_page() {
  return (
    <ResourceManager
      title="Tourist Spot"
      singularName="Tourist Spot"
      sampleRecord={adminResources.touristspot}
    />
  );
}
