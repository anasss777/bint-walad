export type Answer = {
  answer: string;
  score: number;
};

export type Round = {
  rank: number;
  score: number;
  boy: Answer;
  girl: Answer;
  plant: Answer;
  inanimateObject: Answer;
  animal: Answer;
  country: Answer;
};
