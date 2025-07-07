"use client";

export default function QueueControls({ queueId, onAdjust }) {
  return (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={() => onAdjust(queueId, "up")}
        className="bg-yellow-500 text-white px-2 py-1 rounded"
      >
        Move Up
      </button>
      <button
        onClick={() => onAdjust(queueId, "down")}
        className="bg-yellow-500 text-white px-2 py-1 rounded"
      >
        Move Down
      </button>
    </div>
  );
}
