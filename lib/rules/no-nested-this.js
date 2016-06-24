var defaultOptions = {
  allowedGrandparents: [],
  allowedThisFunctions: [],
  allowedConstructors: [],
};

module.exports = function(context) {
  var options = Object.assign({}, defaultOptions, context.options[0]);

  var allowedGrandparents = options.allowedGrandparents;
  var allowedNames = options.allowedThisFunctions;
  var allowedConstructors = options.allowedConstructors

  var report = context.report.bind(context);

  var contains = function (haystack, needle) {
    return haystack.some(function (val) {
      return val === needle;
    });
  }

  var nodeIsFunction = function (node) {
    return contains(['FunctionExpression', 'FunctionDeclaration'], node.type);
  }


  var nearestFunctionParent = function (node) {
    return findAncestor(node, nodeIsFunction);
  }

  var calleeNameForArgument = function (argumentNode) {
    var callAncestor = findAncestor(argumentNode, function (node) {
      if (nodeIsFunction(node)) return 'abort';
      return node.type === 'CallExpression';
    })

    if (!callAncestor) return null;

    return calleeNameForCall(callAncestor);
  }

  var calleeNameForCall = function (callNode) {
    if (!callNode) return null;

    var callee = callNode.callee;
    if (!callee) return null;

    while (callee.property) {
      callee = callee.property;
    }
    return callee.name;
  }

  // Traverse up the tree from node until test returns true for the node, and
  // return that node.
  //
  // test may return a boolean, or 'abort' if the search can immediately stop
  // (in which case undefined will be returned)
  //
  // If no matching node is found, returns undefined;
  var findAncestor = function (node, test) {
    node = node.parent;
    while (node) {
      var testResult = test(node);
      if (testResult === 'abort') return;

      if (testResult) return node;
      node = node.parent;
    }
  }

  var isBoundFunction = function (node) {
    if (node.type !== 'FunctionExpression') return false;
    var bindAncestor = findAncestor(node, function (ancestor) {
      if (nodeIsFunction(ancestor)) return 'abort';

      if (ancestor.type !== 'MemberExpression') return false;
      return ancestor.property && ancestor.property.name === 'bind';
    })

    return bindAncestor != null;
  }

  var hasAllowedConstructor = function (node) {
    var functionCount = 0;
    var constructorNode = findAncestor(node, function (ancestor) {
      if (nodeIsFunction(ancestor)) functionCount += 1;
      if (functionCount > 1) return 'abort';
      return ancestor.type === 'NewExpression';
    })

    var name = calleeNameForCall(constructorNode);
    return contains(allowedConstructors, name);
  }

  return {
    ThisExpression: function (node) {
      var parentFnNode = nearestFunctionParent(node);

      if (!parentFnNode) {
        report(node, '"this used outside of function');
        return;
      }

      var grandparentFnNode = nearestFunctionParent(parentFnNode);
      if (!grandparentFnNode) return; // always fine in a top level function

      var grandparentCalleeName = calleeNameForArgument(grandparentFnNode);
      if (contains(allowedGrandparents, grandparentCalleeName)) return;

      var parent = node.parent;

      // Allow in variable declaratins
      if (parent.type === 'VariableDeclarator') return;

      // Allowed if function is bound
      if (isBoundFunction(parentFnNode)) return;

      // Allowed if argument of function with allowed name
      var calleeName = calleeNameForArgument(parentFnNode);
      if (contains(allowedNames, calleeName)) return;

      // Allowed if in an allowed constructor
      if (hasAllowedConstructor(node)) return;
      report(node, '"this" not allowed in nested function. Use "me" to suppress this error.');
    }
  }
};
