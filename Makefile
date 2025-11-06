NPM = npm
CODE = code

vscode: .always
	cd vscode && $(NPM) run install:all
	cd vscode && $(NPM) run build
	cd vscode && $(NPM) run lint
	cd vscode && $(NPM) test

vscode-open: .always
	$(CODE) --extensionDevelopmentPath="$(PWD)/vscode"

webview: .always
	cd webview && $(NPM) ci
	cd webview && $(NPM) run lint
	cd webview && $(NPM) run build

.always:
