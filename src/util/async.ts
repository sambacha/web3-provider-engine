// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (_err?, _result?) => {};

// Works the same as async.parallel
export function parallel(fns, done: (err?, result?) => void = noop) {
  this.map(fns, (fn, callback) => {
    fn(callback);
  }, done);
}

// Works the same as async.map
export function map(items, iterator, done: (err?, result?) => void = noop) {
  const results = [];
  let failure = false;
  const expected = items.length;
  let actual = 0;
  const createIntermediary = (_index) => {
    return (err, result) => {
      // Return if we found a failure anywhere.
      // We can't stop execution of functions since they've already
      // been fired off; but we can prevent excessive handling of callbacks.
      if (failure !== false) {
        return;
      }

      if (err != null) {
        failure = true;
        done(err, result);
        return;
      }

      actual += 1;

      if (actual === expected) {
        done(null, results);
      }
    };
  };

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    iterator(item, createIntermediary(i));
  }

  if (items.length === 0) {
    done(null, []);
  }
}

// Works like async.eachSeries
export function eachSeries(items, iterator, done: (err?, result?) => void = noop) {
  const results = [];
  const expected = items.length;
  let current = -1;

  function callback(err, result) {
    if (err) {
      return done(err);
    }

    results.push(result);

    if (current === expected) {
      return done(null, results);
    } else {
      next();
    }
  }

  function next() {
    current += 1;
    const item = items[current];
    iterator(item, callback);
  }

  next();
}
