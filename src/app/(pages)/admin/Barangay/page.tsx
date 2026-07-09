import { ResourceManager } from "@/components/admin";
import { adminResources } from "@/data/admin-resources";

export default function Barangay_page() {
  return (
    <ResourceManager
      title="Barangay"
      singularName="Barangay"
      sampleRecord={adminResources.barangay}
    />
  );
}
