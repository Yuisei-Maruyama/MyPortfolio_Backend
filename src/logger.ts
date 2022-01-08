import winston, { loggers, format, transports } from 'winston'
import { exit } from '.'

const PORTFOLIO_NAME = process.env.PORTFOLIO_NAME || exit('PORTFOLIO_NAME not found.', 1)

class Logger {
  nameStack: string[] = []
  logger: winston.Logger

  constructor() {
    this.logger = loggers.add(PORTFOLIO_NAME, {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly', // 記録するログレベルの設定
      format: format.combine(format.timestamp(), format.label({ label: PORTFOLIO_NAME })),
      transports: [
        new winston.transports.Console({ // コンソールへ出力する
          format: format.combine(
            format.colorize({ all: true }),
            format.printf(
              ({ level, timestamp, label, message, category, ...rest }) =>
                `${timestamp} ${level} [${label}] ${category || ''}: ${message.trimEnd()} ${JSON.stringify(rest)}`
            )
          )
        })
      ]
    })
  }
}

export const logger = new Logger().logger
