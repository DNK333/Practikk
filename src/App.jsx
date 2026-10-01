import { useState } from 'react'

const initialState = {
  energy: 3,
  hasKey: false,
  gameStarted: false,
  gameOver: false,
  searches: 0,
  hasEscaped: false,
}

function App() {
  const [state, setState] = useState(initialState)

  function startGame() {
    setState({ ...initialState, gameStarted: true })
  }

  function searchForKey() {
    if (!state.gameStarted || state.gameOver) return

    if (state.energy <= 1) {
      setState({ ...state, energy: 0, gameOver: true })
      return
    }

    const searches = state.searches + 1
    setState({
      ...state,
      energy: state.energy - 1,
      searches,
      hasKey: searches >= 2,
    })
  }

  function rest() {
    if (!state.gameStarted || state.gameOver) return
    setState({ ...state, energy: state.energy + 1 })
  }

  function openDoor() {
    if (!state.gameStarted || state.gameOver || !state.hasKey) return
    setState({ ...state, gameOver: true, hasEscaped: true })
  }

  const status = !state.gameStarted
    ? 'Ночь. Дверь заперта.'
    : state.gameOver
      ? state.hasEscaped
        ? 'Вы сбежали!'
        : 'Вы проиграли'
      : state.hasKey
        ? 'Вы нашли ключ!'
        : 'Ключа пока не видно.'

  return (
    <main className="game-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Побег из комнаты">
          <span className="wordmark-mark">П</span>
          <span>КОМНАТА 03</span>
        </a>
        <div className="topbar-note"><span className="live-dot" /> ЗАПЕРТО ИЗНУТРИ</div>
      </header>

      <section className="game" id="top" aria-labelledby="game-title">
        <div className="intro">
          <p className="eyebrow">КВЕСТ · ОДНА КОМНАТА · ОДИН ВЫХОД</p>
          <h1 id="game-title">Побег <em>из комнаты</em></h1>
          <p className="story">Старая лампа мерцает. За дверью тихо. У тебя есть немного сил, чтобы выбраться.</p>
        </div>

        <div className={`room ${state.gameStarted ? 'room-active' : ''} ${state.hasEscaped ? 'room-escaped' : ''}`}>
          <div className="room-light" />
          <div className="window-frame" aria-hidden="true"><span /></div>
          <div className="wall-clock" aria-hidden="true"><span /></div>
          <div className="room-caption"><span>01:17 AM</span><span>ТИШИНА</span></div>
          <div className="door" aria-hidden="true">
            <div className="door-inset" />
            <span className="door-handle" />
            {state.hasKey && !state.hasEscaped && <span className="keyhole-glow" />}
          </div>
          <div className="side-table" aria-hidden="true"><span className="lamp-shade" /><span className="lamp-stem" /></div>
          <div className="floor-line" />
        </div>

        <div className="status-row" aria-live="polite">
          <div className={`status-mark ${state.gameOver ? (state.hasEscaped ? 'status-win' : 'status-loss') : ''}`}>
            {state.hasEscaped ? '✦' : state.gameOver ? '×' : state.hasKey ? '⌑' : '·'}
          </div>
          <div className="status-copy">
            <span className="status-label">ТЕКУЩИЙ СТАТУС</span>
            <strong>{status}</strong>
          </div>
          <div className="energy-meter" aria-label={`Энергия: ${state.energy}`}>
            <span className="energy-label">ЭНЕРГИЯ</span>
            <div className="energy-pips">
              {[0, 1, 2].map((pip) => (
                <span key={pip} className={pip < state.energy ? 'pip pip-on' : 'pip'} />
              ))}
              {state.energy > 3 && <span className="energy-extra">+{state.energy - 3}</span>}
            </div>
          </div>
        </div>

        {!state.gameStarted ? (
          <div className="action-area action-start">
            <button className="button button-primary" onClick={startGame}>Начать игру <span>↗</span></button>
          </div>
        ) : state.gameOver ? (
          <div className="action-area action-finished">
            <button className="button button-primary" onClick={startGame}>Начать заново <span>↻</span></button>
          </div>
        ) : (
          <div className="action-area">
            <button className="button button-action" onClick={searchForKey}>
              <span className="button-icon">⌕</span><span>Искать ключ</span><small>−1 энергия</small>
            </button>
            <button className="button button-action" onClick={openDoor} disabled={!state.hasKey}>
              <span className="button-icon">↗</span><span>Открыть дверь</span><small>{state.hasKey ? 'ключ найден' : 'нужен ключ'}</small>
            </button>
            <button className="button button-action" onClick={rest}>
              <span className="button-icon">☾</span><span>Отдохнуть</span><small>+1 энергия</small>
            </button>
          </div>
        )}

        {state.gameStarted && !state.gameOver && (
          <div className="inventory-row">
            <span>НАЙДЕНО</span>
            <span className={state.hasKey ? 'inventory-item inventory-found' : 'inventory-item'}>
              <span className="inventory-icon">⌑</span> Старый ключ
              <b>{state.hasKey ? 'ЕСТЬ' : '—'}</b>
            </span>
          </div>
        )}
      </section>

      <footer className="footer"><span>ПРАКТИЧЕСКАЯ РАБОТА</span><span>ДЗАНГИЕВ МАГАМЕД ВАХАЕВИЧ</span></footer>
    </main>
  )
}

export default App