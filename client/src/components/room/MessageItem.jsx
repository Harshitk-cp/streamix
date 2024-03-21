"use client";

const MessageItem = ({ message, createdAt, name = null, isSelf }) => {
  return (
    <div
      className={`flex ${isSelf ? "justify-end" : "justify-start"} mb-4 w-full`}
    >
      <div
        className={`max-w-2/3 p-4 rounded-lg shadow-md ${
          isSelf ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">{name}</span>
          <span className="text-sm text-gray-500">{createdAt}</span>
        </div>
        <div>{message}</div>
      </div>
    </div>
  );
};

export default MessageItem;
