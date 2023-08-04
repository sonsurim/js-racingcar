import {
  RACING_CAR_LIST,
  RACE_ERROR_MESSAGE
} from '../../constants/racingCarList'
import { Car } from '../Car/Car'
import { RacingCarListValidator } from './RacingCarListValidator'

export class RacingCarList extends RacingCarListValidator {
  #carList
  #match
  #maxMatchLength
  #runCondition
  #onEndRound

  constructor() {
    super()
  }

  init(state) {
    const {
      carNames,
      maxMatchLength = RACING_CAR_LIST.DEFAULT_MAX_MATCH_LENGTH,
      runCondition = RACING_CAR_LIST.DEFAULT_RUN_CONDITION,
      onEndRound = RACING_CAR_LIST.DEFAULT_ON_END_ROUND
    } = state
    this.validate({ carNames, maxMatchLength, onEndRound })

    this.#match = 0
    this.#carList = this.#generateCarListByNames(carNames)
    this.#maxMatchLength = maxMatchLength
    this.#runCondition = runCondition
    this.#onEndRound = onEndRound
  }

  subscribeError(fn) {
    this.subscribe(fn)
  }

  startRound() {
    const isOverMaxMatch = this.#match + 1 > this.#maxMatchLength
    if (isOverMaxMatch) {
      this.notify({
        error: {
          cause: RACING_CAR_LIST.CONSTRUCTOR_NAME,
          message: RACE_ERROR_MESSAGE.OVER_MATCH_MAX_LENGTH
        }
      })
      return
    }

    this.#match++
    this.#runCarList()
    this.#onEndRound(this.#carList)
  }

  getMaxMatchLength() {
    return this.#maxMatchLength
  }

  getCarList() {
    return this.#carList
  }

  getPositionOf(name) {
    const car = this.#carList.find(car => car.getName() === name)
    return car.getPosition()
  }

  getWinners() {
    const highestPosition = Math.max(
      ...this.#carList.map(car => car.getPosition())
    )
    const winners = this.#carList.filter(
      car => car.getPosition() === highestPosition
    )

    return this.#match !== this.#maxMatchLength
      ? []
      : winners.map(winner => winner.getName())
  }

  #runCarList() {
    this.#carList.filter(this.#runCondition).forEach(car => car.run())
  }

  #generateCarListByNames(names) {
    return names.split(',').map(name => {
      const car = new Car()

      car.init({ name: name.trim() })
      car.setPosition(0)
      car.subscribeError(this.#errorTracker.bind(this))

      return car
    })
  }

  #errorTracker(error) {
    this.notify(error)
  }
}