/* eslint-disable */

import {css} from 'emotion'
import styled from 'react-emotion'
import other from 'preact-emotion'

// Transforms numbers
// Uses styled.View notation
styled.View`
  composes: ${something} ${otherThing} ${oneMore};
  display: flex;
 `;

// Uses styled(View) notation
styled(View)`
  composes: ${something} ${otherThing} ${oneMore};
  display: flex;
`;

// Does not attach units twice
styled.View`
  composes: ${something}${otherThing}${oneMore};
  display: flex;
`;

// Transforms css
css`
  composes: ${something} ${otherThing} ${oneMore};
  display: flex;
`;

// Does not require 'styled' name
other.View`
  composes: ${something} ${otherThing} ${oneMore};
  display: flex;
`;

<div css={`composes: ${something}; display: flex;`} />

// Doesn't incorrectly scope
function test(styled) {
  styled.View`
    composes: ${something} ${otherThing} ${oneMore};
    display: flex;
  `;
}
