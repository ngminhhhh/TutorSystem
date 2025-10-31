import React from "react";

export default function MessageBubble({ mine, text, time }) {
  return (
    <div className={`bubble-row ${mine ? "mine" : "theirs"}`}>
      <div className="bubble">
        <div className="bubble-text">{text}</div>
        {time && <div className="bubble-time">{time}</div>}
      </div>
    </div>
  );
}
