import { notFound } from "next/navigation";

import { StreamPlayer } from "@/components/stream-player";
import { getUserFromName } from "@/app/api/users/user";

const UserPage = async ({ params }) => {
  const user = await getUserFromName({
    userName: "kage",
  });

  if (!user || !user.room) {
    notFound();
  }

  // const isFollowing = await isFollowingUser(user.id);
  // const isBlocked = await isBlockedByUser(user.id);

  // if (isBlocked) {
  //   notFound();
  // }

  return <StreamPlayer user={user} room={user.room} isFollowing={false} />;
};

export default UserPage;
