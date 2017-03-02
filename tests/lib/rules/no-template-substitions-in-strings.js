var rule = require("../../../lib/rules/no-template-substitions-in-strings"),

RuleTester = require("eslint").RuleTester;

const makeError = function (code) {
  return {
    code: code,
    errors: [{
      message: 'Do not include ${} in string literals (do you mean to have a template string with ``?)',
    }]};
}

var ruleTester = new RuleTester({parserOptions: {ecmaVersion: '2017'}});
ruleTester.run("no-template-substitions-in-strings", rule, {

  valid: [
    '"foo"',
    "'foo'",
    "2",
    "bar('foo')",
    "var str = `${foo}`",
    "bar(`${foo}`)",
    `var hash = {foo: 2};`,
    `var hash = {"foo": 2};`,
    `var hash = {'foo': 2};`,
  ],

  invalid: [
    makeError('"${bar}"'),
    makeError("'${bar}'"),
    makeError('bar("${foo}")'),
    makeError('var h = {"${foo}": 2}'),
  ]
});
