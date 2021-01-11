module.exports = {
	// Use root level ESlint configuration.
	// JavaScript files inside this folder are meant to be transpiled by Webpack.
	root: true,
	extends: [ '../../.eslintrc.js' ],
	rules: {
		// Unnecessary rule due to Preact + Babel. See https://preactjs.com/guide/v8/getting-started/#global-pragma
		'react/react-in-jsx-scope': 0,
		// Preact.h() must be imported and be available for Babel to transform JSX.
		'no-unused-vars': [ 2, { varsIgnorePattern: '^h$' } ],
	},
};
