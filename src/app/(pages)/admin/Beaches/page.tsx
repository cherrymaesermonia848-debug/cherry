import { ResourceManager } from "@/components/admin";
import { adminResources } from "@/data/admin-resources";

export default function Beaches_page() {
  return (
    <ResourceManager
      title="Beaches"
      singularName="Beach"
      sampleRecord={adminResources.beaches}
    />
  );
}
