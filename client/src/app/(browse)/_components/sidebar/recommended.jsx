"use client";

import { useSidebar } from "@/store/use-sidebar";
import React from "react";
import UserItem, { UserItemSkelton } from "./user-item";

function Recommended({ data }) {
  const { collapsed } = useSidebar((state) => state);
  const showLabel = !collapsed && data.length > 0;

  return (
    <div>
      {showLabel && (
        <div className="pl-6 mb-4">
          <p className="text-sm text-muted-foreground">Recommended Channels</p>
        </div>
      )}
      <ul className="space-y-2 px-2">
        {data.map((user) => (
          <UserItem
            key={user.id}
            username={user.username}
            imageUrl={user.imageUrl}
            isLive={user.stream?.isLive}
          />
        ))}
      </ul>
    </div>
  );
}

export default Recommended;

export const RecommendedSkeleton = () => {
  return (
    <ul className="px-2">
      {[...Array(3)].map((_, i) => (
        <UserItemSkelton key={i} />
      ))}
    </ul>
  );
};
