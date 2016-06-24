module.exports = function(context) {
  return {
    ThrowStatement: function (node) {
      if (node.argument.type === 'Literal') {
        context.report(node, 'Bare throw (without new Error) not allowed');
      }
    },
  };
};
