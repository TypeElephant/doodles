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
} from "react-native-reanimated"
import { mixColor } from "react-native-redash"

import { Sizing } from "./styles"
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
const INTERVAL = 1000
const RECTANGLE_MARGIN_BOTTOM = Sizing.x5
const RECTANGLES_COUNT =
  Math.floor(Sizing.screen.height / (Sizing.x20 + RECTANGLE_MARGIN_BOTTOM)) - 10
const RECTANGLE_HEIGHT = Sizing.x20
const OUTER_MARGIN = 40
const MIN_WIDTH = 20
const MAX_WIDTH = Sizing.screen.width - OUTER_MARGIN

const randomColor = () => {
  "worklet"
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

const rectangles = new Array(RECTANGLES_COUNT).fill(0)

const NeonCode: FC = () => {
  useStatusBar("light", BACKGROUND_COLOR)

  return (
    <SafeAreaView style={style.container}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        {rectangles.map((_, index: number) => {
          return <Rectangle key={index} />
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const Rectangle: FC = () => {
  const progress = useSharedValue(0)
  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: INTERVAL }), -1, true)
  }, [progress])

  const leftRandomWidth = useSharedValue(0)
  const rightRandomWidth = useSharedValue(Math.random() * MAX_WIDTH)

  const width = useDerivedValue(() => {
    if (progress.value === 0) {
      rightRandomWidth.value = Math.random() * MAX_WIDTH
    }
    if (progress.value === 1) {
      leftRandomWidth.value = Math.random() * MAX_WIDTH
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
    if (progress.value === 0) {
      rightRandomColor.value = randomColor()
    }
    if (progress.value === 1) {
      leftRandomColor.value = randomColor()
    }

    return mixColor(
      progress.value,
      leftRandomColor.value as ReactText,
      rightRandomColor.value as ReactText,
    )
  })

  const animatedRectangleStyle: ViewStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
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
    padding: Sizing.x20,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: BACKGROUND_COLOR,
  },
  rectangle: {
    height: RECTANGLE_HEIGHT,
    marginBottom: RECTANGLE_MARGIN_BOTTOM,
  },
})

export default NeonCode
