"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FestivalManager from "@/components/admin/festival-manager";
import { Fetch_to } from "@/utilities";
import json_route from "@/config/json_route.json";

export default function FestivalsPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    async function verifyAdmin() {
      const response = await Fetch_to(json_route.jwt.verify);
      if (active && !response.success) router.push("/auth/sign-in");
    }
    void verifyAdmin();
    return () => { active = false; };
  }, [router]);

  return <FestivalManager />;
}
