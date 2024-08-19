// src/declarations.d.ts

declare module 'react-native-svg-circular-progress' {
    import React from 'react';
    import { ViewProps } from 'react-native';
    import { SvgProps } from 'react-native-svg';

    export interface CircleProps extends SvgProps {
        size: number;
        progress: number;
        strokeWidth?: number;
        color?: string;
        backgroundColor?: string;
        children?: () => React.ReactNode;
    }

    export const Circle: React.FC<CircleProps>;
}
