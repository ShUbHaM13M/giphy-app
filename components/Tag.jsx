import { Pressable, Text, StyleSheet } from "react-native";

export default function Tag({ tagName, onTagPressed }) {
  return (
    <Pressable
      style={{
        padding: 4,
      }}
      onPress={() => {
        onTagPressed && onTagPressed(tagName);
      }}
    >
      <Text style={styles.tag}>{tagName}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    color: "#9d9fac",
    fontSize: 14,
  },
});
