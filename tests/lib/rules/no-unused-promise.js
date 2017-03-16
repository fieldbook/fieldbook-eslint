const rule = require('../../../lib/rules/no-unused-promise');
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({parserOptions: {ecmaVersion: '2017'}});

const options = [
  '^qsave$',
  '^then$',
  '^fail$',
  '^q[A-Z]',
];

const makeError = function ([code, methodName]) {
  return {
    code,
    options,
    errors: [{
      message: `Promise returned by "${methodName}" call must be handled`,
    }],
  }
}

ruleTester.run('no-unused-promise', rule, {
  valid: [
    'let foo = bar',
    'qsave()',
    'let x = qsave()',
    'let blah = qux.qsave().then(function () { return 5; }).done()',
    `var f = function * () {
      yield foo.bar.qsave();
    }`,
    'let y = model.qsave',
    `var f = function (model) {
      return model.qsave();
    }`,
    `let f = x.qFindBook()`,
  ].map(function (code) {
    return {code, options};
  }),

  invalid: [
    ['foo.qsave()', 'qsave'],

    [`var f = function () {
      makeModel().then(function (model) {
        return model.qsave();
      })
    }`, 'then'],

    ['var f = function * (model) { model.qsave() }', 'qsave'],
    [`x.qFindBook()`, 'qFindBook'],
  ].map(makeError),
})
