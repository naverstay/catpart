import React from 'react';
import ContentLoader from 'react-content-loader';

const SkeletonWide = props => {
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
    <ContentLoader speed={2} width={1170} height={1010} viewBox="0 0 1170 1010" backgroundColor="#f3f3f3" foregroundColor="#ecebeb" {...props}>
      <rect id="Прямоугольник_1125" data-name="Прямоугольник 1125" className="cls-18" width="288" height="20" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия" data-name="Прямоугольник 1125 копия" className="cls-18" y="30" width="222" height="30" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_2" data-name="Прямоугольник 1125 копия 2" className="cls-18" x="232" y="30" width="111" height="30" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_4" data-name="Прямоугольник 1125 копия 4" className="cls-18" x="900" y="30" width="84" height="30" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_5" data-name="Прямоугольник 1125 копия 5" className="cls-18" x="993" y="30" width="84" height="30" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_6" data-name="Прямоугольник 1125 копия 6" className="cls-18" x="1086" y="30" width="84" height="30" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_3" data-name="Прямоугольник 1125 копия 3" className="cls-18" y="80" width="1170" height="50" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_7" data-name="Прямоугольник 1125 копия 7" className="cls-18" y="140" width="1170" height="100" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_8" data-name="Прямоугольник 1125 копия 8" className="cls-18" y="250" width="1170" height="100" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_9" data-name="Прямоугольник 1125 копия 9" className="cls-18" y="360" width="1170" height="100" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_10" data-name="Прямоугольник 1125 копия 10" className="cls-18" y="470" width="1170" height="100" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_11" data-name="Прямоугольник 1125 копия 11" className="cls-18" y="580" width="1170" height="100" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_11-2" data-name="Прямоугольник 1125 копия 11" className="cls-18" y="690" width="1170" height="100" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_11-3" data-name="Прямоугольник 1125 копия 11" className="cls-18" y="800" width="1170" height="100" rx="5" ry="5" />
      <rect id="Прямоугольник_1125_копия_11-4" data-name="Прямоугольник 1125 копия 11" className="cls-18" y="910" width="1170" height="100" rx="5" ry="5" />

      {/* {rowCount.map(row => {
        let prevX = 0;

        return rect.map((r, ri) => {
          let ret = <rect key={ri + (row + 1) + ''} x={prevX + gap * 2} y={15 + 55 * row} rx="5" ry="5" width={r} height="20" />;

          prevX += rect[ri] + gap;

          return ret;
        });
      })}*/}
    </ContentLoader>
  );
};

SkeletonWide.metadata = {
  name: '__REPLACE_ME__', // My name
  github: '__REPLACE_ME__', // Github username
  description: '__REPLACE_ME__', // Little tagline
  filename: '__REPLACE_ME__', // filename of your loader
};

export default SkeletonWide;