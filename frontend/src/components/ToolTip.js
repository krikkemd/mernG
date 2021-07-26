import React from 'react';
import { Popup } from 'semantic-ui-react';

const style = {
  borderRadius: 0,
  opacity: 0.7,
  padding: '2em',
};

const ToolTip = props => {
  console.log(props);
  return <Popup inverted content={props.content} trigger={props.children} />;
};

export default ToolTip;
