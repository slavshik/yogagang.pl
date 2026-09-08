import './style.css';

/*
 * The hero animation is opt-in rather than opt-out: without JS the words are
 * simply there, at full opacity, correctly spaced. Adding the class here means
 * the "settle" keyframes can start the words invisible without ever risking a
 * page that renders blank for someone whose JS did not run.
 */
document.documentElement.classList.add('js');
