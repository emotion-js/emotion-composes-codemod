const postcss = require('postcss')
const _ = require('lodash/fp')

const tagTypes = {
  Identifier: node => node,
  CallExpression: node => node.callee,
  MemberExpression: node => node.object
}

const importSpecifiers = ['ImportDefaultSpecifier', 'ImportSpecifier']

module.exports = (file, api) => {
  const j = api.jscodeshift
  const ast = j(file.source)

  const templateElement = _.curry((tail, raw) =>
    j.templateElement({ cooked: JSON.stringify(raw).slice(1, -1), raw }, tail)
  )

  ast.find(j.TemplateLiteral).forEach(path => {
    if (path.parentPath.node.type === 'JSXExpressionContainer') {
      if (path.parentPath.parentPath.node.name.name !== 'css') {
        return
      }
    } else if (path.parentPath.node.type === 'TaggedTemplateExpression') {
      const { tag } = path.parentPath.node
      // Get the identifier for styled in either styled.View`...` or styled(View)`...`
      // Note we aren't checking the name of the callee
      const callee = tagTypes[tag.type](tag)
      if (callee.type !== 'Identifier') return

      // Find the import statement for the `styled` part
      const importSpecifier = _.get(
        [callee.name, 0, 'parentPath'],
        path.scope.getBindings()
      )
      if (
        !_.includes(_.get(['value', 'type'], importSpecifier), importSpecifiers)
      )
        return
      const importDeclaration = importSpecifier.parentPath
      const source = importDeclaration.node.source.value
      // And make sure it's only for emotion
      if (source.indexOf('emotion') === -1) return

      if (!(tag.type in tagTypes)) return
    } else {
      return
    }

    const { quasis, expressions } = path.node
    // Substitute all ${interpolations} with arbitrary test that we can find later
    // This is so we can shove it in postCSS
    const substitutionNames = expressions.map(
      (value, index) => `@lol${index}lol`
    )
    const cssText =
      quasis[0].value.cooked +
      substitutionNames
        .map((name, index) => name + quasis[index + 1].value.cooked)
        .join('')
    const substitutionMap = _.fromPairs(_.zip(substitutionNames, expressions))
    // Transform all simple values
    const root = postcss.parse(cssText)
    let hasComposes = false
    root.walkDecls(decl => {
      if (decl.prop === 'composes') {
        hasComposes = true
        decl.replaceWith.apply(
          decl,
          decl.value
            .split('@')
            .map(thing => '@' + thing.trim())
            .filter(thing => thing !== '@')
        )
      }
    })
    if (hasComposes === false) return
    const nextCssText = '\n  ' + root.toString()

    const substititionNames = Object.keys(substitutionMap)
    const substitionNamesRegExp = new RegExp(
      `(${substititionNames.join('|')})`,
      'g'
    )

    // Create new template literal using transformed CSS and previous expressions
    const allValues = !_.isEmpty(substitutionMap)
      ? _.chunk(2, nextCssText.split(substitionNamesRegExp))
      : [[nextCssText]]
    const quasiValues = _.map(0, allValues)
    const expressionValues = _.dropLast(1, _.map(1, allValues))

    const newQuasis = [].concat(
      _.map(templateElement(false), _.initial(quasiValues)),
      templateElement(true, _.last(quasiValues))
    )
    const newExpressions = _.map(
      _.propertyOf(substitutionMap),
      expressionValues
    )
    const newQuasi = j.templateLiteral(newQuasis, newExpressions)

    // Drop in the new tagged template expression
    j(path).replaceWith(newQuasi)
  })

  return ast.toSource()
}
