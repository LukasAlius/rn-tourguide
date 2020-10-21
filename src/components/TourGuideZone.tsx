import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { BorderRadiusObject, Shape } from '../types'
import { Step } from './Step'
import { Wrapper } from './Wrapper'

export interface TourGuideZoneProps {
  zone: number
  isTourGuide?: boolean
  text?: string
  title?: string
  image?: React.ReactNode
  shape?: Shape
  maskOffset?: number
  borderRadius?: number
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  borderRadiusObject?: BorderRadiusObject
}

export const TourGuideZone = ({
  isTourGuide = true,
  zone,
  children,
  shape,
  text,
  title,
  image,
  maskOffset,
  borderRadius,
  style,
  keepTooltipPosition,
  tooltipBottomOffset,
  borderRadiusObject,
}: TourGuideZoneProps) => {
  if (!isTourGuide) {
    return <>{children}</>
  }

  return (
    <Step
      text={text ?? `Zone ${zone}`}
      order={zone}
      name={`${zone}`}
      {...{
        shape,
        maskOffset,
        borderRadius,
        keepTooltipPosition,
        tooltipBottomOffset,
        borderRadiusObject,
        title,
        image
      }}
    >
      <Wrapper {...{ style }}>{children}</Wrapper>
    </Step>
  )
}
