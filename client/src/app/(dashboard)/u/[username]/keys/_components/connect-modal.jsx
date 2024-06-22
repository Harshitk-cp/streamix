"use client";
import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import { IngressInput } from "livekit-server-sdk";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const RTMP = String(IngressInput.RTMP_INPUT);

function ConnectModel() {
  const closeRef = null;
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      createIngress(parseInt(ingressType))
        .then(() => {
          toast.success("Connection generated");
          closeRef?.current?.click();
        })
        .catch(() => toast.error("Failed to generate connection"));
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Generate Connection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Connection</DialogTitle>
        </DialogHeader>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning !</AlertTitle>
          <AlertDescription>
            This action will reset all your streams that are running on this
            current connection.
          </AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <DialogClose ref={closeRef} asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="primary" onClick={onSubmit} disabled={isPending}>
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectModel;
