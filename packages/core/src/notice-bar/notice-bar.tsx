import { View } from "@tarojs/components"
import type { ViewProps } from "@tarojs/components/types/View"
import { nextTick } from "@tarojs/taro"
import classNames from "classnames"
import * as React from "react"
import { useImperativeHandle, forwardRef, type ForwardedRef } from "react"
import {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { prefixClassname } from "../styles"
import { getRect } from "../utils/dom/rect"
import { addUnitPx } from "../utils/format/unit"
import { doubleRaf } from "../utils/raf"
import { NoticeBarAction } from "./notice-bar-action"
import { NoticeBarIcon } from "./notice-bar-icon"
import type { NoticeBarInterface } from "./notice-bar.shared"

interface NoticeBarChildren {
  icon: ReactNode
  text: ReactNode[]
  action: ReactNode
}

function useChildren(children: ReactNode): NoticeBarChildren {
  const __children__: NoticeBarChildren = {
    icon: undefined,
    text: [],
    action: undefined,
  }
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const element = child as ReactElement
      const elementType = element.type
      if (elementType === NoticeBarIcon) {
        __children__.icon = element
      } else if (elementType === NoticeBarAction) {
        __children__.action = element
      } else {
        __children__.text.push(child)
      }
    } else {
      __children__.text.push(child)
    }
  })
  return __children__
}

export interface NoticeBarProps extends ViewProps {
  className?: string
  style?: CSSProperties
  delay?: number
  speed?: number
  scrollable?: boolean
  wordwrap?: boolean
  children?: ReactNode
  onReplay?(): void
}

function NoticeBar(props: NoticeBarProps, ref: ForwardedRef<NoticeBarInterface>) {
  const {
    className,
    delay = 1000,
    speed = 60,
    wordwrap,
    scrollable = false,
    children: childrenProp,
    onReplay,
    ...restProps
  } = props

  const { icon, text, action } = useChildren(childrenProp)

  const ellipsis = !scrollable && !wordwrap
  const startTimerRef = useRef<NodeJS.Timeout>()
  const wrapRef = useRef()
  const contentRef = useRef()

  const [offset, setOffset] = useState(0)
  const [duration, setDuration] = useState(0)

  const wrapWidthRef = useRef(0)
  const contentWidthRef = useRef(0)

  const contentStyle = useMemo<CSSProperties>(
    () => ({
      transform: offset ? `translateX(${addUnitPx(offset)})` : "",
      transitionDuration: `${duration}s`,
    }),
    [offset, duration],
  )

  function onTransitionEnd() {
    setOffset(wrapWidthRef.current)
    setDuration(0)

    nextTick(() => {
      // use double raf to ensure animation can start
      doubleRaf(() => {
        setOffset(-contentWidthRef.current)
        setDuration((contentWidthRef.current + wrapWidthRef.current) / +speed)
        onReplay?.()
      })
    })
  }

  function reset() {
    wrapWidthRef.current = 0
    contentWidthRef.current = 0
    setOffset(0)
    setDuration(0)

    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current)
    }

    startTimerRef.current = setTimeout(async () => {
      if (!wrapRef.current || !contentRef.current || !scrollable) {
        return
      }

      nextTick(() =>
        Promise.all([getRect(wrapRef), getRect(contentRef)]).then(
          ([{ width: wrapRefWidth }, { width: contentRefWidth }]) => {
            if (scrollable || contentRefWidth > wrapRefWidth) {
              doubleRaf(() => {
                wrapWidthRef.current = wrapRefWidth
                contentWidthRef.current = contentRefWidth
                setOffset(-contentRefWidth)
                setDuration(contentRefWidth / +speed)
              })
            }
          },
        ),
      )
    }, +delay)
  }

  useImperativeHandle(ref, () => ({
    reset,
  }))

  useEffect(reset, [])

  return (
    <View
      className={classNames(
        prefixClassname("notice-bar"),
        {
          [prefixClassname("notice-bar--wordwrap")]: wordwrap,
        },
        className,
      )}
      {...restProps}
    >
      {icon}
      <View ref={wrapRef} className={prefixClassname("notice-bar__wrap")}>
        <View
          ref={contentRef}
          style={contentStyle}
          className={classNames(prefixClassname("notice-bar__content"), {
            [prefixClassname("ellipsis")]: ellipsis,
          })}
          children={text}
          onTransitionEnd={onTransitionEnd}
        />
      </View>
      {action}
    </View>
  )
}

export default forwardRef(NoticeBar)
