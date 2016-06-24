
var rule = require('../../../lib/rules/taboo-members'),

RuleTester = require('eslint').RuleTester;

var options = ['foo', 'bar']

var parserOptions = {ecmaVersion: 6};

var ruleTester = new RuleTester();
ruleTester.run('taboo-members', rule, {
  valid: [
    `
      var foo = qux;
    `,
    `
      bar = "foo";
    `,
    `
      x['bar'] = foo;
    `
  ].map(function (code) {
    return {code, options, parserOptions};
  }),

  invalid: [
    {
      code: `
        x = this.foo;
      `,
      errors: [{
        message: '"foo" is a taboo member name',
      }]
    },
    {
      code: `
        x.foo = y.bar;
      `,
      errors: [{
        message: '"foo" is a taboo member name',
      }, {
        message: '"bar" is a taboo member name',
      }]
    },
    {
      code: `
        foo.bar();
      `,
      errors: [{
        message: '"bar" is a taboo member name',
      }]
    },
    {
      code: `
        this.foo.bar.baz.qux['bar'].foo = bar()
      `,
      errors: [{
        message: '"foo" is a taboo member name',
      }, {
        message: '"bar" is a taboo member name',
      }, {
        message: '"foo" is a taboo member name',
      }]
    },
  ].map(function (test) {
    return Object.assign(test, {options, parserOptions});
  })
});
