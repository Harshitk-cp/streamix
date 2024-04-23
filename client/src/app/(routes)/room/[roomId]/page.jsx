import VideoPlayer from "@/components/VideoPlayer";
import ResizableChat from "@/components/room/Chat";

export default function RoomPage() {
  return (
    <div className="flex h-screen">
      <div className="flex-grow">
        <VideoPlayer />
      </div>

      <ResizableChat />
    </div>
  );
}
