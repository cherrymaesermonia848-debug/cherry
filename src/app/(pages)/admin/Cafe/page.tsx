import { ResourceManager } from "@/components/admin";
import { adminResources } from "@/data/admin-resources";

export default function Cafe_page() {
  return (
    <ResourceManager
      title="Cafe"
      singularName="Cafe"
      sampleRecord={adminResources.cafe}
    />
  );
}
