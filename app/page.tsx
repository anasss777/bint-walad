"use client";

import {
  svgBoy,
  svgCat,
  svgEarth,
  svgGirl,
  svgPalmTree,
  svgToys,
} from "@/components/svgPaths";
import { addPlayer, createRoom } from "@/utils/room";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomError, setRoomError] = useState("");
  const router = useRouter();

  const handleCreateNewRoom = async () => {
    setIsLoading(true);
    // Create a new room
    const roomId = await createRoom();

    // Add a host player to the room
    await addPlayer({ roomId, name: name, isHost: true })
      .then((player) => {
        localStorage.setItem("playerId", player.id);
        localStorage.setItem("isHost", player.isHost ? "1" : "0");
        router.push(`/room/${roomId}`);
      })
      .catch(() => {
        setIsLoading(false);
        setRoomError("حدث خطأ. الرجاء المحاولة مجدداً لاحقاً.");
      });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen py-20 px-5 md:px-10 lg:px-16">
      <div className="flex flex-row justify-center items-center gap-3 md:gap-5 text-white md:text-4xl font-extralight mb-20">
        <p className="flex flex-col justify-center items-center gap-2">
          <span>{svgGirl}</span>
          بنت
        </p>
        <p className="flex flex-col justify-center items-center gap-2">
          <span>{svgBoy}</span>
          ولد
        </p>
        <p className="flex flex-col justify-center items-center gap-2">
          <span>{svgPalmTree}</span>
          نبات
        </p>
        <p className="flex flex-col justify-center items-center gap-2">
          <span>{svgToys}</span>
          جماد
        </p>
        <p className="flex flex-col justify-center items-center gap-2">
          <span>{svgCat}</span>
          حيوان
        </p>
        <p className="flex flex-col justify-center items-center gap-2">
          <span>{svgEarth}</span>
          بلاد
        </p>
      </div>

      <Input
        label="الإسم"
        labelPlacement="inside"
        dir="rtl"
        value={name}
        onChange={(e) => setName(e.target.value)} // Updated to `onChange` event handler
        className={`rounded-[14px] w-full sm:w-[70%] md:w-[50%] lg:w-[30%] mb-5`}
      />

      <Button
        onPress={handleCreateNewRoom}
        disabled={name.length === 0}
        isLoading={isLoading}
        className={`btn ${
          name.length === 0
            ? "bg-default text-gray-400 cursor-not-allowed hover:bg-opacity-100"
            : "bg-primary text-white"
        }`}
      >
        ابدأ لعبة جديدة
      </Button>

      <p className={`text-danger text-center text-sm font-light w-full mt-2`}>
        {roomError}
      </p>
    </div>
  );
}
