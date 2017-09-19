# emotion-composes-codemod

Transform composes to random interpolations for emotion 8.

```bash
npm install -g jscodeshift
npm install https://github.com/emotion-js/emotion-composes-codemod
jscodeshift -t emotion-composes-codemod/transforms/composes <path>
```

**Will modify files in place, so make sure you can recover if it goes wrong!**

In

```js
css`
  composes: ${flex};
`
```

Out

```js
css`
  ${flex};
`
```

# Caveats

Random interpolations do not support interpolating regular class names like composes.