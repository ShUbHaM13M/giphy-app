import Svg, { Path } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  interpolate,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SvgComponent = ({ open, ...props }) => {
  const rProps = useAnimatedProps(() => {
    return {
      d: interpolate(
        open.value,
        [0, 1],
        [
          `M15.583 26.917c6.26 0 11.334-5.074 11.334-11.334 0-6.259-5.074-11.333-11.334-11.333C9.324 4.25 4.25 9.324 4.25 15.583c0 6.26 5.074 11.334 11.333 11.334ZM29.75 29.75l-6.163-6.163`,
          `M28 6 6 28M28 28 6 6`,
        ]
      ),
    };
  }, []);

  return (
    <Svg width={34} height={34} fill="none" {...props}>
      <AnimatedPath
        stroke="#D17C78"
        strokeWidth={4}
        strokeLinecap="round"
        d="M15.583 26.917c6.26 0 11.334-5.074 11.334-11.334 0-6.259-5.074-11.333-11.334-11.333C9.324 4.25 4.25 9.324 4.25 15.583c0 6.26 5.074 11.334 11.333 11.334ZM29.75 29.75l-6.163-6.163"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SvgComponent;
