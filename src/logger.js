/**
 * logger.js
 * Clean terminal output for the Tech Strategist runner.
 */

const colors = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  cyan:    '\x1b[36m',
  gray:    '\x1b[90m',
  white:   '\x1b[37m',
  lime:    '\x1b[92m',
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;
const ts = () => c('gray', `[${new Date().toLocaleTimeString()}]`);

export const log = {
  info:    (msg) => console.log(`${ts()} ${c('white', msg)}`),
  success: (msg) => console.log(`${ts()} ${c('lime', '✓')} ${c('white', msg)}`),
  error:   (msg) => console.error(`${ts()} ${c('red', '✗')} ${c('red', msg)}`),
  step:    (n, msg) => console.log(`\n${ts()} ${c('cyan', `[${n}]`)} ${c('bold', msg)}`),
  section: (title) => {
    const line = '─'.repeat(52);
    console.log(`\n${c('yellow', line)}`);
    console.log(`${c('yellow', '  ' + title)}`);
    console.log(`${c('yellow', line)}`);
  }
};
