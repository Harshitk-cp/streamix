import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveBadge } from "./live-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const avatarSizes = cva("", {
  variants: {
    size: {
      default: "h-8 w-8",
      lg: "h-14 w-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const UserAvatar = ({
  username = "",
  imageUrl,
  isLive,
  showBadge,
  size,
}) => {
  const canShowBadge = showBadge && isLive;

  const displayUsername =
    typeof username === "string" && username.length > 0 ? username : "Unknown";

  return (
    <div className="relative">
      <Avatar
        className={cn(
          isLive && "ring-2 ring-rose-500 border border-background",
          avatarSizes({ size })
        )}
      >
        <AvatarImage src={imageUrl} className="object-cover" />
        <AvatarFallback>
          {displayUsername[0]}
          {displayUsername[displayUsername.length - 1]}
        </AvatarFallback>
      </Avatar>
      {canShowBadge && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          <LiveBadge />
        </div>
      )}
    </div>
  );
};

export const UserAvatarSkeleton = ({ size }) => {
  return <Skeleton className={cn("rounded-full", avatarSizes({ size }))} />;
};
