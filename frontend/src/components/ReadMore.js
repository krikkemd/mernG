import React, { useState } from 'react';

/**
 * @param {string} children - the text to be put out
 * @param {React.FC=} Component - the react component that holds the text
 * @param {Number} maxTextLength - the max length of the text before it should should "...read more"
 * @returns {HTMLElement} - an HTML element that holds the text that was put in
 */

const ReadMore = ({ children, component: Component, maxTextLength }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  if (text.length < maxTextLength && Component) return <Component>{text}</Component>;
  if (text.length < maxTextLength && !Component) return <p>{text}</p>;

  return Component ? (
    <Component>
      {isReadMore ? text.slice(0, maxTextLength) : text}
      <span onClick={toggleReadMore} style={{ color: 'blue', cursor: 'pointer' }}>
        {isReadMore ? '...read more' : ' show less'}
      </span>
    </Component>
  ) : (
    <p>
      {isReadMore ? text.slice(0, maxTextLength) : text}
      <span onClick={toggleReadMore} style={{ color: 'blue', cursor: 'pointer' }}>
        {isReadMore ? '...read more' : ' show less'}
      </span>
    </p>
  );
};

export default ReadMore;
