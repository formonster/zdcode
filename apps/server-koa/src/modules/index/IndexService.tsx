import React from 'react'
import knex from '../../utils/knex'
import { getPromiseData } from '@zdcode/utils'
import { renderToString } from 'react-dom/server'
import { Response } from '../../types/IData'
import { resSuccess } from '../../utils/common'
import { IIndexService } from './IndexInterface'
import { Column } from '@zdcode/superdb'

class IndexService implements IIndexService {
  check(): Response<boolean> {
    return resSuccess(true)
  }
  hello(): string {
    return renderToString(
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          height: '100vh',
          width: '100vw',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
      >
        <h1 style={{ color: '#fff' }}>Hello KoaServer!</h1>
      </div>
    )
  }
}

export default IndexService
