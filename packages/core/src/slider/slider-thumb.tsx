import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import classNames from "classnames"
import * as React from "react"
import { type ReactNode, useContext } from "react"
import { prefixClassname } from "../styles"
import { stopPropagation } from "../utils/dom/event"
import { getSizeStyle } from "../utils/format/unit"
import SliderContext from "./slider.context"

export interface SliderThumbProps extends ViewProps {
  size?: number
  children?: ReactNode
}

export interface InternalSliderThumbProps extends SliderThumbProps {
  index?: number
}

function SliderThumb(props: SliderThumbProps) {
  const { className, size, index, children, ...restProps } = props as InternalSliderThumbProps
  const { onTouchStart, onTouchMove, onTouchEnd } = useContext(SliderContext)

  return (
    <View
      className={classNames({
        [prefixClassname("slider__thumb-wrapper")]: index === undefined,
        [prefixClassname("slider__thumb-wrapper-left")]: index === 0,
        [prefixClassname("slider__thumb-wrapper-right")]: index === 1,
      })}
      style={{
        ...getSizeStyle(size),
      }}
      catchMove
      // @ts-ignore
      onTouchStart={(event) => onTouchStart?.(event, index)}
      // @ts-ignore
      onTouchMove={(event) => onTouchMove?.(event, index)}
      // @ts-ignore
      onTouchEnd={(event) => onTouchEnd?.(event, index)}
      // @ts-ignore
      onTouchCancel={(event) => onTouchEnd?.(event, index)}
      onClick={stopPropagation}
    >
      {
        //
        children ?? (
          <View
            className={classNames(prefixClassname("slider__thumb"), className)}
            {...restProps}
          />
        )
      }
    </View>
  )
}

export default SliderThumb
