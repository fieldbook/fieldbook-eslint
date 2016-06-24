module.exports = function(context) {
  var tabooSet = new Set(context.options);
  return {
    MemberExpression: function (node) {
      var name = node.property.name;
      if (!tabooSet.has(name)) return;
      context.report(node, `"${name}" is a taboo member name`);
    }
  };
};
