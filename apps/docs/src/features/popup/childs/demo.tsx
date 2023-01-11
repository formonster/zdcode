import React, { FC } from 'react'
import { Modal } from 'antd'
import { PopupStateValue, usePopup } from '@/features/popup/index.store'

export interface DemoPopupProps extends PopupStateValue {
  foo: string
}

const DemoPopup: FC = function () {
  const [popup, popupCtl] = usePopup('demo')

  return (
    <>
      <Modal
        title={popup.title}
        visible={popup.visible}
        onOk={() => popupCtl.hide()}
        onCancel={() => popupCtl.hide()}
      >
        Demo Popup
      </Modal>
    </>
  )
}

export default DemoPopup
