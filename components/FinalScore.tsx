"use client";

import firebase from "@/firebase";
import { Player } from "@/types/player";
import { Room } from "@/types/room";
import { endGame } from "@/utils/room";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { svgTrophy } from "./svgPaths";

type Props = {
  isHost: boolean;
  room: Room;
  roomId: string;
};

const FinalScore = ({ isHost, room, roomId }: Props) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const roomRef = firebase.firestore().collection("rooms").doc(roomId);

    // Subscribe to players subcollection updates
    const unsubscribePlayers = roomRef.collection("players").onSnapshot(
      (snapshot) => {
        const playersData = snapshot.docs.map((playerDoc) => {
          const playerData = playerDoc.data() as Player;
          return playerData;
        });

        setPlayers(playersData);
      },
      (error) => {
        console.error("Error fetching players: ", error);
      }
    );

    // Clean up Firestore listeners when component unmounts
    return () => {
      unsubscribePlayers();
    };
  }, [roomId]);

  const handleEndGame = () => {
    endGame(roomId);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 w-full">
      <p className="text-white">النتيجة النهائية</p>

      <div className="flex flex-col justify-center items-center gap-2 border rounded-xl w-full md:w-96 overflow-hidden">
        {players
          .sort((a, b) => b.score - a.score)
          .map((player, index) => (
            <div
              key={index}
              className={`flex flex-row justify-between text-white w-full px-2 py-2 ${
                index % 2 === 0 && "bg-white/20"
              }`}
            >
              <div className="flex flex-col justify-center items-center gap-2">
                <p>الإسم: {player.name}</p>
                <p>النتيحة: {player.score}</p>
              </div>

              {index === 0 && (
                <div className="btn p-1 border border-yellow-500 bg-yellow-500/20">
                  {svgTrophy}
                </div>
              )}
            </div>
          ))}
      </div>

      {isHost && (
        <Button onPress={handleEndGame} color="primary">
          إنهاء اللعبة
        </Button>
      )}
    </div>
  );
};

export default FinalScore;
