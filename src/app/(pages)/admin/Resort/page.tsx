import { ResourceManager } from "@/components/admin";
import { adminResources } from "@/data/admin-resources";

export default function Resort_page() {
  return (
    <ResourceManager
      title="Resort"
      singularName="Resort"
      sampleRecord={adminResources.resort}
    />
  );
}
