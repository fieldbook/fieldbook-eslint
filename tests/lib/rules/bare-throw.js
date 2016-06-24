var rule = require("../../../lib/rules/bare-throw"),

RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("bare-throw", rule, {

  valid: [
    "throw new Error('blah')",
    "throw foo",
  ],

  invalid: [
    {
      code: "throw 'Foo'",
      errors: [{
        message: 'Bare throw (without new Error) not allowed',
      }]
    }
  ]
});
