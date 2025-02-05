import { useEffect, useState, useCallback } from "react";
import { Accelerometer } from "expo-sensors";

type AccelerometerCallback = () => void;

const useAccelerometer = (
  onTiltUp: AccelerometerCallback,
  onTiltDown: AccelerometerCallback
) => {
  const TILT_THRESHOLD = 0.5;
  const NEUTRAL_THRESHOLD = 0.2;
  const DEBOUNCE_TIME = 1000;
  const HORIZONTAL_THRESHOLD = 1;

  useEffect(() => {
    let lastUpdate = 0;
    let isProcessing = false;
    let isMounted = true;
    let lastZ = 0;
    let waitingForNeutral = false;

    const handleTilt = (callback: AccelerometerCallback) => {
      if (!isMounted || isProcessing || waitingForNeutral) return;

      isProcessing = true;
      waitingForNeutral = true;
      callback();

      setTimeout(() => {
        if (isMounted) {
          isProcessing = false;
        }
      }, 600);
    };

    const isPhoneHorizontal = (x: number, y: number) => {
      // Phone should be held in landscape mode
      // y close to 0 means phone is flat horizontally
      // x should be significant as phone is held sideways
      return Math.abs(y) < HORIZONTAL_THRESHOLD && Math.abs(x) > 0.7;
    };

    const checkNeutralPosition = (x: number, y: number, z: number) => {
      // Only reset when phone is horizontal and head is centered
      if (
        waitingForNeutral &&
        isPhoneHorizontal(x, y) &&
        Math.abs(z) < NEUTRAL_THRESHOLD
      ) {
        waitingForNeutral = false;
        lastUpdate = Date.now();
      }
    };

    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const now = Date.now();
      if (now - lastUpdate < DEBOUNCE_TIME || isProcessing || !isMounted)
        return;

      // Only proceed if phone is held horizontally
      if (!isPhoneHorizontal(x, y)) return;

      // Check if returned to neutral position
      checkNeutralPosition(x, y, z);

      // Don't process new tilts while waiting for neutral
      if (waitingForNeutral) return;

      const zDelta = z - lastZ;
      lastZ = z;

      // In landscape mode, still use z for head tilts
      if (z < -TILT_THRESHOLD && zDelta < -TILT_THRESHOLD / 2) {
        console.log("Tilt Up detected:", z, zDelta);
        handleTilt(onTiltUp);
        lastUpdate = now;
      } else if (z > TILT_THRESHOLD && zDelta > TILT_THRESHOLD / 2) {
        console.log("Tilt Down detected:", z, zDelta);
        handleTilt(onTiltDown);
        lastUpdate = now;
      }
    });

    return () => {
      isMounted = false;
      isProcessing = false;
      waitingForNeutral = false;
      subscription.remove();
    };
  }, [onTiltUp, onTiltDown]);
};

export default useAccelerometer;
