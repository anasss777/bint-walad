import { Timestamp } from "firebase/firestore";
import { Round } from "./round";

export type Player = {
  id: string;
  createdAt: Timestamp;
  name: string;
  score: number;
  isHost: boolean;
  rounds: Round[];
};
