import * as path from 'path'
import * as del from 'del'

const distDir = path.resolve(__dirname, '../dist')
del.sync([distDir], { force: true })
