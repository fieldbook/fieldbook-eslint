var rule = require("../../../lib/rules/no-unsafe-moment"),

RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("no-unsafe-moment", rule, {

  valid: [
    `
      moment(date); // unsafe moment: allow
    `, // suppression comment
    `
      var x = blah ? foo.bar[moment(date)].y.z(function(){ return 7 }) : moment(date); // unsafe moment: allow
    `, // complex expression with suppression comment
    `
      moment(date); // jscs: unsafe moment
    `, // legacy suppression
    `
      foo.moment(date);
    ` // member expression
  ],

  invalid: [
    {
      code: "moment(date)",
      errors: [{
        message: "use moment.from(date) instead of moment(date)",
      }]
    }, {
      code: "var x = moment(date)",
      errors: [{
        message: "use moment.from(date) instead of moment(date)",
      }]
    }, {
      code: "foo(moment(date))",
      errors: [{
        message: "use moment.from(date) instead of moment(date)",
      }]
    }, { // complex expression with no suppression comment
      code: "var x = blah ? foo.bar[moment(date)].y.z(function(){ return 7 }) : moment(date);",
      errors: [{
        message: "use moment.from(date) instead of moment(date)",
      }]
    }
  ]
});
