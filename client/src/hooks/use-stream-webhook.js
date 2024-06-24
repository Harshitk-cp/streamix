import { registerWebhook } from "@/actions/webhook";
import { useEffect } from "react";

export function useStreamWebhook() {
  useEffect(() => {
    registerWebhook();
  }, []);
}
