console.log(`emotion-composes-codemod cannot be used on its own. Please use the following steps,

npm install -g jscodeshift
npm install https://github.com/emotion-js/emotion-composes-codemod
jscodeshift -t emotion-composes-codemod/transforms/composes <path>
`)
