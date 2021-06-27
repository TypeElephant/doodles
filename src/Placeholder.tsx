import React, { FC, useEffect, useState, ReactText } from "react"
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
import { mixColor, ReText } from "react-native-redash"

import { Sizing } from "./styles"

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
const INTERVAL = 4000
const RECTANGLES_COUNT = 10
const OUTER_MARGIN = 40
const MIN_WIDTH = 20
const MAX_WIDTH = Sizing.screen.width - OUTER_MARGIN

const randomColor = () => {
  "worklet"
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

const rectangles = new Array(RECTANGLES_COUNT).fill(0)

const Placeholder: FC = () => {
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

  const currentColor = randomColor()
  const prevRandomWidth = useSharedValue(Math.random() * MAX_WIDTH)
  const nextRandomWidth = useSharedValue(Math.random() * MAX_WIDTH)

  const width = useDerivedValue(() => {
    if (progress.value === 0) {
      nextRandomWidth.value = Math.random() * MAX_WIDTH
    }
    if (progress.value === 1) {
      prevRandomWidth.value = Math.random() * MAX_WIDTH
    }

    return interpolate(
      progress.value,
      [0, 1],
      [prevRandomWidth.value, nextRandomWidth.value],
    )
  })

  const rectangleStyle: ViewStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: 10,
      backgroundColor: currentColor as ColorValue,
    }
  })

  return (
    <View>
      <Animated.View style={rectangleStyle} />
    </View>
  )
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
    backgroundColor: BACKGROUND_COLOR,
  },
})

export default Placeholder
