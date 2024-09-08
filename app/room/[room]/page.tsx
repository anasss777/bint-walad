"use client";

import firebase from "@/firebase";
import EnrollPlayer from "@/components/EnrollPlayer";
import PlayersList from "@/components/PlayersList";
import { Player } from "@/types/player";
import { Room } from "@/types/room";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { selectRandomLetters, startGame } from "@/utils/room";
import TheGame from "@/components/TheGame";

type Props = {
  params: { room: string };
};

const RoomPage = ({ params }: Props) => {
  const roomId = params.room;
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playersIds, setPlayersIds] = useState<string[]>([]);
  const [playerId, setPlayerId] = useState(localStorage.getItem("playerId"));
  const [isHost, setIsHost] = useState(localStorage.getItem("isHost") === "1");

  useEffect(() => {
    const roomRef = firebase.firestore().collection("rooms").doc(roomId);

    // Subscribe to room updates
    const unsubscribeRoom = roomRef.onSnapshot((doc) => {
      if (doc.exists) {
        const roomData = doc.data() as Room;
        setRoom(roomData);
      } else {
        console.log("Room not found");
        setRoom(null);
      }
    });

    // Subscribe to players subcollection updates
    const unsubscribePlayers = roomRef.collection("players").onSnapshot(
      (snapshot) => {
        const playersData = snapshot.docs.map((playerDoc) => {
          const playerData = playerDoc.data() as Player;
          return playerData;
        });

        const playersIdsData = snapshot.docs.map((playerDoc) => playerDoc.id);

        setPlayers(playersData);
        setPlayersIds(playersIdsData);
      },
      (error) => {
        console.error("Error fetching players: ", error);
      }
    );

    // Clean up Firestore listeners when component unmounts
    return () => {
      unsubscribeRoom();
      unsubscribePlayers();
    };
  }, [roomId]);

  const handlePlayerIdUpdate = (newPlayerId: string) => {
    setPlayerId(newPlayerId);
    localStorage.setItem("playerId", newPlayerId);
  };

  const handleHostUpdate = (newIsHost: boolean) => {
    setIsHost(newIsHost);
    localStorage.setItem("isHost", newIsHost ? "1" : "0");
  };

  if (!room) {
    return (
      <div className="flex flex-col justify-center items-center h-screen py-5 px-5 md:px-10 lg:px-16">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full py-5 px-5 md:px-10 lg:px-16">
      {room.isGameOn ? (
        <TheGame isHost={isHost} room={room} roomId={roomId} />
      ) : playerId && playersIds.includes(playerId) ? (
        <div className="flex flex-col justify-start items-center gap-20 mt-10 h-full w-full">
          <h1 className="text-white md:text-4xl font-extralight">
            في انتظار انضمام لاعبين آخرين
          </h1>

          <PlayersList players={players} isHost={isHost} roomId={roomId} />

          {isHost && (
            <Button
              onPress={() => {
                selectRandomLetters(roomId);
                startGame(roomId);
              }}
              color="primary"
            >
              ابدأ اللعب
            </Button>
          )}
        </div>
      ) : (
        <EnrollPlayer
          roomId={roomId}
          onPlayerIdUpdate={handlePlayerIdUpdate}
          onHostUpdate={handleHostUpdate}
        />
      )}
    </div>
  );
};

export default RoomPage;
