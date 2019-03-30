## Installation

##### Thêm Vào package.json
```
"my-rn-flip-view": "git+https://gitlab.com/react-native-my-libs/my-rn-flip-view.git",
```

Chạy  lệnh sau
```
yarn install
```

## Sử dụng

###### sử dụng như sau: 
Tham khảo cái VVocaCard của matching.

```javascript

 <FlipView ref={(ref) => {this.flipCardView = ref}}
                          style={{flex: 1}}
                          front={this._renderFront()}
                          back={this._renderBack()}
                          isFlipped={this.isFlipped}
                          flipAxis="y"
                          flipEasing={Easing.out(Easing.ease)}
                          flipDuration={300}
                          perspective={1000}/>
```
