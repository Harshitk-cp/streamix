"use client";

import { useUserStore } from "@/store/user-user";
import { useEffect } from "react";

export default function InitPage() {
  const { setUser } = useUserStore((state) => state);

  useEffect(() => {
    setUser();
  }, []);

  return <></>;
}
