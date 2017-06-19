module.exports = function(context) {
  return {
    TemplateElement: function (node) {
      const match = node.value.raw.match(/\$([[(])/)
      if (match == null) return;
      context.report(node, `You probably meant to type "\${..." instead of "$${match[1]}..."; use \\ before "${match[1]}" to ignore")`);
    }
  };
};
