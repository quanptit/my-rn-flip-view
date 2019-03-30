import { Component } from 'react';
import { Animated, ViewProps } from 'react-native';
interface Props extends ViewProps {
    flipDuration?: number;
    flipEasing?: any;
    flipAxis?: 'x' | 'y';
    front?: any;
    back?: any;
    perspective?: number;
    onFlip?: VoidFunction;
    onFlipped?: (isFlipped: boolean) => void;
    isFlipped?: boolean;
}
interface States {
    frontRotationAnimatedValue: any;
    backRotationAnimatedValue: any;
    frontRotation: any;
    backRotation: any;
    isFlipped: boolean;
    opacityFont: any;
    opacityBack: any;
}
export declare class FlipView extends Component<Props, States> {
    static defaultProps: {
        style: {};
        flipDuration: number;
        flipEasing: import("react-native").EasingFunction;
        flipAxis: string;
        perspective: number;
        onFlip: () => void;
        onFlipped: () => void;
        isFlipped: boolean;
    };
    constructor(props: any);
    _getTargetRenderStateFromFlippedValue: (isFlipped: any) => any;
    render(): JSX.Element;
    flip(): void;
    setFlippedValue(isFlipped: boolean): Promise<boolean>;
    _animateValue: (animatedValue: any, toValue: any, easing: any) => Animated.CompositeAnimation;
}
export {};
