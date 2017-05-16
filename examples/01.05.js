process.on('exit', (code) => {
  // do one final synchronous call
  // before the node process terminates
  console.log(`About to exit with code ${code}`);
});

process.on('uncaughtException', (err) => {
  // something went unhandled
  // do any clean up and exit anyway
  console.error(err);
  process.exit(1);
});

// keep the event loop busy
process.stdin.resume();

// trigger a TypeError exception
console.dog();