/* eslint-disable */

import {css} from 'emotion'
import styled from 'react-emotion'
import other from 'preact-emotion'

// Transforms numbers
// Uses styled.View notation
styled.View`
  ${something};
  ${otherThing};
  ${oneMore};
  display: flex;
 `;

// Uses styled(View) notation
styled(View)`
  ${something};
  ${otherThing};
  ${oneMore};
  display: flex;
`;

// Does not attach units twice
styled.View`
  ${something};
  ${otherThing};
  ${oneMore};
  display: flex;
`;

// Transforms css
css`
  ${something};
  ${otherThing};
  ${oneMore};
  display: flex;
`;

// Does not require 'styled' name
other.View`
  ${something};
  ${otherThing};
  ${oneMore};
  display: flex;
`;

<div css={`
  ${something}; display: flex;`} />

// Doesn't incorrectly scope
function test(styled) {
  styled.View`
    composes: ${something} ${otherThing} ${oneMore};
    display: flex;
  `;
}
