// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

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
	
	context.subscriptions.push(vscode.commands.registerCommand('extension.getCodeforcesUserRating', () => {
		vscode.window.showInputBox({
			// password: false,
			ignoreFocusOut: true,
			placeHolder: "CodeForces用户名"
		}).then((msg) => {
			const https = require('https');
			let address = vscode.workspace.getConfiguration().get('vscode-oi.codeforcesAddress');
			
			if (address === undefined) {
				vscode.window.showErrorMessage('CodeForces镜像站地址设置出错。请检查你的设置。');
				return;
			}
			if (msg.length > 24 || msg.length < 3) {
				vscode.window.showErrorMessage('CodeForces用户名长度应在闭区间[3,24]内。');
			}
			if (address[address.length - 1] !== '/') {
				address += '/';
			}
			
			https.get(`${address}api/user.info?handles=${msg}`, (ret) => {
				let data = '';
				ret.on('data', (chunk) => {
					data += chunk;
				});
				
				ret.on('end', () => {
					let json = JSON.parse(data);
					if (json.status === "OK") {
						if (json.result[0].rating === undefined) {
							vscode.window.showInformationMessage(`用户${msg}为unrated。`);
						}
						else {
							vscode.window.showInformationMessage(`${json.result[0].handle}目前为${json.result[0].rank}, ${json.result[0].rating}，最高为${json.result[0].maxRank}, ${json.result[0].maxRating}。`);
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
	}));
	
	// context.subscriptions.push(vscode.commands.registerCommand('extension.getCodeforcesLatestStatus', () => {
	// 	vscode.window.showInputBox({
			
	// 	})
	// }));
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
