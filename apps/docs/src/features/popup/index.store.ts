import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import type { DemoPopupProps } from '@/features/popup/childs/demo'

export type PopupStateValue = {
  visible?: boolean
  // 需要展示时再加载（调用 show 或 hide 时）
  load?: boolean
  title?: string
  [key: string]: unknown
}
export type PopupState = {
  [key: string]: PopupStateValue
}

export const initialState = {
  demo: {
    visible: false,
    title: '示例表单',
    foo: '',
  } as DemoPopupProps,
}

export type PopupKeys = keyof typeof initialState
export type Popups = typeof initialState

export const counterSlice = createSlice({
  name: 'popup',
  initialState: initialState as PopupState,
  reducers: {
    show: (
      state,
      action: PayloadAction<{ key: PopupKeys; props: PopupStateValue }>
    ) => {
      const { key, props } = action.payload
      state[key] = { ...props, visible: true, load: true }
    },
    hide: (
      state,
      action: PayloadAction<{ key: PopupKeys; props: PopupStateValue }>
    ) => {
      const { key, props } = action.payload
      state[key] = { ...props, visible: false, load: true }
    },
    setter: (
      state,
      action: PayloadAction<{ key: PopupKeys; props: PopupStateValue }>
    ) => {
      const { key, props } = action.payload
      state[key] = props
    },
  },
})

// Action creators are generated for each case reducer function
export const { show, hide, setter } = counterSlice.actions

export const usePopup = <K extends PopupKeys>(popupKey: K) => {
  const popups = useSelector((state: RootState) => state.popup)
  const dispatch = useDispatch()

  const state = popups[popupKey] as Popups[K]

  const ctl = {
    show: (props?: Popups[K]) =>
      dispatch(show({ key: popupKey, props: props as PopupStateValue })),
    hide: (props?: Popups[K]) =>
      dispatch(hide({ key: popupKey, props: props as PopupStateValue })),
    setState: setter,
  }

  return [state, ctl] as const
}

export const usePopupCtl = (popupKey: PopupKeys) => {
  const [, ctl] = usePopup(popupKey)
  return ctl
}

export default counterSlice.reducer
