import { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  StatusBar,
  Text,
  FlatList,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { Entypo } from "@expo/vector-icons";
import colors from "./colors";
import { getGif } from "./utils/get-gif";
import { Gif, Menu, Loading } from "./components";

const words =
  "#drone #funny #catgif #broken #lost #hilarious #good #red #blue #nono #why #yes #yesyes #aliens #green";

/**
 * // !TODO: Fetch more on scrolling down
 * // ?TODO: Loading state
 * // *TODO: Sharesheet to share the gif (maybe on long press or a share button)
 */

const ANIMATION_CONFIG = { duration: 250 };

export default function App() {
  const offset = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [currentSearch, setCurrentSearch] = useState("Trending");
  const anim = useDerivedValue(() => {
    return open
      ? withTiming(0, ANIMATION_CONFIG)
      : withTiming(1, ANIMATION_CONFIG);
  }, [open]);

  const rLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: anim.value,
      transform: [
        {
          translateY: interpolate(anim.value, [0, 1], [-10, 0]),
        },
      ],
    };
  }, []);

  const onCurrentQueryClicked = useCallback(async () => {
    const res = await fetch("https://random-word-api.herokuapp.com/word");
    const data = await res.json();
    onSubmit(data[0] || words[Math.random() * words.length - 1]);
  }, []);

  const onSubmit = useCallback((searchQuery) => {
    setIsLoading(true);
    offset.current = 0;
    setOpen(false);
    setCurrentSearch(searchQuery);
    getGif(searchQuery.replace(/ /g, ""), offset.current).then((data) => {
      setGifs(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    getGif(currentSearch, offset.current).then((data) => {
      setGifs(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light" backgroundColor={colors.accent} />
      <View style={styles.nav}>
        <Animated.Text style={[styles.title, rLabelStyle]}>Giphy</Animated.Text>
        <Pressable onPress={() => setOpen((prev) => !prev)}>
          {open ? (
            <Entypo name="cross" size={34} color={colors.accent} />
          ) : (
            <Entypo name="magnifying-glass" size={34} color={colors.accent} />
          )}
        </Pressable>
      </View>
      {isLoading ? (
        <Loading />
      ) : (
        <View style={styles.content}>
          {gifs.length ? (
            <FlatList
              ListHeaderComponent={
                <Pressable onPress={onCurrentQueryClicked} style={styles.info}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    {currentSearch}
                  </Text>
                </Pressable>
              }
              contentContainerStyle={styles.gifContainer}
              data={gifs}
              onEndReachedThreshold={0.01}
              onEndReached={() => {
                offset.current += 10;
                getGif(currentSearch, offset.current).then((data) => {
                  setGifs((prev) => [...prev, ...data]);
                });
              }}
              renderItem={({ item }) => <Gif gifData={item} />}
              keyExtractor={(_, index) => index.toString()}
            />
          ) : (
            <View style={styles.noGifContainer}>
              <Entypo name="emoji-sad" size={84} color="white" />
              <Text style={styles.noGifText}>
                Err.. No gifs found, try a different keyword.
              </Text>
            </View>
          )}
        </View>
      )}
      <Menu anim={anim} isOpen={open} onSubmit={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 8,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    zIndex: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    paddingVertical: 16,
  },
  info: {
    backgroundColor: colors.secondary,
    borderRadius: 4,
    marginVertical: 8,
    justifyContent: "center",
    padding: 16,
  },
  gifContainer: {
    width: "100%",
    paddingBottom: 150,
    paddingHorizontal: 16,
  },
  noGifContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    marginTop: 120,
  },
  noGifText: {
    color: "white",
    fontSize: 26,
    marginTop: 16,
  },
});
