"use client";

import { format } from "date-fns";
import { ReceivedChatMessage } from "@livekit/components-react";

import { stringToColor } from "@/lib/utils";

export const ChatMessage = ({ id, message }) => {
  const color = stringToColor(id || "");

  console.log("chat ", { id, message });
  return (
    <div className="flex gap-2 p-2 rounded-md hover:bg-white/5">
      <div className="flex flex-wrap items-baseline gap-1 grow">
        <p className="text-sm font-semibold whitespace-nowrap">
          <span className="truncate" style={{ color: color }}>
            {id}
          </span>
          :
        </p>
        <p className="text-sm break-all">{message}</p>
      </div>
    </div>
  );
};
