import React from "react";
import VideoPlayer from "./components/VideoPlayer";

const Home = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-4 text-lg font-semibold justify-center items-center ">
      {/* <h1>Video Player App</h1> */}
      <VideoPlayer />
    </div>
  );
};

export default Home;
