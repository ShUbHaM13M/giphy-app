import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Dimensions, View, TextInput, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  useDerivedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import colors from "../colors";
import { Entypo } from "@expo/vector-icons";
import Tag from "./Tag";

const tags0 =
  `#drone #funny #catgif #broken #lost #hilarious #good #red #blue #nono #why #yes #yesyes #aliens #green`.split(
    " "
  );
const tags1 =
  `#good #red #hilarious #blue #nono #why #yes #yesyes #aliens #green #drone #funny #catgif #broken #lost`.split(
    " "
  );
const tags2 =
  `#broken #lost #good #red #funny #hilarious #catgif #blue #nono #why #yes #yesyes #aliens #green #drone`.split(
    " "
  );

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

const { width: sWidth } = Dimensions.get("screen");
const INPUT_WIDTH = sWidth * 0.82;

export default function Menu({ anim, onSubmit, isOpen }) {
  const searchInputRef = useRef(null);
  const [value, setValue] = useState("");
  const inputBottomBorder = useDerivedValue(() => {
    if (anim.value === 0) return withDelay(150, withTiming(1));
    return withTiming(0);
  }, [anim]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const onTagPressed = useCallback((tag) => {
    onSubmit(tag);
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(anim.value, [0, 1], [1, 0]),
      borderWidth: interpolate(anim.value, [0, 1], [16, 0]),
      borderColor: interpolateColor(
        anim.value,
        [0, 1],
        [colors.darkBlue, "#00000000"]
      ),
    };
  }, []);

  const rSearchInputBorderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: -1 * (INPUT_WIDTH / 2) },
        { scaleX: inputBottomBorder.value },
        { translateX: INPUT_WIDTH / 2 },
      ],
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.menu,
        rStyle,
        {
          height: Dimensions.get("window").height,
          width: Dimensions.get("window").width,
        },
      ]}
      pointerEvents={isOpen ? "auto" : "none"}
    >
      <View style={{ paddingHorizontal: 24 }}>
        <View>
          <TextInput
            ref={searchInputRef}
            editable={isOpen}
            onSubmitEditing={() => {
              onSubmit(value);
              setValue("");
            }}
            selectTextOnFocus={isOpen}
            value={value}
            onChangeText={(text) => setValue(text)}
            style={[
              styles.input,
              {
                width: Dimensions.get("window").width * 0.82,
              },
            ]}
            placeholder="drones"
            placeholderTextColor={colors.primary}
          />

          <Animated.View
            style={[styles.inputBorder, rSearchInputBorderStyle]}
          />
        </View>

        <Text style={styles.textAccent}>Hit enter to close</Text>

        <View style={{ marginTop: 60 }}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Entypo name="arrow-long-right" size={24} color="#a0a2ae" />
              <Text style={styles.heading}>May we suggest ?</Text>
            </View>
            <View style={styles.tagContainer}>
              {shuffle(tags0).map((tag) => (
                <Tag tagName={tag} key={tag} onTagPressed={onTagPressed} />
              ))}
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Entypo name="arrow-long-right" size={24} color="#a0a2ae" />
              <Text style={styles.heading}>Is It This?</Text>
            </View>
            <View style={styles.tagContainer}>
              {shuffle(tags1).map((tag) => (
                <Tag tagName={tag} key={tag} onTagPressed={onTagPressed} />
              ))}
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Entypo name="arrow-long-right" size={24} color="#a0a2ae" />
              <Text style={styles.heading}>Needle, Where Art Thou?</Text>
            </View>
            <View style={styles.tagContainer}>
              {shuffle(tags2).map((tag) => (
                <Tag tagName={tag} key={tag} onTagPressed={onTagPressed} />
              ))}
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: colors.menu,
    borderColor: colors.darkBlue,
    alignItems: "center",
  },
  textAccent: {
    color: colors.accent,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  input: {
    fontSize: 42,
    marginTop: 132,
    color: "white",
  },
  inputBorder: {
    height: 2,
    backgroundColor: colors.accent,
    width: "100%",
  },
  heading: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#a0a2ae",
  },
  tagContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
});
