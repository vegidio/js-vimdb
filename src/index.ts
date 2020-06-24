import * as config from 'config'
import logger from './logger'

const serverConfig = config.util.toObject(config.get('server'))

const msg = `Server running on ${serverConfig.host}:${serverConfig.port}`
logger.info(msg)