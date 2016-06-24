module.exports = function(context) {
  var tabooSet = new Set(context.options);
  return {
    Identifier: function (node) {
      if (!tabooSet.has(node.name)) return;
      context.report(node, `"${node.name}" is a taboo identifier`);
    }
  };
};
