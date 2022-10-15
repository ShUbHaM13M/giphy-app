import { memo, useCallback, useEffect } from "react";
import {
  Image,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Linking,
  Alert,
  Share,
  Pressable,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import colors from "../colors";
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

const { width: sWidth } = Dimensions.get("window");
const AVATAR_SIZE = 26;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Gif({ gifData }) {
  const anim = useSharedValue(0.96);
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: anim.value }],
      borderWidth: interpolate(anim.value, [0.8, 1], [10, 0]),
      borderColor: colors.accent,
      borderRadius: 4,
    };
  }, []);

  useEffect(() => {
    anim.value = withSpring(1);
  }, []);

  const onUserLinkClicked = useCallback(async () => {
    const url = gifData?.user?.profile_url;
    if (!url) return;
    const isSupported = await Linking.canOpenURL(url);
    if (isSupported) await Linking.openURL(url);
    else Alert.alert(`Unable to open url: ${url}`);
  }, []);

  const onShareGifClicked = useCallback(async () => {
    try {
      const response = await Share.share(
        {
          message: `Heyy (^^), checkout this gif: ${gifData.url}`,
          title: "Sharing gif",
          url: gifData.url,
        },
        {
          dialogTitle: "Sharing gif",
        }
      );
      if (!response.activityType) anim.value = withSpring(1);
    } catch (error) {
      Alert.alert(error.message);
    }
  }, []);

  return (
    <AnimatedPressable
      onLongPress={onShareGifClicked}
      delayLongPress={450}
      onPressIn={() => (anim.value = withTiming(0.94, { duration: 450 }))}
      onPressOut={() => (anim.value = withTiming(1, { duration: 350 }))}
      style={[styles.container, rContainerStyle]}
    >
      <View pointerEvents="none" style={styles.gifContainer}>
        <Image source={{ uri: gifData.url }} style={styles.gif} />
      </View>
      <Text style={styles.title}>{gifData.title}</Text>
      {gifData.user && (
        <>
          <View style={styles.divider} />
          <View style={styles.userDetails}>
            {gifData.user.avatar_url ? (
              <Image
                style={styles.userAvatar}
                source={{
                  uri: gifData.user.avatar_url,
                }}
              />
            ) : (
              <View style={[styles.userAvatar]} />
            )}

            <Text onPress={onUserLinkClicked} style={styles.userName}>
              {gifData.user.username || ""}
            </Text>
            <Entypo
              onPress={() => {
                anim.value = withSpring(0.94);
                onShareGifClicked();
              }}
              name="share-alternative"
              size={22}
              color="white"
            />
          </View>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    alignItems: "center",
    marginVertical: 8,
    justifyContent: "flex-start",
    borderRadius: 4,
    padding: 16,
    width: sWidth * 0.85,
    maxWidth: 450,
  },
  gifContainer: {
    width: sWidth * 0.75,
    aspectRatio: 4 / 3,
    marginBottom: 8,
  },
  gif: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
    borderRadius: 4,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    width: "100%",
    fontWeight: "600",
    marginVertical: 4,
  },
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: "grey",
    marginVertical: 4,
    opacity: 0.15,
  },
  userDetails: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    alignItems: "center",
  },
  userAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.accent,
    marginRight: 8,
  },
  userName: {
    color: "#888",
    flex: 1,
    fontSize: 16,
  },
  shareButton: {},
});

export default memo(Gif);
