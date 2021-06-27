import React, { FC, useEffect, useState } from "react"
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ViewStyle,
  ColorValue,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  withTiming,
  withRepeat,
  interpolate,
} from "react-native-reanimated"
import { clamp } from "react-native-redash"

import { Sizing, Typography, Colors } from "./styles"

type Rectangle = {
  width: number
  color: ColorValue
}

const RECTANGLES_COUNT = 50

const COLORS: ColorValue[] = [
  "#e06c75",
  "#98c379",
  "#e5c07d",
  "#61afef",
  "#c678dd",
  "#56b6c2",
  "#abb2bf",
]

const OUTER_MARGIN = 40

const MAX_WIDTH = Sizing.screen.width - OUTER_MARGIN

const randomWidth = () => {
  return clamp(Math.floor(Math.random() * MAX_WIDTH), 20, 99999)
}

const randomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

const randomRectangle = (): Rectangle => {
  return {
    width: randomWidth(),
    color: randomColor(),
  }
}

const randomRectangles = (): Rectangle[] => {
  return new Array(RECTANGLES_COUNT).fill(0).map(() => randomRectangle())
}

const Placeholder: FC = () => {
  const rectangles: Rectangle[] = randomRectangles()

  return (
    <SafeAreaView style={style.container}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        {rectangles.map((rectangle: Rectangle, index: number) => {
          return <Rectangle rectangle={rectangle} key={index} />
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const INTERVAL = 1000

interface RectangleProps {
  rectangle: Rectangle
}

const Rectangle: FC<RectangleProps> = ({ rectangle }) => {
  const progress = useSharedValue(0)

  const [nextProgress, setNextProgress] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setNextProgress(Math.random())
      progress.value = withTiming(nextProgress, { duration: INTERVAL })
    }, INTERVAL)
  }, [nextProgress, progress])

  const rectangleStyle: ViewStyle = useAnimatedStyle(() => ({
    width: clamp(progress.value * MAX_WIDTH, 20, 99999),
    height: 10,
    backgroundColor: rectangle.color,
  }))

  return <Animated.View style={rectangleStyle} />
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: Sizing.x20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#282c34",
  },
})

export default Placeholder
