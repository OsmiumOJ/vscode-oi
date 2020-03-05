// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function codeforcesRatingLevel(rating, capitalize = false) {
	if (rating < 1200) {
		return capitalize ? 'Newbie' : 'newbie';
	}
	if (rating < 1400) {
		return capitalize ? 'Pupil' : 'pupil';
	}
	if (rating < 1600) {
		return capitalize ? 'Specialist' : 'specialist';
	}
	if (rating < 1900) {
		return capitalize ? 'Expert' : 'expert';
	}
	if (rating < 2100) {
		return capitalize ? 'Candidate master' : 'candidate master';
	}
	if (rating < 2300) {
		return capitalize ? 'Master' : 'master';
	}
	if (rating < 2400) {
		return capitalize ? 'International master' : 'international master';
	}
	if (rating < 2600) {
		return capitalize ? 'Grandmaster' : 'grandmaster';
	}
	if (rating < 3000) {
		return capitalize ? 'International grandmaster' : 'international grandmaster';
	}
	return capitalize ? 'Legendary grandmaster' : 'legendary grandmaster';
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-oi" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World!');
	// 	console.log('Can you see me?');
	// });

	// context.subscriptions.push(disposable);
	
	context.subscriptions.push(vscode.commands.registerCommand('extension.sayHelloWorld', function() {
		vscode.window.showInformationMessage("Hello, world!");
	}));
	
	context.subscriptions.push(vscode.commands.registerCommand('extension.getCodeforcesUserCurrentRating', () => {
		vscode.window.showInputBox({
			password: false,
			ignoreFocusOut: true,
			placeHolder: "CodeForces用户名"
		}).then((msg) => {
			const https = require('https');
			https.get(`https://codeforces.ml/api/user.rating?handle=${msg}`, (ret) => {
				let data = '';
				ret.on('data', (chunk) => {
					data += chunk;
				});
				ret.on('end', () => {
					let json = JSON.parse(data);
					if (json.status === "OK") {
						if (json.result.length === 0) {
							vscode.window.showInformationMessage(`用户${msg}并没有参加任何rated的比赛，目前为unrated。`);
						}
						else {
							vscode.window.showInformationMessage(`用户${msg}目前的rating为${json.result[json.result.length - 1].newRating}，等级为${codeforcesRatingLevel(json.result[json.result.length - 1].newRating)}。`);
						}
					}
					else {
						vscode.window.showErrorMessage(`无法找到用户${msg}。`);
					}
				})
			}).on('error', (err) => {
				vscode.window.showErrorMessage(`HTTP请求错误：${err}`);
			})
		})
	}))
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
	console.log('free!');
}

module.exports = {
	activate,
	deactivate
}
