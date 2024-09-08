import firebase from "@/firebase";
import { Player } from "@/types/player";
import { Answer } from "@/types/round";

const alphabet = [
  "أ",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "هـ",
  "و",
  "ي",
];

export const createRoom = async () => {
  // Create a reference for the new room
  const newRoomRef = firebase.firestore().collection("rooms").doc();

  // Set the room document
  await newRoomRef.set({
    id: newRoomRef.id,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    isGameOn: false,
    selectedLetters: [""],
    currentRound: 0,
    isRoundUp: false,
  });

  // Return the room ID for further use
  return newRoomRef.id;
};

export const deleteRoom = async (roomId: string) => {
  const db = firebase.firestore();
  const roomRef = db.collection("rooms").doc(roomId);

  try {
    // Get a reference to the players subcollection
    const playersRef = roomRef.collection("players");

    // Fetch all players and delete them
    const playersSnapshot = await playersRef.get();
    const batch = db.batch(); // Use a batch to delete all players

    playersSnapshot.forEach((playerDoc) => {
      batch.delete(playerDoc.ref);
    });

    // Commit the batch delete for players
    await batch.commit();

    // Delete the room document after deleting all players
    await roomRef.delete();

    console.log(
      `Room ${roomId} and its players have been successfully deleted.`
    );
  } catch (error) {
    console.error("Error deleting room and its players:", error);
  }
};

type AddPlayerProps = {
  roomId: string; // The ID of the room to add the player to
  name: string; // Name of the player
  isHost: boolean; // Whether the player is the host
};

export const addPlayer = async ({ roomId, name, isHost }: AddPlayerProps) => {
  // Get a reference to the players subcollection of the specified room
  const playersCollectionRef = firebase
    .firestore()
    .collection("rooms")
    .doc(roomId)
    .collection("players");

  // Create a reference for the new player
  const newPlayerRef = playersCollectionRef.doc();

  // Set the player document in the 'players' subcollection
  await newPlayerRef.set({
    id: newPlayerRef.id,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    name: name,
    score: 0,
    isHost: isHost,
  });

  return (await newPlayerRef.get()).data() as Player;
};

export const deletePlayer = async (
  roomId: string,
  playerId: string
): Promise<void> => {
  const db = firebase.firestore();
  const playerRef = db
    .collection("rooms")
    .doc(roomId)
    .collection("players")
    .doc(playerId);

  try {
    await playerRef.delete();
    console.log(
      `Player ${playerId} has been successfully deleted from room ${roomId}.`
    );
  } catch (error) {
    console.error("Error deleting player:", error);
  }
};

export const startGame = async (roomId: string) => {
  const roomRef = firebase.firestore().collection("rooms").doc(roomId);

  roomRef
    .update({
      isGameOn: true,
    })
    .then(() => {
      console.log("Game started successfully.");
    })
    .catch((error) => {
      console.error("Error staring game: ", error);
    });
};

export const endGame = async (roomId: string) => {
  const roomRef = firebase.firestore().collection("rooms").doc(roomId);
  const playersRef = roomRef.collection("players");

  try {
    // Update room settings to end the game
    await roomRef.update({
      isGameOn: false,
      selectedLetters: [""],
      currentRound: 0,
      isRoundUp: false,
    });
    console.log("Game ended successfully.");

    // Fetch all players in the room
    const playersSnapshot = await playersRef.get();

    // Loop through each player and reset their score and rounds
    const batch = firebase.firestore().batch(); // Use Firestore batch for multiple updates

    playersSnapshot.forEach((playerDoc) => {
      const playerRef = playersRef.doc(playerDoc.id);

      // Reset score to zero and empty the rounds array
      batch.update(playerRef, {
        score: 0,
        rounds: [],
      });
    });

    // Commit the batch update to reset all players
    await batch.commit();
    console.log("All players' scores and rounds reset.");
  } catch (error) {
    console.error("Error ending game or resetting players: ", error);
  }
};

export const selectRandomLetters = async (roomId: string) => {
  const roomRef = firebase.firestore().collection("rooms").doc(roomId);
  const selectedLetters: string[] = [];

  while (selectedLetters.length < 5) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const letter = alphabet[randomIndex];

    // Ensure the letter is unique before adding
    if (!selectedLetters.includes(letter)) {
      selectedLetters.push(letter);
    }
  }

  console.log("Selected Letters: ", selectedLetters);

  roomRef
    .update({
      selectedLetters: selectedLetters,
    })
    .then(() => {
      console.log("Letters selected successfully.");
    })
    .catch((error) => {
      console.error("Error Selecting letters: ", error);
    });
};

