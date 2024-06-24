"use client";

import { LiveKitRoom } from "@livekit/components-react";

import { cn } from "@/lib/utils";
import { useChatSidebar } from "@/store/use-chat-sidebar";

import { InfoCard } from "./info-card";
import { AboutCard } from "./about-card";
import { ChatToggle } from "./chat-toggle";
import { Chat, ChatSkeleton } from "./chat";

import { Header, HeaderSkeleton } from "./header";
import { Video, VideoSkeleton } from "./video";
import { useWebRTC } from "@/hooks/use-room-conn";
import { useUserStore } from "@/store/user-user";
import { useStreamWebhook } from "@/hooks/use-stream-webhook";

// import { useViewerToken } from "@/hooks/use-viewer-token";

export const StreamPlayer = async ({ user, stream, isFollowing }) => {
  useStreamWebhook();
  // const { token, name, identity } = useViewerToken(user._id);
  const { collapsed } = useChatSidebar((state) => state);

  // if (!token || !name || !identity) {
  //   return <StreamPlayerSkeleton />;
  // }

  const {
    videoRef,
    initializeWebRTC,
    isPublishing,
    isConnected,
    handlePlay,
    identity,
    chatMessages,
    sendChatMessage,
  } = useWebRTC(user.username, user.id, user.id, user.username);

  return (
    <>
      {collapsed && (
        <div className="hidden lg:block fixed top-[100px] right-2 z-50">
          <ChatToggle />
        </div>
      )}
      <div
        className={cn(
          "grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full",
          collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
        )}
      >
        <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
          <Video
            hostName={user.username}
            hostIdentity={user.id}
            initializeWebRTC={initializeWebRTC}
            videoRef={videoRef}
            isPublishing={isPublishing}
            isConnected={isConnected}
            handlePlay={handlePlay}
          />
          <Header
            hostName={user.userName}
            hostIdentity={user.id}
            viewerIdentity={identity}
            imageUrl={user.imageUrl}
            isFollowing={isFollowing}
            name={user.stream.name}
            participantsLength={5}
            isLive={isPublishing}
          />
          <InfoCard
            hostIdentity={user.id}
            viewerIdentity={identity}
            name={user.stream.name}
            thumbnailUrl={""}
          />
          <AboutCard
            hostName={user.userName}
            hostIdentity={user.id}
            viewerIdentity={identity}
            bio={user.bio}
            followedByCount={user._count.followedBy}
          />
        </div>
        <div className={cn("col-span-1", collapsed && "hidden")}>
          <Chat
            viewerName={user.name}
            hostName={user.username}
            hostIdentity={user.id}
            isFollowing={isFollowing}
            isChatEnabled={user.stream.isChatEnabled}
            isChatDelayed={user.stream.isChatEnabled}
            isChatFollowersOnly={user.stream.isChatEnabled}
            sendChatMessage={sendChatMessage}
            chatMessages={chatMessages}
            isPublishing={isPublishing}
          />
        </div>
      </div>
    </>
  );
};

export const StreamPlayerSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full">
      <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
        <VideoSkeleton />
        <HeaderSkeleton />
      </div>
      <div className="col-span-1 bg-background">
        <ChatSkeleton />
      </div>
    </div>
  );
};
