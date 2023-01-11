import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import lazyComponent from '@/components/LazyComponent'
import { RootState } from '@/store'
import { PopupKeys, Popups } from './index.store'

const popupsComponent: { [key in PopupKeys]: () => JSX.Element } = {
  demo: lazyComponent(() => import('./childs/demo')),
}

const Popup: FC<{}> = function () {
  const popups: Partial<Popups> = useSelector((state: RootState) => state.popup)

  return (
    <>
      {Object.entries(popups).map(([key, props], i) => {
        // @ts-ignore
        return popups[key].load && popupsComponent[key as PopupKeys]
      })}
    </>
  )
}

export default Popup
