"use client";

import { Room } from "@/types/room";
import React from "react";
import GameRound from "./GameRound";
import FinalScore from "./FinalScore";
import RoundScore from "./RoundScore";

type Props = {
  isHost: boolean;
  room: Room;
  roomId: string;
};

const TheGame = ({ isHost, room, roomId }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full">
      <div className="flex flex-col justify-center items-center gap-5 w-full">
        {room.currentRound < 5 ? (
          room.isRoundUp ? (
            <RoundScore
              roomId={roomId}
              isRoundUp={room.isRoundUp}
              isHost={isHost}
              currentRound={room.currentRound}
            />
          ) : (
            <GameRound room={room} roomId={roomId} isRoundUp={room.isRoundUp} />
          )
        ) : (
          <FinalScore isHost={isHost} room={room} roomId={roomId} />
        )}
      </div>
    </div>
  );
};

export default TheGame;
