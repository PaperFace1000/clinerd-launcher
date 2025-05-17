#!/usr/bin/env node

import { program } from 'commander';

program
  .version('0.0.1')
  .description('A CLI application with options');

program
  .option('-m, --mode <mode>', 'Specify the mode to execute (greet, farewell)');

program.parse(process.argv);

const options = program.opts();

if (options.mode === 'greet') {
  console.log('Hello there!');
} else if (options.mode === 'farewell') {
  console.log('Goodbye!');
} else if (options.mode) {
  console.log(`Unknown mode: ${options.mode}`);
} else {
  console.log('Please specify a mode using -m or --mode.');
}
