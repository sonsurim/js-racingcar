import {
  RACING_CAR_LIST,
  RACE_ERROR_MESSAGE
} from '../src/constants/racingCarList'
import { GAME_ERROR_MESSAGE } from '../src/constants/racingCarGame'
import { RacingCarGame } from '../src/App'
import * as number from '../src/utils/number'

const mockRunOnlyFirstCar = () => {
  let runCount = 0

  jest
    .spyOn(number, 'getRandomNumber')
    .mockImplementation(() => (runCount++ % 3 === 0 ? 5 : 0))
}

describe('RacingCarGame - Feature', () => {
  let logSpy
  const carNames = 'sonny, son, son2'

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('게임에서 sonny가 가장 많이 앞서나갔을 경우, 게임이 완료되었을 때 sonny가 우승했는지 알려준다.', async () => {
    // Given
    jest.spyOn(number, 'getRandomNumber').mockImplementation(() => 5)
    const racingCarGame = new RacingCarGame()

    // When
    racingCarGame.start(carNames)

    // Then
    expect(logSpy.mock.calls.at(-1)[0]).toBe(
      `\n${carNames}가 최종 우승했습니다.`
    )
  })

  test('게임에서 sonny가 가장 많이 앞서나갔을 경우, 게임이 완료되었을 때 sonny가 우승했는지 알려준다.', () => {
    // Given
    mockRunOnlyFirstCar()
    const racingCarGame = new RacingCarGame()

    // When
    racingCarGame.start(carNames)

    // Then
    expect(logSpy.mock.calls.at(-1)[0]).toEqual('\nsonny가 최종 우승했습니다.')
  })
})

describe('RacingCarGame - Error', () => {
  let logSpy

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('사용자가 잘못된 입력 값을 작성한 경우, "오류로 인해 게임이 종료되었습니다!"라는 에러 메시지 출력과 함께 프로그램을 종료한다.', async () => {
    // Given
    const racingCarGame = new RacingCarGame()

    // When
    racingCarGame.start(null)

    //Then
    expect(logSpy.mock.calls.at(-1)[0]).toBe(
      GAME_ERROR_MESSAGE.GAME_TERMINATE_OF_ERROR
    )
  })

  test('사용자가 자동차 이름을 1개만 입력했을 경우, "오류로 인해 게임이 종료되었습니다!"라는 에러 메시지 출력과 함께 프로그램을 종료한다.', () => {
    // Given
    const inValidCarNames = 'sonny'
    const racingCarGame = new RacingCarGame()

    // When
    racingCarGame.start(inValidCarNames)

    //Then
    expect(logSpy.mock.calls.at(0)[0]).toBe(
      RACE_ERROR_MESSAGE.LACK_PARTICIPANTS(
        RACING_CAR_LIST.MIN_PARTICIPANTS_LENGTH
      )
    )
    expect(logSpy.mock.calls.at(-1)[0]).toBe(
      GAME_ERROR_MESSAGE.GAME_TERMINATE_OF_ERROR
    )
  })

  test('게임에 참여한 자동차 중에 중복된 이름이 있는 경우, 에러가 발생한다.', () => {
    // Given
    const duplicatedCarNames = 'sonny, sonny'
    const racingCarGame = new RacingCarGame()

    // When
    racingCarGame.start(duplicatedCarNames)

    //Then
    expect(logSpy.mock.calls.at(0)[0]).toBe(RACE_ERROR_MESSAGE.DUPLICATED_NAMES)
    expect(logSpy.mock.calls.at(-1)[0]).toBe(
      GAME_ERROR_MESSAGE.GAME_TERMINATE_OF_ERROR
    )
  })
})