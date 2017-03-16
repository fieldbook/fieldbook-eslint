var rule = require('../../../lib/rules/no-selenium-promise-in-async'),

RuleTester = require('eslint').RuleTester;

var options = ['anotherSelenium'];
var parserOptions = {ecmaVersion: 6};

var ruleTester = new RuleTester({parserOptions});

ruleTester.run('no-selenium-promise-in-async', rule, {
  valid: [
    `test.before(function () {
      page.clickElement();
    })`,
    `test.it(function () {
      page.clickElement();
    })`,
    `test.before(function () {
      bookPage.clickElement();
    })`,
    `test.it(function () {
      bookPage.clickElement();
    })`,
    `test.before(function () {
      site.driver.getCurrentUrl();
    })`,
    `test.it(function () {
      site.driver.getCurrentUrl();
    })`,
    `test.before(function () {
      anotherSelenium;
    })`,
    `test.it(function () {
      anotherSelenium.get();
    })`,
    `let foo = function * () {
      let bar = 2;
      yield bar;
    }.aysnc()`,
    `let foo = function * () {
      let bar = 2;
      yield bar;
    }`,
  ].map(function (code) {
    return {code, options};
  }),

  invalid: [
    `let foo = function * () {
      bookPage.clickElement();
    }.async()`,
    `let foo = function * () {
      page.clickElement();
    }.async()`,
    `let foo = function * () {
      site.driver.getCurrentUrl();
    }.async()`,
    `let foo = function * () {
      bookPage.clickElement();
    }`,
    `let foo = function * () {
      page.clickElement();
    }`,
    `let foo = function * () {
      site.driver.getCurrentUrl();
    }`,
    `let foo = function * () {
      yield bookPage.clickElement();
    }.async()`,
    `let foo = function * () {
      yield page.clickElement();
    }.async()`,
    `let foo = function * () {
      yield site.driver.getCurrentUrl();
    }.async()`,
    `test.before(function * () {
      bookPage.clickElement();
    }.async())`,
    `test.before(function * () {
      page.clickElement();
    }.async())`,
    `test.before(function * () {
      site.driver.getCurrentUrl();
    }.async())`,
    `test.it(function * () {
      bookPage.clickElement();
    }.async())`,
    `test.it(function * () {
      page.clickElement();
    }.async())`,
    `test.it(function * () {
      site.driver.getCurrentUrl();
    }.async())`,
    `test.before(function * () {
      anotherSelenium;
    }.async())`,
    `test.it(function * () {
      anotherSelenium.get();
    }.async())`,
  ].map(function (code) {
    return {code, options, errors: [{message: 'Cannot use selenium promises in async / generateor method'}]}
  })
});
