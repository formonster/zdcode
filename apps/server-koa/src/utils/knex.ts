import knex from 'knex'
import dbConfig from '../config/db'

const mysql = knex({
  client: 'mysql2',
  connection: dbConfig,
  pool: { min: 0, max: 7 },
})

// export const formatWhere = (query) => {

// }

export default mysql
