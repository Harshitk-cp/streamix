import { Skeleton } from "@/components/ui/skeleton";

import { ResultCard, ResultCardSkeleton } from "./result-card";
import { useUserStore } from "@/store/user-user";
import { getRooms } from "@/app/api/rooms/room";
import { getUserFromId } from "@/app/api/users/user";
export const Results = async () => {
  const rooms = await getRooms();
  const promises = rooms.map(async (room) => {
    const user = await getUserFromId({ userId: room.user._id });
    return { ...room, user };
  });
  const combinedData = await Promise.all(promises);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Streams we think you&apos;ll like
      </h2>
      {combinedData.length === 0 && (
        <div className="text-muted-foreground text-sm">No streams found.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {combinedData.map((result) => (
          <ResultCard key={result._id} data={result} />
        ))}
      </div>
    </div>
  );
};

export const ResultsSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-8 w-[290px] mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {[...Array(4)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
