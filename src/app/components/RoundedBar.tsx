/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

interface RoundedBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

const RoundedBar = (props: RoundedBarProps) => {
  const { fill, x, y, width, height } = props;
  const radius = 10; // Radius for the top corners

  // Path for a rectangle with rounded top-left and top-right corners
  const path = `
    M${x},${y + height}
    L${x},${y + radius}
    Q${x},${y} ${x + radius},${y}
    L${x + width - radius},${y}
    Q${x + width},${y} ${x + width},${y + radius}
    L${x + width},${y + height}
    Z
  `;

  return <path d={path} fill={fill} />;
};

export default RoundedBar;
