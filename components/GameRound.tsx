"use client";

import { Room } from "@/types/room";
import { addRoundToPlayer, roundUp } from "@/utils/room";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

type Props = {
  roomId: string;
  isRoundUp: boolean;
  room: Room;
};

const GameRound = ({ roomId, isRoundUp, room }: Props) => {
  const [boy, setBoy] = useState("");
  const [girl, setGirl] = useState("");
  const [plant, setPlant] = useState("");
  const [inanimateObject, setInanimateObject] = useState("");
  const [animal, setAnimal] = useState("");
  const [country, setCountry] = useState("");

  const handleRoundUp = () => {
    roundUp(roomId, isRoundUp);
    setBoy("");
    setGirl("");
    setPlant("");
    setInanimateObject("");
    setAnimal("");
    setCountry("");
  };
  const handleBoy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBoy(value);
    localStorage.setItem("boyAnswer", value);
  };
  const handleGirl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGirl(value);
    localStorage.setItem("girlAnswer", value);
  };
  const handlePlant = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlant(value);
    localStorage.setItem("plantAnswer", value);
  };
  const handleInanimateObject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInanimateObject(value);
    localStorage.setItem("inanimateObjectAnswer", value);
  };
  const handleAnimal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnimal(value);
    localStorage.setItem("animalAnswer", value);
  };
  const handleCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCountry(value);
    localStorage.setItem("countryAnswer", value);
  };

  return (
    <div className="text-white flex flex-col justify-center items-center gap-2 w-full">
      <p>الحرف هو: {room.selectedLetters[room.currentRound]}</p>
      <Input
        type="text"
        label="ولد"
        variant="faded"
        value={boy}
        onChange={(e) => handleBoy(e)}
        className="text-gray-700"
      />

      <Input
        type="text"
        label="بنت"
        variant="faded"
        value={girl}
        onChange={(e) => handleGirl(e)}
        className="text-gray-700"
      />

      <Input
        type="text"
        label="نبات"
        variant="faded"
        value={plant}
        onChange={(e) => handlePlant(e)}
        className="text-gray-700"
      />

      <Input
        type="text"
        label="جماد"
        variant="faded"
        value={inanimateObject}
        onChange={(e) => handleInanimateObject(e)}
        className="text-gray-700"
      />

      <Input
        type="text"
        label="حيوان"
        variant="faded"
        value={animal}
        onChange={(e) => handleAnimal(e)}
        className="text-gray-700"
      />

      <Input
        type="text"
        label="بلاد"
        variant="faded"
        value={country}
        onChange={(e) => handleCountry(e)}
        className="text-gray-700"
      />

      <Button color="primary" onPress={handleRoundUp}>
        إنتهيت
      </Button>
    </div>
  );
};

export default GameRound;
