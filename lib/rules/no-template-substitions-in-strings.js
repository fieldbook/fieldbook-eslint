module.exports = function(context) {
  return {
    Literal: function (node) {
      const value = node.value;
      if (typeof value === 'string') {
        const index = value.indexOf('${');

        if (index !== -1 && value.indexOf('}') > index) {
          context.report(node, `Do not include \$\{\} in string literals (do you mean to have a template string with \`\`?)`);
        }
      }
    }
  };
};