export const goNextRound = async (roomId: string, currentRound: number) => {
  const roomRef = firebase.firestore().collection("rooms").doc(roomId);
  const playersRef = roomRef.collection("players");

  try {
    // Step 1: Update the room's currentRound
    await roomRef.update({
      currentRound: currentRound + 1,
      isRoundUp: false,
    });

    console.log("Went to next round successfully.");

    // Step 2: Fetch all players in the room
    const playersSnapshot = await playersRef.get();

    const batch = firebase.firestore().batch();

    // Step 3: Update each player's current round
    playersSnapshot.forEach((playerDoc) => {
      const playerData = playerDoc.data() as Player;

      // Find the player's round for the currentRound
      const roundIndex = playerData.rounds.findIndex(
        (round) => round.rank === currentRound
      );

      if (roundIndex === -1) {
        // Add a new round if it doesn't exist
        playerData.rounds.push({
          rank: currentRound + 1, // Update rank to match new currentRound
          score: 0, // Initialize score for new round
          boy: { answer: "", score: 0 },
          girl: { answer: "", score: 0 },
          plant: { answer: "", score: 0 },
          inanimateObject: { answer: "", score: 0 },
          animal: { answer: "", score: 0 },
          country: { answer: "", score: 0 },
        });
      } else {
        // Update the round rank to match the currentRound
        playerData.rounds[roundIndex].rank = currentRound + 1;
      }

      // Step 4: Batch update the player's rounds
      const playerRef = playersRef.doc(playerDoc.id);
      batch.update(playerRef, {
        rounds: playerData.rounds,
      });
    });

    // Commit all updates
    await batch.commit();
    console.log("Players' rounds updated successfully.");
  } catch (error) {
    console.error("Error going to next round and updating players: ", error);
  }
};

export const roundUp = async (roomId: string, isRoundUp: boolean) => {
  const roomRef = firebase.firestore().collection("rooms").doc(roomId);

  roomRef
    .update({
      isRoundUp: !isRoundUp,
    })
    .then(() => {
      console.log("Round is set up successfully.");
    })
    .catch((error) => {
      console.error("Error setting round up: ", error);
    });
};

export const addRoundToPlayer = async (
  roomId: string,
  playerId: string,
  boy: Answer,
  girl: Answer,
  plant: Answer,
  inanimateObject: Answer,
  animal: Answer,
  country: Answer
) => {
  // Generate the new round object
  const newRound = {
    rank: 0,
    score: 0,
    boy,
    girl,
    plant,
    inanimateObject,
    animal,
    country,
  };

  try {
    // Reference to the player document in Firestore
    const playerRef = firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("players")
      .doc(playerId);

    // Update the player's Rounds array by adding the new round
    await playerRef.update({
      rounds: firebase.firestore.FieldValue.arrayUnion(newRound), // Append the new round
    });

    console.log("Round added successfully!");
  } catch (error) {
    console.error("Error adding round: ", error);
  }
};

export const addScoreToRound = async (
  roomId: string,
  playerId: string,
  score: number,
  currentRound: number
) => {
  try {
    const playerRef = firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("players")
      .doc(playerId);

    // Fetch the player data
    const playerDoc = await playerRef.get();

    if (!playerDoc.exists) {
      throw new Error("Player not found");
    }

    const playerData = playerDoc.data() as Player;

    // Find the current round in the player's rounds array
    const roundIndex = playerData.rounds.findIndex(
      (round) => round.rank === currentRound
    );

    if (roundIndex === -1) {
      throw new Error("Round not found");
    }

    // Update the round's score with the new score
    playerData.rounds[roundIndex].score += score;

    // Optionally, update the player's total score as well
    const updatedScore = playerData.score + score;

    // Update Firestore with the modified rounds and score
    await playerRef.update({
      rounds: playerData.rounds,
      score: updatedScore,
    });

    console.log("Score added to the round successfully!");
  } catch (error) {
    console.error("Error adding score to round: ", error);
  }
};
