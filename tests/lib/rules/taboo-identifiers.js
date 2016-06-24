
var rule = require('../../../lib/rules/taboo-identifiers'),

RuleTester = require('eslint').RuleTester;

var options = ['foo', 'bar']

var parserOptions = {ecmaVersion: 6};

var ruleTester = new RuleTester();
ruleTester.run('taboo-identifiers', rule, {
  valid: [
    `
      var baz = qux;
    `,
    `
      x = "foo";
    `,
    `
      x['bar'] = qux;
    `
  ].map(function (code) {
    return {code, options, parserOptions};
  }),

  invalid: [
    {
      code: `
        x = foo;
      `,
      errors: [{
        message: '"foo" is a taboo identifier',
      }]
    },
    {
      code: `
        x.foo = bar;
      `,
      errors: [{
        message: '"foo" is a taboo identifier',
      }, {
        message: '"bar" is a taboo identifier',
      }]
    },
    {
      code: `
        bar();
      `,
      errors: [{
        message: '"bar" is a taboo identifier',
      }]
    },
    {
      code: `
        bar: x = 1;
      `,
      errors: [{
        message: '"bar" is a taboo identifier',
      }]
    },
    {
      code: `
        this.foo.bar.baz.qux['bar'].foo = bar()
      `,
      errors: [{
        message: '"foo" is a taboo identifier',
      }, {
        message: '"bar" is a taboo identifier',
      }, {
        message: '"foo" is a taboo identifier',
      }, {
        message: '"bar" is a taboo identifier',
      }]
    },
  ].map(function (test) {
    return Object.assign(test, {options, parserOptions});
  })
});
