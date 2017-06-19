var rule = require("../../../lib/rules/no-wrong-template-braces"),

RuleTester = require("eslint").RuleTester;

const makeError = function (code, brace) {
  return {
    code: code,
    errors: [{
      message: `You probably meant to type "\${..." instead of "$${brace}..."; use \\ before "${brace}" to ignore")`,
    }]};
}

var ruleTester = new RuleTester({parserOptions: {ecmaVersion: '2017'}});
ruleTester.run("no-wrong-template-braces", rule, {

  valid: [
    '`foo ${1 + 2}`',
    '`foo $\\(bar)`',
    '`$\\[qux]`',
  ],

  invalid: [
    makeError('`$[bar]`', '['),
    makeError("`$(bar)`", '('),
    makeError('`foo $[bar + baz}`', '['),
    makeError("`foo $(bar()}`", '('),
  ]
});
