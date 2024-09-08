import { Timestamp } from "firebase/firestore";
import { Player } from "./player";

export type Room = {
  id: string;
  createdAt: Timestamp;
  players: Player[];
  isGameOn: boolean;
  selectedLetters: string[];
  currentRound: number;
  isRoundUp: boolean;
};
