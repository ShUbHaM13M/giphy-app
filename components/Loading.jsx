import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const BALL_SIZE = 18;

const Loading = () => {
  return (
    <View style={styles.container}>
      <Ball delay={0} color="cyan" />
      <Ball delay={100} color="magenta" />
      <Ball delay={200} color="yellow" />
    </View>
  );
};

const Ball = ({ delay, color }) => {
  const anim = useSharedValue(0);
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(anim.value, [0, 0.5, 1], [-10, 0, 10]),
        },
      ],
    };
  }, []);

  useEffect(() => {
    anim.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 350 }), -1, true)
    );
  }, []);

  return (
    <Animated.View style={[styles.ball, { backgroundColor: color }, rStyle]} />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  ball: {
    height: BALL_SIZE,
    width: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    marginHorizontal: 2,
  },
});

export default Loading;
