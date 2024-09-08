"use client";

import { addPlayer } from "@/utils/room";
import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";

type Props = {
  roomId: string;
  onPlayerIdUpdate: (playerId: string) => void;
  onHostUpdate: (isHost: boolean) => void;
};

const EnrollPlayer = ({ roomId, onPlayerIdUpdate, onHostUpdate }: Props) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playerError, setPlayerError] = useState("");

  const handleAddPlayer = async () => {
    setIsLoading(true);
    await addPlayer({ roomId, name: name, isHost: false })
      .then((player) => {
        localStorage.setItem("playerId", player.id);
        localStorage.setItem("isHost", player.isHost ? "1" : "0");
        onPlayerIdUpdate(player.id);
        onHostUpdate(player.isHost);
        setIsLoading(false);
        setName("");
      })
      .catch(() => {
        setIsLoading(false);
        setPlayerError("حدث خطأ. الرجاء المحاولة مجدداً لاحقاً.");
      });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2 h-screen w-full">
      <Input
        label="الإسم"
        labelPlacement="inside"
        dir="rtl"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`rounded-[14px] w-full sm:w-[70%] md:w-[50%] lg:w-[30%]`}
      />

      <Button
        onPress={handleAddPlayer}
        disabled={name.length === 0}
        isLoading={isLoading}
        className={`btn ${
          name.length === 0
            ? "bg-default text-gray-400 cursor-not-allowed hover:bg-opacity-100"
            : "bg-primary text-white"
        }`}
      >
        إضافة لاعب
      </Button>

      <p className={`text-danger text-center text-sm font-light w-full mt-2`}>
        {playerError}
      </p>
    </div>
  );
};

export default EnrollPlayer;
