import React, { useState } from 'react';

const ReadMore = ({ children, component: Component }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return Component ? (
    <Component>
      {isReadMore ? text.slice(0, 350) : text}
      <span onClick={toggleReadMore} style={{ color: 'blue', cursor: 'pointer' }}>
        {isReadMore ? '...read more' : ' show less'}
      </span>
    </Component>
  ) : (
    <p>
      {isReadMore ? text.slice(0, 350) : text}
      <span onClick={toggleReadMore} style={{ color: 'blue', cursor: 'pointer' }}>
        {isReadMore ? '...read more' : ' show less'}
      </span>
    </p>
  );
};

export default ReadMore;
