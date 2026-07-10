"use client";
import { ResourceManager } from "@/components/admin";
import { useEffect } from "react";
import { Fetch_to } from "@/utilities";
import { useRouter } from "next/navigation";
import json_route from "@/config/json_route.json";

export default function Touristspot_page() {
  const router = useRouter();
  useEffect(() => {
    async function Verify() {
      const response = await Fetch_to(json_route.jwt.verify);
      if (!response.success) return router.push("/auth/sign-in");
    }
    Verify();
  }, []);
  return (
    <ResourceManager
      title="Tourist Spot"
      singularName="Tourist Spot"
    />
  );
}
