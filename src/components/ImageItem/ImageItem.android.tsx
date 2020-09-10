/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useCallback } from "react";

import {
  Animated,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";


import useImageDimensions from "../../hooks/useImageDimensions";
import usePanResponder from "../../hooks/usePanResponder";

import { getImageStyles, getImageTransform } from "../../utils";
import { ImageSource } from "../../@types";
import { ImageLoading } from "./ImageLoading";

import FastImage from 'react-native-fast-image';

const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.75;
const SCREEN = Dimensions.get("window");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

type Props = {
  imageSrc: ImageSource;
  onRequestClose: () => void;
  onZoom: (isZoomed: boolean) => void;
  onLongPress: (image: ImageSource) => void;
  delayLongPress: number;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
};

const ImageItem = ({
  imageSrc,
  onZoom,
  onRequestClose,
  onLongPress,
  delayLongPress,
  swipeToCloseEnabled = true,
  doubleTapToZoomEnabled = true,
}: Props) => {

  let { height, width }: any = imageSrc;
  const heightOverScreen = (!!height && !!width) && (
    (height / width) > (SCREEN_HEIGHT / SCREEN_WIDTH)
  )
  let imageDimensions;

  if (heightOverScreen) {
    imageDimensions = {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * (height / width)
    };
  } else {
    imageDimensions = useImageDimensions(imageSrc);
  }

  const imageContainer = React.createRef<any>();

  let [translate, scale] = getImageTransform(imageDimensions, SCREEN);
  if (heightOverScreen) {
    scale = 1
    translate = { x: 0, y: 0 }
  }

  const scrollValueY = new Animated.Value(0);
  const [isLoaded, setLoadEnd] = useState(false);

  const onLoaded = useCallback(() => setLoadEnd(true), []);
  const onZoomPerformed = (isZoomed: boolean) => {
    onZoom(isZoomed);
    if (imageContainer?.current) {
      // @ts-ignore
      imageContainer.current.setNativeProps({
        scrollEnabled: !isZoomed,
      });
    }
  };

  const onLongPressHandler = useCallback(() => {
    onLongPress(imageSrc);
  }, [imageSrc, onLongPress]);

  const [panHandlers, scaleValue, translateValue] = usePanResponder({
    initialScale: scale || 1,
    initialTranslate: translate || { x: 0, y: 0 },
    onZoom: onZoomPerformed,
    doubleTapToZoomEnabled,
    onLongPress: onLongPressHandler,
    delayLongPress,
    onSinglePress: onRequestClose
  });

  const imagesStyles = getImageStyles(
    imageDimensions,
    translateValue,
    scaleValue
  );
  const imageOpacity = scrollValueY.interpolate({
    inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
    outputRange: [0.7, 1, 0.7],
  });
  const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };

  const onScrollEndDrag = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const velocityY = nativeEvent?.velocity?.y ?? 0;
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    if (
      (Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY &&
        offsetY > SWIPE_CLOSE_OFFSET) ||
      offsetY > SCREEN_HEIGHT / 2
    ) {
      !heightOverScreen && onRequestClose();
    }
  };

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    scrollValueY.setValue(offsetY);
  };

  let AnimatedImge;

  if (heightOverScreen) {
    // 高宽比超过屏幕
    imageStylesWithOpacity.width = SCREEN_WIDTH
    imageStylesWithOpacity.height = SCREEN_WIDTH * (height / width)
    console.log(imageStylesWithOpacity)

    let { uri }: any = imageSrc;
    AnimatedImge =
      <Animated.View
        {...panHandlers}
        style={imageStylesWithOpacity}
      >
        <FastImage
          source={{
            uri: uri,
            priority: "high"
          }}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH * (height / width)
          }}
          onLoad={onLoaded}
        />
      </Animated.View>

  } else {
    AnimatedImge = <Animated.Image
      {...panHandlers}
      source={imageSrc}
      style={imageStylesWithOpacity}
      onLoad={onLoaded}
    />
  }

  return (
    <Animated.ScrollView
      ref={imageContainer}
      style={styles.listItem}
      pagingEnabled={false}
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={heightOverScreen ? {} : styles.imageScrollContainer}
      scrollEnabled={swipeToCloseEnabled}
      {...(swipeToCloseEnabled && !heightOverScreen && {
        onScroll,
        onScrollEndDrag,
      })}
    >
      {AnimatedImge}
      {(!isLoaded || !imageDimensions) && <ImageLoading />}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  imageScrollContainer: {
    height: "100%",
  },
});

export default React.memo(ImageItem);
