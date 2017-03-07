// Disallow certain method names (specified via settings) known to return
// promises from being called without doing something with their result.

module.exports = function(context) {
  var promiseMethodNames = new Set(context.options);
  return {
    CallExpression: function (node) {
      // We only care if the parent of the call expression is an expression statement.
      // Otherwise, we are doing _something_ with the promise.
      if (node.parent.type !== 'ExpressionStatement') return;

      // The rule is only relevant if the callee is a member expression
      if (node.callee.type !== 'MemberExpression') return;

      const property = node.callee.property;

      if (!promiseMethodNames.has(property.name)) return;
      context.report(node, `Promise returned by "${property.name}" call must be handled`);
    }
  };
};
