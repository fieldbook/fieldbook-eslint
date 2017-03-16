var us = require('underscore');

module.exports = function(context) {
  var identifierRegexes = context.options.map(function (str) {
    return new RegExp(str);
  });

  return {
    Identifier: function (node) {
      var name = node.name;
      var found = us.find(identifierRegexes, function (regex) {
        return regex.test(name);
      })

      if (!found) return;

      let parent = node.parent;
      while (parent) {
        if (parent.type === 'FunctionExpression') {
          if (parent.generator) {
            context.report(node, `Cannot use selenium promises in async / generateor method`);
            return;
          }
        }
        parent = parent.parent;
      }
    }
  };
};
