import React from 'react';
import ContentLoader from 'react-content-loader';

const Skeleton = props => {
  const offsetX = 10;
  const startY = 20;
  const offsetY = 20;

  const gap = 10;
  const rect = [120, 160, 130, 70, 65, 45, 60, 75, 135, 75, 100];

  let rowCount = [];

  for (let i = 0; i < 10; i++) {
    rowCount.push(i);
  }

  return (
    <ContentLoader speed={2} width={1170} height={500} viewBox="0 0 1170 500" backgroundColor="#f3f3f3" foregroundColor="#ecebeb" {...props}>
      {rowCount.map(row => {
        let prevX = 0;

        return rect.map((r, ri) => {
          let ret = <rect key={ri + (row + 1) + ''} x={prevX + gap * 2} y={15 + 55 * row} rx="5" ry="5" width={r} height="20" />;

          prevX += rect[ri] + gap;

          return ret;
        });
      })}
    </ContentLoader>
  );
};

Skeleton.metadata = {
  name: '__REPLACE_ME__', // My name
  github: '__REPLACE_ME__', // Github username
  description: '__REPLACE_ME__', // Little tagline
  filename: '__REPLACE_ME__', // filename of your loader
};

export default Skeleton;
