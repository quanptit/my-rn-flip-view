import React, { Component } from 'react';
import { Easing, Animated, StyleSheet, View } from 'react-native';
import { isIOS, sendError } from "my-rn-base-utils";
export class FlipView extends Component {
    constructor(props) {
        super(props);
        // componentWillReceiveProps = (nextProps) => {
        //     if (nextProps.isFlipped !== this.props.isFlipped) {
        //         this.flip();
        //     }
        // };
        this._getTargetRenderStateFromFlippedValue = (isFlipped) => {
            let result = {
                frontRotation: isFlipped ? 0.5 : 0,
                backRotation: isFlipped ? 1 : 0.5
            };
            if (!isIOS()) {
                result.opacityFont = isFlipped ? 0 : 1;
                result.opacityBack = isFlipped ? 1 : 0;
            }
            return result;
        };
        this._animateValue = (animatedValue, toValue, easing) => {
            if (animatedValue == null) {
                sendError("_animateValue animatedValue NULL");
                return null;
            }
            return Animated.timing(animatedValue, {
                toValue: toValue,
                duration: this.props.flipDuration,
                easing: easing
            });
        };
        let targetRenderState = this._getTargetRenderStateFromFlippedValue(props.isFlipped);
        let frontRotationAnimatedValue = new Animated.Value(targetRenderState.frontRotation);
        let backRotationAnimatedValue = new Animated.Value(targetRenderState.backRotation);
        let interpolationConfig = { inputRange: [0, 1], outputRange: ["0deg", "360deg"] };
        let frontRotation = frontRotationAnimatedValue.interpolate(interpolationConfig);
        let backRotation = backRotationAnimatedValue.interpolate(interpolationConfig);
        let opacityFont, opacityBack;
        if (!isIOS()) {
            opacityFont = new Animated.Value(1);
            opacityBack = new Animated.Value(0);
        }
        this.state = {
            frontRotationAnimatedValue: frontRotationAnimatedValue,
            backRotationAnimatedValue: backRotationAnimatedValue,
            frontRotation: frontRotation,
            backRotation: backRotation,
            isFlipped: props.isFlipped,
            opacityFont: opacityFont,
            opacityBack: opacityBack
        };
    }
    render() {
        let rotateProperty = this.props.flipAxis === 'y' ? 'rotateY' : 'rotateX';
        let styleAndroidFont, styleAndroidBack;
        if (!isIOS()) {
            styleAndroidFont = { opacity: this.state.opacityFont };
            styleAndroidBack = { opacity: this.state.opacityBack };
        }
        return (<View {...this.props}>
                <Animated.View pointerEvents={this.state.isFlipped ? 'none' : 'auto'} style={[styles.flippableView, styleAndroidFont, { transform: [{ perspective: this.props.perspective }, { [rotateProperty]: this.state.frontRotation }] }]}>
                    {this.props.front}
                </Animated.View>
                <Animated.View pointerEvents={this.state.isFlipped ? 'auto' : 'none'} style={[styles.flippableView, styleAndroidBack, { transform: [{ perspective: this.props.perspective }, { [rotateProperty]: this.state.backRotation }] }]}>
                    {this.props.back}
                </Animated.View>
            </View>);
    }
    ;
    flip() {
        this.props.onFlip();
        let nextIsFlipped = !this.state.isFlipped;
        this.setFlippedValue(nextIsFlipped);
    }
    ;
    setFlippedValue(isFlipped) {
        if (isFlipped === this.state.isFlipped)
            return null;
        let self = this;
        return new Promise(function (resolve, reject) {
            let { frontRotation, backRotation, opacityFont, opacityBack } = self._getTargetRenderStateFromFlippedValue(isFlipped);
            let anims = [self._animateValue(self.state.frontRotationAnimatedValue, frontRotation, self.props.flipEasing),
                self._animateValue(self.state.backRotationAnimatedValue, backRotation, self.props.flipEasing)];
            if (opacityFont != null) {
                anims.push(self._animateValue(self.state.opacityFont, opacityFont, self.props.flipEasing));
                anims.push(self._animateValue(self.state.opacityBack, opacityBack, self.props.flipEasing));
            }
            setImmediate(() => {
                requestAnimationFrame(() => {
                    Animated.parallel(anims).start(k => {
                        if (!k.finished) {
                            resolve(false);
                            return;
                        }
                        self.setState({ isFlipped: isFlipped });
                        self.props.onFlipped(isFlipped);
                        resolve(true);
                    });
                });
            });
        });
    }
}
FlipView.defaultProps = {
    style: {},
    flipDuration: 500,
    flipEasing: Easing.out(Easing.ease),
    flipAxis: 'y',
    perspective: 1000,
    onFlip: () => { },
    onFlipped: () => { },
    isFlipped: false,
};
let styles = StyleSheet.create({
    flippableView: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backfaceVisibility: 'hidden',
    }
});
