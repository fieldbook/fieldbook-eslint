module.exports = function(context) {
	var code = context.getSourceCode();
	var comments = code.getAllComments();
	var ignoredLines = new Set();

	var suppressionComments = new Set([
		'unsafe moment: allow', // this is the suppression comment you should use
		'jscs: unsafe moment', // legacy suppression comment
	])

	comments.forEach(function (comment) {
		if (comment.type !== 'Line') return;
		var commentText = comment.value.trim();
		if (!suppressionComments.has(commentText)) return;
		var line = comment.loc.start.line;
		ignoredLines.add(line);
	})

	var hasSuppressionComment = function (node) {
		var line = node.loc.start.line;
		return ignoredLines.has(line);
	}

	return {
		CallExpression: function (node) {
			if (node.callee.name !== 'moment') return;
			if (node.parent.type === 'MemberExpression') return;
			if (node.arguments.length === 0) return;
			if (hasSuppressionComment(node)) return;
			context.report(node, "use moment.from(date) instead of moment(date)");
		}
	};
};
