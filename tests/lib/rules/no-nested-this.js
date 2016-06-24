
var rule = require('../../../lib/rules/no-nested-this'),

RuleTester = require('eslint').RuleTester;

var options = [{
  allowedThisFunctions: ['allowedThisFunc'],
  allowedGrandparents: ['allowedGrandparent'],
  allowedConstructors: ['AllowedConstructor'],
}]

var parserOptions = {ecmaVersion: 6};

var ruleTester = new RuleTester();
ruleTester.run('no-nested-this', rule, {
  valid: [
    `
      var f = function () {}
    `, // simple case with no this
    `
      function foo(x) {
        if (x) {
          return function () {
            var self = this;
            self.x = x;
          }
        }
      }
    `, // this as var declarator
    `
      var Foo;

      Foo.Bar.allowedGrandparent(function (zip) {
        return {
          method: function () {
            this.method();
          }
        }
      })
    `, // this in allowed grandparent
    `
      function foo(x) {
        return x.bar(function () {
          return this;
        }.bind(this));
      }
    `, // bound function
    `
      function allowedThisFunc() {}

      function foo(x) {
        allowedThisFunc(function (bar) {
          return this;
        })

        x.allowedThisFunc(function (bar) {
          return this;
        })

        allowedThisFunc(x, function (bar) {
          return this;
        })

        x.allowedThisFunc(x, function (bar) {
          return this;
        })

        x.foo.bar[5 + 3 + x()].allowedThisFunc(x, function (bar) {
          return this;
        })

        x.each(() => {
          return this;
        })

        x.each(() => this);
      }
    `, // allowed functions
    `
      var AllowedConstructor, NotAllowedConstructor;

      var foo = function () {
        var foo = new AllowedConstructor({
          method: function () {
            this.callSomething(); // should not error because of allowedConstructors
          },
        })
      }
    `, // allowed constructor
  ].map(function (code) {
    return {code, options, parserOptions};
  }),

  invalid: [
    {
      code: `
        var x = 1;
        this.set(x);
      `,
      errors: [{
        message: '"this used outside of function',
      }]
    }, {
      code: `
        var foo = function (x) {
          this.bar(function () {
            this.blah = true;
          });
        }
      `,
      errors: [{
        message: '"this" not allowed in nested function. Use "me" to suppress this error.',
      }]
    }, {
      code: `
        function foo(x) {
          return x.bar(function () {
            return function () {
              return this;
            };
          }.bind(this));
        }
      `,
      errors: [{
        message: '"this" not allowed in nested function. Use "me" to suppress this error.',
      }]
    }, {
      code: `
        var AllowedConstructor, NotAllowedConstructor;

        var foo = function () {
          var foo = new AllowedConstructor({
            method: function () {
              this.callSomething(); // should not error because of allowedConstructors
            },

            meth2: function () {
              function foo() {
                this.foo; // this should still error due to the extra level of function
              }
            },
          })

          var bar = new NotAllowedConstructor({
            method: function () {
              this.callSomething(); // this should error due to non-top-level function
            },
          })
        }
      `,
      errors: [{
        message: '"this" not allowed in nested function. Use "me" to suppress this error.',
      }, {
        message: '"this" not allowed in nested function. Use "me" to suppress this error.',
      }]
    },
  ].map(function (test) {
    return Object.assign(test, {options, parserOptions});
  })
});
