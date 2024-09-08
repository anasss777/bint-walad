import { Player } from "@/types/player";
import React from "react";
import { svgDelete, svgHost } from "./svgPaths";
import { deletePlayer } from "@/utils/room";

type Props = {
  players: Player[];
  isHost: boolean;
  roomId: string;
};

const PlayersList = ({ players, isHost, roomId }: Props) => {
  const handleDeletePlayer = async (playerId: string) => {
    await deletePlayer(roomId, playerId);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2 border rounded-xl w-full md:w-96 overflow-hidden">
      {players
        .sort((a, b) => (a.isHost === b.isHost ? 0 : a.isHost ? -1 : 1))
        .map((player, index) => (
          <div
            key={index}
            className={`flex flex-row justify-between text-white w-full px-2 py-2 ${
              index % 2 === 0 && "bg-white/20"
            }`}
          >
            <div className="flex flex-col justify-center items-center gap-2">
              <p>الإسم: {player.name}</p>
            </div>

            {isHost && index !== 0 && (
              <div className="flex justify-center items-center">
                <button
                  className="btn p-1 border border-danger bg-danger/20"
                  onClick={() => handleDeletePlayer(player.id)}
                >
                  {svgDelete}
                </button>
              </div>
            )}

            {index === 0 && (
              <div className="btn p-1 border border-yellow-500 bg-yellow-500/20">
                {svgHost}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default PlayersList;
