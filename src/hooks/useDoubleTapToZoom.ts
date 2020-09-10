/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useCallback } from "react";
import {
  ScrollView,
  NativeTouchEvent,
  NativeSyntheticEvent,
} from "react-native";

import { Dimensions } from "../@types";

const DOUBLE_TAP_DELAY = 200;
let lastTapTS: number | null = null;

let firstPress = true;
let timer: any = false;

/**
 * This is iOS only.
 * Same functionality for Android implemented inside usePanResponder hook.
 */
function useDoubleTapToZoom(
  scrollViewRef: React.RefObject<ScrollView>,
  scaled: boolean,
  screen: Dimensions
) {
  const handleDoubleTap = useCallback(
    (event: NativeSyntheticEvent<NativeTouchEvent>) => {
      // const nowTS = new Date().getTime();
      const scrollResponderRef = scrollViewRef?.current?.getScrollResponder();

      // if (firstPress) {
      //   // set the flag indicating first press has occured
      //   firstPress = false;

      //   //start a timer --> if a second tap doesnt come in by the delay, trigger singleTap event handler
      //   timer = setTimeout(() => {
      //     //check if user passed in prop
      //     // this.props.singleTap ? this.props.singleTap(e) : null;
      //     console.log(123)

      //     // reset back to initial state
      //     firstPress = true;
      //     timer = false;
      //   }, DOUBLE_TAP_DELAY);

      //   // mark the last time of the press
      //   lastTapTS = nowTS;

      // } else {
      //   if (lastTapTS && nowTS - lastTapTS < DOUBLE_TAP_DELAY) {
      //     timer && clearTimeout(timer);

      //     const { pageX, pageY } = event.nativeEvent;
      //     let targetX = 0;
      //     let targetY = 0;
      //     let targetWidth = screen.width;
      //     let targetHeight = screen.height;

      //     // Zooming in
      //     // TODO: Add more precise calculation of targetX, targetY based on touch
      //     if (!scaled) {
      //       targetX = pageX / 2;
      //       targetY = pageY / 2;
      //       targetWidth = screen.width / 2;
      //       targetHeight = screen.height / 2;
      //     }

      //     // @ts-ignore
      //     scrollResponderRef?.scrollResponderZoomTo({
      //       x: targetX,
      //       y: targetY,
      //       width: targetWidth,
      //       height: targetHeight,
      //       animated: true,
      //     });
      //     firstPress = true;
      //   }
      // }

      const { pageX, pageY } = event.nativeEvent;
      let targetX = 0;
      let targetY = 0;
      let targetWidth = screen.width;
      let targetHeight = screen.height;

      // Zooming in
      // TODO: Add more precise calculation of targetX, targetY based on touch
      if (!scaled) {
        targetX = pageX / 2;
        targetY = pageY / 2;
        targetWidth = screen.width / 2;
        targetHeight = screen.height / 2;
      }

      // @ts-ignore
      scrollResponderRef?.scrollResponderZoomTo({
        x: targetX,
        y: targetY,
        width: targetWidth,
        height: targetHeight,
        animated: true,
      });

      // if (lastTapTS && nowTS - lastTapTS < DOUBLE_TAP_DELAY) {
      //   const { pageX, pageY } = event.nativeEvent;
      //   let targetX = 0;
      //   let targetY = 0;
      //   let targetWidth = screen.width;
      //   let targetHeight = screen.height;

      //   // Zooming in
      //   // TODO: Add more precise calculation of targetX, targetY based on touch
      //   if (!scaled) {
      //     targetX = pageX / 2;
      //     targetY = pageY / 2;
      //     targetWidth = screen.width / 2;
      //     targetHeight = screen.height / 2;
      //   }

      //   // @ts-ignore
      //   scrollResponderRef?.scrollResponderZoomTo({
      //     x: targetX,
      //     y: targetY,
      //     width: targetWidth,
      //     height: targetHeight,
      //     animated: true,
      //   });
      // } else {
      //   lastTapTS = nowTS;
      //   console.log(123)
      // }
    },
    [scaled]
  );

  return handleDoubleTap;
}

export default useDoubleTapToZoom;
