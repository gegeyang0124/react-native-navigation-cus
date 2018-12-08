# react-native-navigation-cus
react-native的导航组件，基于[react-navigation@1.5.11](https://github.com/react-navigation/react-navigation)，修改而成

### 安装组件：
npm i --save react-native-navigation-cus

### 使用 （此导航组件可查看[react-navigation](https://github.com/react-navigation/react-navigation)，或百度搜索react-navigation的使用与配置）
##### 组件BaseComponent 用于继承导航属性;这个组件中的方法都是"静态和动态"两种调用方式
```javascript
this.goPage();//跳转页面
BaseComponent.goPage();//跳转页面
this.goBack();//返回已进入的页面
BaseComponent.goBack();//返回已进入的页面
this.setParams();//设置参数改变导航栏
BaseComponent.setParams();//设置参数改变导航栏
this.getPageParams();//获取页面跳转传递的参数
BaseComponent.getPageParams();//获取页面跳转传递的参数
```

### 示例
```javascript
import React, {Component} from 'react';
import StyleSheetAdapt from "react-native-stylesheet-adapt";
import {
    BaseComponent,
    StackNavigator,
    TabNavigator
} from "react-native-navigation-cus";
import {
   Text,
} from 'react-native';

export default class Test extends BaseComponent<Props> {

    constructor(props) {
        super(props);
let param = Tools.userConfig.userCutAccount
 && Tools.userConfig.userCutAccount.length > 0
            ? {
                headerLeft:<ImageChange icon={require("images/role.png")}
                                        onPressIn={()=>PageSearchRole.show(this)}
                                        style={styles.hLeft}/>
            }
            : {
                headerLeft:false
            };

        this.setParams(param);
    }
    render() {
        return (
            <ViewTitle>
                <BarcodeView ref={c=>this.barcodeView}
                    style={styles.testStyle}/>
                <Text onPress={()=>this.barcodeView.startScan()}>
                    开始扫码
                </Text>
            </ViewTitle>
        );
    }
}
const styles = StyleSheetAdapt.create({

    testStyle2:{
        width:100,
        height:200,
    },
    testStyle:{
        transform:[
            {rotateX:'180deg'}
        ],
    },
});

```

### [我的博客](http://blog.sina.com.cn/s/articlelist_6078695441_0_1.html)



