import React from "react";
import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";

import UrlCard from "./_components/url-card";
import KeyCard from "./_components/key-card";
import ConnectModel from "./_components/connect-modal";

async function KeysPage() {
  const self = await getSelf();
  const stream = await getStreamByUserId(self.id);

  if (!stream) {
    return <h1 className="p-6 text-2xl font-bold">Stream Model not found</h1>;
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Keys & URLs</h1>
        <ConnectModel />
      </div>
      <div className="space-y-4">
        <UrlCard value={stream.serverUrl} />
        <KeyCard value={stream.streamKey} />
      </div>
    </div>
  );
}

export default KeysPage;
