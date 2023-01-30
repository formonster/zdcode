import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import lazyComponent from '@/components/LazyComponent'
import { RootState } from '@/store'
import { PopupKeys, Popups } from './index.store'

export * from './index.store'

const popupsComponent: { [key in PopupKeys]: JSX.Element } = {
  demo: lazyComponent(() => import('./childs/demo')),
  tableData: lazyComponent(() => import('./childs/tableData')),
}

const Popup: FC<{}> = function () {
  const popups: Partial<Popups> = useSelector((state: RootState) => state.popup)

  return (
    <>
      {Object.entries(popups).map(([key, props], i) => {
        // @ts-ignore
        return popups[key].load && <div key={key}>{popupsComponent[key as PopupKeys]}</div>
      })}
    </>
  )
}

export default Popup
