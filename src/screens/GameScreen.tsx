import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Dimensions } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import useAccelerometer from "../hooks/useAccelerometer";
import type { TimeOption } from "../types/game";
import type { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
type Props = StackScreenProps<RootStackParamList, "Game">;

const GameScreen = ({ route, navigation }: Props) => {
  const { words, timeout } = route.params;
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeout);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"skip" | "correct" | null>(null);

  const startGame = async () => {
    try {
      // Reset states first
      setGameOver(false);
      setScore(0);
      setTimeLeft(timeout);
      setFeedback(null);
      setCurrentWord("");

      // Change orientation and start game
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
      nextWord();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const endGame = async () => {
    try {
      // Stop the game first
      setIsPlaying(false);
      setFeedback(null);

      // Wait a bit before changing orientation
      setTimeout(async () => {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
        setGameOver(true);
      }, 100);
    } catch (error) {
      console.error("Error ending game:", error);
    }
  };

  const nextWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
  };

  const handleCorrect = () => {
    setFeedback("correct");
    setScore((prev) => prev + 1);
    setTimeout(() => {
      setFeedback(null);
      nextWord();
    }, 800);
  };

  const handleSkip = () => {
    setFeedback("skip");
    setTimeout(() => {
      setFeedback(null);
      nextWord();
    }, 800);
  };

  const returnToHome = async () => {
    try {
      setIsPlaying(false);
      setFeedback(null);

      // Wait for states to update before navigation
      setTimeout(async () => {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
        navigation.navigate("Home");
      }, 100);
    } catch (error) {
      console.error("Error returning to home:", error);
    }
  };

  useAccelerometer(handleSkip, handleCorrect);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft((prev: TimeOption) => {
        if (prev <= 1) {
          endGame();
          return timeout;
        }
        return (prev - 1) as TimeOption;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Clean up function to ensure proper orientation reset
  useEffect(() => {
    return () => {
      // Reset orientation and cleanup when component unmounts
      setIsPlaying(false);
      setFeedback(null);
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  return (
    <View style={styles.container}>
      {isPlaying ? (
        <>
          <Text style={styles.timer}>เวลา: {timeLeft}</Text>
          {feedback ? (
            <View
              style={[
                styles.feedbackContainer,
                feedback === "correct"
                  ? styles.correctFeedback
                  : styles.skipFeedback,
              ]}
            >
              <Text style={styles.feedbackText}>
                {feedback === "correct" ? "ถูกต้อง! 🎉" : "ข้าม ⏭"}
              </Text>
            </View>
          ) : (
            <Text style={styles.word}>{currentWord}</Text>
          )}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructions}>🔼 เงยหัวขึ้นเพื่อข้าม</Text>
            <Text style={styles.instructions}>🔽 ก้มหัวลงเพื่อนับคะแนน</Text>
          </View>
        </>
      ) : (
        <View style={styles.gameOverContainer}>
          {gameOver ? (
            <>
              <Text style={styles.gameOver}>หมดเวลา!</Text>
              <Text style={styles.finalScore}>คะแนนรวม: {score}</Text>
            </>
          ) : (
            <Text style={styles.title}>พร้อมเล่นหรือยัง?</Text>
          )}
          <View style={styles.buttonContainer}>
            <Button
              title={gameOver ? "เล่นอีกครั้ง" : "เริ่มเกม"}
              onPress={startGame}
            />
            <View style={styles.buttonSpacer} />
            <Button title="กลับหน้าหลัก" onPress={returnToHome} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  timer: {
    fontSize: 24,
    marginBottom: 20,
    color: "#666",
  },
  word: {
    fontSize: 90,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  score: {
    fontSize: 24,
    marginTop: 20,
    color: "#4CAF50",
  },
  hint: {
    position: "absolute",
    bottom: 20,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  gameOverContainer: {
    alignItems: "center",
  },
  gameOver: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  finalScore: {
    fontSize: 30,
    marginBottom: 30,
    color: "#4CAF50",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonSpacer: {
    width: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  instructionsContainer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 10,
    borderRadius: 10,
  },
  instructions: {
    fontSize: 18,
    color: "#333",
    marginVertical: 5,
    fontWeight: "bold",
  },
  feedbackContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    minWidth: 300,
  },
  correctFeedback: {
    backgroundColor: "rgba(76, 175, 80, 0.9)", // Green background
  },
  skipFeedback: {
    backgroundColor: "rgba(244, 67, 54, 0.9)", // Red background
  },
  feedbackText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default GameScreen;
