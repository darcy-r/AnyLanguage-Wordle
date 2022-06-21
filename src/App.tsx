import { InformationCircleIcon } from '@heroicons/react/outline'
import { ChartBarIcon } from '@heroicons/react/outline'
import { TranslateIcon } from '@heroicons/react/outline'
import { useState, useEffect } from 'react'
import { Alert } from './components/alerts/Alert'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { AboutModal } from './components/modals/AboutModal'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import { TranslateModal } from './components/modals/TranslateModal'
import { isWordInWordList, isWinningWord, solution } from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from './lib/localStorage'
import { GLOSSES } from './constants/lexicon'

import { CONFIG } from './constants/config'
import ReactGA from 'react-ga'
import '@bcgov/bc-sans/css/BCSans.css'
import './i18n'
import { withTranslation, WithTranslation } from 'react-i18next'

const ALERT_TIME_MS = 10000

const App: React.FC<WithTranslation> = ({ t, i18n }) => {
  const [currentGuess, setCurrentGuess] = useState<Array<string>>([])
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isI18nModalOpen, setIsI18nModalOpen] = useState(false)
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false)
  const [isWordTranslationAlertOpen, setWordTranslationAlertOpen] =
    useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [successAlert, setSuccessAlert] = useState('')
  const [guesses, setGuesses] = useState<string[][]>(() => {
    const loaded = loadGameStateFromLocalStorage()
    if (loaded?.solution !== solution) {
      return []
    }
    const gameWasWon = loaded.guesses
      .map((guess) => guess.join(''))
      .includes(solution)
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (loaded.guesses.length === CONFIG.tries && !gameWasWon) {
      setIsGameLost(true)
    }
    return loaded.guesses
  })
  const TRACKING_ID = CONFIG.googleAnalytics

  if (TRACKING_ID && process.env.NODE_ENV !== 'test') {
    ReactGA.initialize(TRACKING_ID)
    ReactGA.pageview(window.location.pathname)
  }
  const [stats, setStats] = useState(() => loadStats())

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution })
  }, [guesses])

  useEffect(() => {
    if (isGameWon) {
      const WIN_MESSAGES = t('winMessages', { returnObjects: true })
      setSuccessAlert(
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)] +
          ' ' +
          solution +
          ' means ' +
          translateSolution(solution)
      )
      setTimeout(() => {
        setSuccessAlert('')
        setIsStatsModalOpen(true)
      }, ALERT_TIME_MS)
    }
    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, ALERT_TIME_MS)
    }
  }, [isGameWon, isGameLost, t])

  const onChar = (value: string) => {
    if (
      currentGuess.length < CONFIG.wordLength &&
      guesses.length < CONFIG.tries &&
      !isGameWon
    ) {
      let newGuess = currentGuess.concat([value])
      setCurrentGuess(newGuess)
    }
  }

  const onDelete = () => {
    setCurrentGuess(currentGuess.slice(0, -1))
  }

  const checkWord = (word: Array<string>) => {
    let vowels = ['a', 'i', 'u']
    let permitted_finals = ['a', 'i', 'u', 'n', 'l', 'rr', 'y']
    // check if word starts with vowel
    if (vowels.includes(word[0])) {
      return " A garay doesn't start with a vowel."
    } else if (word[0] === 'l') {
      return ' A garay doesn\'t start with "l".'
    } else if (word[0] === 'd' && word[1] !== 'h') {
      return ' A "d" at the start of a garay must be followed by "h".'
    } else if (!permitted_finals.includes(word[4])) {
      return 'A garay ends with vowels "a", "i", "u", or consonants "n", "l", "rr", "y".'
    } else if (word[4] === 'r' && word[3] !== 'r') {
      return ' A garay may end with "rr" but not "r" alone.'
    }
    return ''
  }

  const translateSolution = (word: string) => {
    if (word in GLOSSES) {
      return (
        GLOSSES[word]['gloss'] + ' (' + GLOSSES[word]['part_of_speech'] + ')'
      )
    }
    return ''
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }
    if (!(currentGuess.length === CONFIG.wordLength)) {
      setIsNotEnoughLetters(true)
      return setTimeout(() => {
        setIsNotEnoughLetters(false)
      }, ALERT_TIME_MS)
    }

    if (!isWordInWordList(currentGuess.join(''))) {
      setIsWordNotFoundAlertOpen(true)
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false)
      }, ALERT_TIME_MS)
    }
    const winningWord = isWinningWord(currentGuess.join(''))
    if (!winningWord) {
      // if word is in list, but not the winning word, provide translation
      setWordTranslationAlertOpen(true)
      return setTimeout(() => {
        setWordTranslationAlertOpen(false)
      }, ALERT_TIME_MS)
    }

    if (
      currentGuess.length === CONFIG.wordLength &&
      guesses.length < CONFIG.tries &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess([])

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length))
        return setIsGameWon(true)
      }

      if (guesses.length === CONFIG.tries - 1) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        setIsGameLost(true)
      }
    }
  }
  let translateElement = <div></div>
  if (CONFIG.availableLangs.length > 1) {
    translateElement = (
      <TranslateIcon
        className="h-6 w-6 cursor-pointer"
        onClick={() => setIsI18nModalOpen(true)}
      />
    )
  }

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex w-80 mx-auto items-center mb-8">
        <h1 className="text-xl grow font-bold">
          {t('gameName', { language: CONFIG.language })}
        </h1>
        {translateElement}
        <InformationCircleIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsInfoModalOpen(true)}
        />
        <ChartBarIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() => setIsStatsModalOpen(true)}
        />
      </div>
      <Grid guesses={guesses} currentGuess={currentGuess} />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        guesses={guesses}
      />
      <TranslateModal
        isOpen={isI18nModalOpen}
        handleClose={() => setIsI18nModalOpen(false)}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        handleClose={() => setIsInfoModalOpen(false)}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        handleClose={() => setIsStatsModalOpen(false)}
        guesses={guesses}
        gameStats={stats}
        isGameLost={isGameLost}
        isGameWon={isGameWon}
        handleShare={() => {
          setSuccessAlert(t('gameCopied'))
          return setTimeout(() => setSuccessAlert(''), ALERT_TIME_MS)
        }}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        handleClose={() => setIsAboutModalOpen(false)}
      />

      <button
        type="button"
        className="mx-auto mt-8 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 select-none"
        onClick={() => setIsAboutModalOpen(true)}
      >
        {t('about')}
      </button>

      <Alert message={t('notEnoughLetters')} isOpen={isNotEnoughLetters} />
      <Alert
        message={t('wordNotFound') + checkWord(currentGuess)}
        isOpen={isWordNotFoundAlertOpen}
      />
      <Alert
        message={
          'Good guess! ' +
          currentGuess.join('') +
          ' means ' +
          translateSolution(currentGuess.join(''))
        }
        isOpen={isWordTranslationAlertOpen}
      />
      <Alert
        message={
          t('solution', { solution }) +
          ', meaning ' +
          translateSolution(solution)
        }
        isOpen={isGameLost}
      />
      <Alert
        message={successAlert}
        isOpen={successAlert !== ''}
        variant="success"
      />
    </div>
  )
}

export default withTranslation()(App)
