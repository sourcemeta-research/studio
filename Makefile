NPM = npm

vscode: .always
	cd vscode && $(NPM) run install:all
	cd vscode && $(NPM) run build
	cd vscode && $(NPM) run lint
	cd vscode && $(NPM) test

.always:
