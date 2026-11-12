import { motion, useReducedMotion } from 'motion/react';

export function App() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="page">
      <header className="masthead">
        <a className="wordmark" href="/" aria-label="Vivaio home">
          vivaio<span aria-hidden="true">.</span>
        </a>
        <span className="edition">A beginning</span>
      </header>
      <main>
        <motion.section
          className="welcome"
          aria-labelledby="welcome-title"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeOut' }}
        >
          <span className="seed" aria-hidden="true">
            <span />
            <span />
          </span>
          <p className="eyebrow">Ideas take root here</p>
          <h1 id="welcome-title">
            A little room
            <br />
            to grow.
          </h1>
          <p className="intro">
            Something new is taking shape.
            <br />
            Welcome to Vivaio.
          </p>
        </motion.section>
      </main>
      <footer>
        <span>Vivaio</span>
        <span>Made for what comes next.</span>
      </footer>
    </div>
  );
}
