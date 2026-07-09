import { ResourceManager } from "@/components/admin";
import { adminResources } from "@/data/admin-resources";

export default function Heritage_page() {
  return (
    <ResourceManager
      title="Heritage"
      singularName="Heritage"
      sampleRecord={adminResources.heritage}
    />
  );
}
