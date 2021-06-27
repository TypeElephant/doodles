import React, { FC, useEffect, ReactText } from "react"
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ViewStyle,
  ColorValue,
  View,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  useDerivedValue,
  withRepeat,
  Easing,
} from "react-native-reanimated"
import { mixColor } from "react-native-redash"

import { Sizing, Outlines } from "./styles"
import useStatusBar from "./navigation/useStatusBar"

type Rectangle = {
  color: ColorValue
}

const BACKGROUND_COLOR: ColorValue = "#282c34"

const COLORS: ColorValue[] = [
  "#e06c75",
  "#98c379",
  "#e5c07d",
  "#61afef",
  "#c678dd",
  "#56b6c2",
  "#abb2bf",
]
const INTERVAL = 500
const RECTANGLE_HEIGHT = Sizing.x30
const RECTANGLE_MARGIN_BOTTOM = Sizing.x2
const RECTANGLES_COUNT = Math.floor(
  Sizing.screen.width / (RECTANGLE_HEIGHT + RECTANGLE_MARGIN_BOTTOM),
)
const OUTER_MARGIN = 80
const MIN_WIDTH = 20
const MAX_WIDTH = Sizing.screen.height - OUTER_MARGIN

const randomColor = () => {
  "worklet"
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

const rectangles = new Array(RECTANGLES_COUNT).fill(0)

const RandomBoi: FC = () => {
  useStatusBar("light", BACKGROUND_COLOR)

  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: INTERVAL, easing: Easing.ease }),
      -1,
      true,
    )
  }, [progress])

  return (
    <SafeAreaView style={style.container}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        {rectangles.map((_, index: number) => {
          return <Rectangle key={index} index={index} progress={progress} />
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

interface RectangleProps {
  index: number
  progress: Animated.SharedValue<number>
}

const Rectangle: FC<RectangleProps> = ({ index, progress }) => {
  const leftRandomWidth = useSharedValue(0)
  const rightRandomWidth = useSharedValue(Math.random() * MAX_WIDTH)

  const width = useDerivedValue(() => {
    if (progress.value === 0) {
      const coin = Math.random() > 0.2
      if (coin) {
        const nextValue =
          (leftRandomWidth.value + Math.random() * 100) % MAX_WIDTH
        rightRandomWidth.value = Math.floor(nextValue)
      } else {
        const nextValue =
          (leftRandomWidth.value - Math.random() * 20) % MAX_WIDTH
        rightRandomWidth.value = Math.floor(nextValue)
      }
    }
    if (progress.value === 1) {
      // leftRandomWidth.value = Math.random() * MAX_WIDTH
      const nextValue = (rightRandomWidth.value + 1) % MAX_WIDTH
      leftRandomWidth.value = nextValue
    }

    return interpolate(
      progress.value,
      [0, 1],
      [leftRandomWidth.value, rightRandomWidth.value],
    )
  })

  const leftRandomColor = useSharedValue(randomColor())
  const rightRandomColor = useSharedValue(randomColor())

  const color = useDerivedValue(() => {
    if (Math.random() > 0.6) {
      if (progress.value === 0) {
        rightRandomColor.value = randomColor()
      }
      if (progress.value === 1) {
        // leftRandomColor.value = randomColor()
      }
    }

    const mixValue = Math.sin((progress.value * 2 * Math.PI) / 20)

    return mixColor(
      mixValue,
      leftRandomColor.value as ReactText,
      rightRandomColor.value as ReactText,
    )
  })

  const animatedRectangleStyle: ViewStyle = useAnimatedStyle(() => {
    return {
      height: width.value,
      backgroundColor: color.value as ColorValue,
    }
  })

  return (
    <View>
      <Animated.View style={[style.rectangle, animatedRectangleStyle]} />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  contentContainer: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: BACKGROUND_COLOR,
  },
  rectangle: {
    width: RECTANGLE_HEIGHT,
    marginRight: RECTANGLE_MARGIN_BOTTOM,
    borderBottomLeftRadius: Outlines.borderRadius.max,
    borderBottomRightRadius: Outlines.borderRadius.max,
  },
})

export default RandomBoi
