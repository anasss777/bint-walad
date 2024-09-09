"use client";

import { addRoundToPlayer, addScoreToRound, goNextRound } from "@/utils/room";
import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

type Props = {
  isHost: boolean;
  roomId: string;
  isRoundUp: boolean;
  currentRound: number;
};

const RoundScore = ({ roomId, isHost, currentRound }: Props) => {
  const [scoreSum, setScoreSum] = useState(0);
  const [scores, setScores] = useState({
    boy: 0,
    girl: 0,
    plant: 0,
    inanimateObject: 0,
    animal: 0,
    country: 0,
  });
  const [isFinishScoring, setIsFinishScoring] = useState(false);

  // Getting player's answers from localStorage
  const playerId = localStorage.getItem("playerId") || "";
  const boyAnswer = localStorage.getItem("boyAnswer") || "";
  const girlAnswer = localStorage.getItem("girlAnswer") || "";
  const plantAnswer = localStorage.getItem("plantAnswer") || "";
  const inanimateObjectAnswer =
    localStorage.getItem("inanimateObjectAnswer") || "";
  const animalAnswer = localStorage.getItem("animalAnswer") || "";
  const countryAnswer = localStorage.getItem("countryAnswer") || "";

  // Getting player's scores from localStorage
  const boyScore = Number(localStorage.getItem("boyScore")) || 0;
  const girlScore = Number(localStorage.getItem("girlScore")) || 0;
  const plantScore = Number(localStorage.getItem("plantScore")) || 0;
  const inanimateObjectScore =
    Number(localStorage.getItem("inanimateObjectScore")) || 0;
  const animalScore = Number(localStorage.getItem("animalScore")) || 0;
  const countryScore = Number(localStorage.getItem("countryScore")) || 0;

  // Calculating the score of this round
  useEffect(() => {
    setScoreSum(
      scores.boy +
        scores.girl +
        scores.plant +
        scores.inanimateObject +
        scores.animal +
        scores.country
    );
  }, [
    scores.animal,
    scores.boy,
    scores.country,
    scores.girl,
    scores.inanimateObject,
    scores.plant,
  ]);

  // Structuring the answers and scores in an accpetable structure
  const boy = { answer: boyAnswer, score: boyScore };
  const girl = { answer: girlAnswer, score: girlScore };
  const plant = { answer: plantAnswer, score: plantScore };
  const inanimateObject = {
    answer: inanimateObjectAnswer,
    score: inanimateObjectScore,
  };
  const animal = { answer: animalAnswer, score: animalScore };
  const country = { answer: countryAnswer, score: countryScore };

  const finishScoring = () => {
    addRoundToPlayer(
      roomId,
      playerId,
      boy,
      girl,
      plant,
      inanimateObject,
      animal,
      country
    );
    addScoreToRound(roomId, playerId, scoreSum, currentRound);
    setIsFinishScoring(true);
    localStorage.setItem("boyAnswer", "");
    localStorage.setItem("girlAnswer", "");
    localStorage.setItem("plantAnswer", "");
    localStorage.setItem("inanimateObjectAnswer", "");
    localStorage.setItem("animalAnswer", "");
    localStorage.setItem("countryAnswer", "");
  };

  const nextRound = () => {
    goNextRound(roomId, currentRound);
  };

  const handleScoreChange = (category: string, score: number) => {
    setScores((prev) => ({ ...prev, [category]: score }));

    localStorage.setItem(`${category}Score`, score.toString());
  };

  const renderScoreButtons = (
    answer: string,
    category: keyof typeof scores,
    categoryAr: string,
    score: number
  ) => (
    <div className="flex flex-col justify-center items-center gap-2 w-full">
      <p>
        {categoryAr}: {answer}
      </p>
      <div className="flex flex-row justify-center items-center gap-2 w-full">
        {[0, 1, 2].map((val) => (
          <Button
            key={val}
            isDisabled={isFinishScoring}
            className={`!text-sm text-white ${
              isFinishScoring && "bg-opacity-30 cursor-not-allowed"
            } ${score === val && "cursor-not-allowed"}`}
            color={score === val ? getButtonColor(val) : "default"}
            onPress={() => handleScoreChange(category, val)}
          >
            {getButtonLabel(val)}
          </Button>
        ))}
      </div>
    </div>
  );

  const getButtonLabel = (val: number) => {
    switch (val) {
      case 0:
        return "إجابة خاطئة";
      case 1:
        return "إجابة صحيحة";
      case 2:
        return "إجابة مميزة";
      default:
        return "";
    }
  };

  const getButtonColor = (val: number) => {
    switch (val) {
      case 0:
        return "danger";
      case 1:
        return "success";
      case 2:
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="text-white flex flex-col justify-center items-center gap-10 h-full min-h-screen w-full px-1">
      <p>النقاط: {scoreSum}</p>

      {!isFinishScoring && (
        <div className="text-white flex flex-col justify-center items-center gap-6 w-full">
          {renderScoreButtons(boyAnswer, "boy", "ولد", scores.boy)}
          {renderScoreButtons(girlAnswer, "girl", "بنت", scores.girl)}
          {renderScoreButtons(plantAnswer, "plant", "نبات", scores.plant)}
          {renderScoreButtons(
            inanimateObjectAnswer,
            "inanimateObject",
            "جماد",
            scores.inanimateObject
          )}
          {renderScoreButtons(animalAnswer, "animal", "حيوان", scores.animal)}
          {renderScoreButtons(countryAnswer, "country", "بلاد", scores.country)}
        </div>
      )}

      {isFinishScoring ? (
        <p>يرجى الانتظار حتى ينتهي اللاعبون الآخرون</p>
      ) : (
        <Button color="primary" onPress={finishScoring}>
          أنتهيت
        </Button>
      )}

      {isHost && (
        <Button color="primary" onPress={nextRound}>
          الجولة التالية
        </Button>
      )}
    </div>
  );
};

export default RoundScore;
