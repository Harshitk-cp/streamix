"use client";
import { getUserFromName } from "@/app/api/users/user";
import { StreamPlayer, StreamPlayerSkeleton } from "@/components/stream-player";
import { useState, useEffect } from "react";

const CreatorPage = ({ params }) => {
  const [externalUser, setExternalUser] = useState({});
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    _getUser();
  }, []);

  const _getUser = async () => {
    try {
      const _externalUser = JSON.parse(localStorage.getItem("user"));
      setExternalUser(_externalUser);
      const _user = await getUserFromName({
        userName: params.username,
      });
      setUser(_user);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <StreamPlayerSkeleton />
      </div>
    );
  }

  if (!user || user._id !== externalUser._id || !user.room) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="h-full">
      <StreamPlayer user={user} room={user.room} isFollowing={true} />
    </div>
  );
};

export default CreatorPage;
