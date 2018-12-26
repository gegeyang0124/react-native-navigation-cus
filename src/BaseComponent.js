import React, {Component, PureComponent} from "react";
import {
    Image,
    Platform,
} from "react-native";

import StyleSheetAdapt from "react-native-stylesheet-adapt";
import {ButtonImage} from "react-native-dropdown-select";

import LeftWhite from './views/assets/back-icon.png';
import add from './../res/add.png';

/**
 * 修改react-navigation底层
 * 在 this.props.navigation 中添加setEvt方法
 * **/
const StackPages = require('./routers/StackPages').default;
const NavigationActions = require('./NavigationActions').default;

/**
 * 用于继承导航属性
 * **/
export default class BaseComponent extends PureComponent {

    /*static navOptConfigs = {
     headerTitle:'首页',
     //headerLeft:null,
     // 配置页面导航选项
     headerLeft:<Image source={require('./../../res/images/leftWhite.png')}/>,
     };
     // 配置页面导航选项
     static navigationOptions = ({navigation}) => (BaseComponent.navOptConfigs);*/

    static backData = null;//返回参数的存储字段；
    static backRefresh = false;//返回刷新；//默认是false

    /**
     * 导航栏按钮设置
     * headerLeft：//导航栏左边按钮可传 bool（false:隐藏左边默认UI;true:显示左边默认UI）、图片(url)、UI
     * headerRight：//导航栏右边按钮可传 bool（false:隐藏左边默认UI;true:显示左边默认UI）、图片(url)、UI
     * headerLeftHandle://函数方法 可在左边按钮点击返回之前执行
     * headerRightHandle://函数方法 右边按钮点击执行
     * **/
    static navigationOptions = ({ navigation,screenProps}) => {
        const { params } = navigation.state;
        // alert(JSON.stringify( navigation.state))
        // console.info("navigation",navigation);

        let header ={
            title: params && params.title != null  ? params.title : '',
            headerLeft:null,
            headerRight:null,// 右边按钮图片
            // headerRightHandle:null,//右边要处理的事件
            // headerLeftHandle:null,//左边要处理的事件
            // swipeEnabled:false,
        };

        let headerTitleStyle = {
            flex: 1,
            textAlign: 'center',
            fontSize:StyleSheetAdapt.getWidth(25),
            left:StyleSheetAdapt.getWidth(-45),
            right:StyleSheetAdapt.getWidth(-45)
        };

        if(params != undefined && params.headerLeft != undefined){
            if(params.headerLeft == true || params.headerLeft == false)
            {

                header.headerLeft = <ButtonImage icon={
                    params.headerLeft
                        ? LeftWhite
                        : undefined
                }
                                                 onPressIn={() =>{
                                                     if(params.headerLeft)
                                                     {
                                                         params.headerLeftHandle == undefined
                                                             ? null
                                                             : params.headerLeftHandle();
                                                         // navigation.navigate('PageMine');
                                                         BaseComponent.goBack();

                                                         // navigation.popToTop(1);//popToTop
                                                     }
                                                 }}
                                                 style={styles.iconLeft}
                                                 iconStyle={{tintColor:'white'}}/>;
            }
            else if(typeof (params.headerLeft) == 'number')
            {
                header.headerLeft = <ButtonImage icon={params.headerLeft}
                                                 onPressIn={params.headerLeftHandle}
                                                 style={styles.iconLeft}/>;

            }
            else if(typeof (params.headerLeft) == 'object')
            {
                header.headerLeft = params.headerLeft;
            }

            headerTitleStyle.right = 0;
            !Platform.OS == "ios" ? header.headerTitleStyle = headerTitleStyle : null;
        }

        if(params != undefined && params.headerRight != undefined){
            if(params.headerRight == true || params.headerRight == false)
            {
                header.headerRight = <ButtonImage icon={
                    params.headerRight
                        ? add
                        : undefined
                }
                                                  onPressIn={()=>{
                                                      if(params.headerRight){
                                                          params.headerRightHandle && params.headerRightHandle();
                                                      }
                                                  }}
                                                  style={[styles.iconRight]}/>;
            }
            else if(typeof (params.headerRight) == 'number')
            {
                header.headerRight = <ButtonImage icon={params.headerRight}
                                                  onPressIn={params.headerRightHandle}
                    // iconStyle={styles.iconStyle}
                                                  style={styles.iconRight}/>;

            }
            else if(typeof (params.headerRight) == 'object')
            {
                header.headerRight = params.headerRight;
            }
            headerTitleStyle.left = 0;
            !Platform.OS == "ios" ? header.headerTitleStyle = headerTitleStyle : null;

        }

        return header;
    };

    static pageStack = [];//成员： {key:'',routeName:'页面名',params:{传递参数}}
    static navigationer;

    static backPage = null;//指定返回页

    /// 页面组件初始化时获取当前页面的实例
    constructor(props) {
        super(props);

        this.__proto__.context = this;
        BaseComponent.navigationer = this.props.navigation;
    }

    /// 返回当前页面的navigation
    nav() {
        BaseComponent.navigationer = this.props.navigation;
        return this.props.navigation;
    }

    /**
     * 跳转页面
     * @param pageName string,//页面的名字
     * @param params object,//传递参数
     * @param isStack bool,//是否压入堆栈，true:是,false：否；默认是：true
     * @param backPage string/set<string>/set<object>/boolean,
     object={routeName:'页面名'，params:'参数'}; //返回指定页
     true;//选项卡点击进入初始页
     * **/
    static goPage(pageName,params,isStack = true,backPage){
        // this.backPage = backPage;
        // console.info("pageName",pageName)
        if(backPage){
            if(backPage.constructor == Array){
                if(backPage.length > 0){
                    backPage.forEach((v)=>{
                        if(Object != v.constructor){
                            v = {
                                routeName:v
                            };
                        }
                        // BaseComponent.pageStack.push(v);
                        StackPages.pageStack.push(v);
                    });
                }

            }
            else if(backPage.constructor == String){
                /*BaseComponent.pageStack = BaseComponent.pageStack.concat([{
                    routeName:backPage
                }]);*/
                StackPages.pageStack = StackPages.pageStack.concat([{
                    routeName:backPage
                }]);
            }
            else if(backPage){
                // console.info("StackPages",StackPages.stackPages);
            }
        }
        else if(isStack){
            // this.pageStack.push(this.navigationer.state);
            // BaseComponent.pageStack.push(StackPages.curPageStateStack);
            StackPages.isPushStack = isStack;
        }

        if(params == undefined){
            this.navigationer.navigate(pageName);
        }
        else
        {
            this.navigationer.navigate(pageName,params);
        }
    }
    goPage(pageName,params,isStack = true,backPage){
        BaseComponent.navigationer = this.props.navigation;
        // console.info("StackPages.pageStack",StackPages.pageStack)
        if(backPage){

            if(backPage.constructor == Array){
                if(backPage.length > 0){
                    backPage.forEach((v)=>{
                        if(Object != v.constructor){
                            v = {
                                routeName:v
                            };
                        }
                        // BaseComponent.pageStack.push(v);
                        StackPages.pageStack.push(v);
                    });
                }

            }
            else if(backPage.constructor == String){
                /*BaseComponent.pageStack = BaseComponent.pageStack.concat([{
                    routeName:backPage
                }]); */
                StackPages.pageStack = StackPages.pageStack.concat([{
                    routeName:backPage
                }]);
            }
            else if(backPage){

            }
        }
        else if(isStack){
            // BaseComponent.backPage = backPage;
            // BaseComponent.pageStack.push(this.props.navigation.state);
            // BaseComponent.pageStack.push(StackPages.curPageStateStack);
            StackPages.isPushStack = isStack;
        }
        /*console.info("BaseComponent.pageStack",BaseComponent.pageStack);
        console.info("StackPages.stackPagesHistory",StackPages.stackPagesHistory);
        console.info("StackPages.curPageState",StackPages.curPageState);
        console.info("StackPages.curPageStateStack",StackPages.curPageStateStack);
        console.info("this.props.navigation.state",this.props.navigation.state);
        console.info("BaseComponent.navigationer.state",BaseComponent.navigationer.state);
*/

        /**
         * 修改react-navigation底层
         * 在 this.props.navigation 中添加setEvt方法
         * **/
        // this.props.navigation.setEvt(this.immediately);

        /*this.props.navigation.push(pageName);
        this.props.navigation.pop(2);
         对StackNavigator有效
        */

        if(params == undefined){
            this.props.navigation.navigate(pageName);
        }
        else
        {
            // console.info("navigation:",pageName);
            this.props.navigation.navigate(pageName,params);

        }
    }

    /**
     * 返回已进入的页面
     参数param：{
            backToPage：'强制返回页'，
            backToPageParams:'返回页参数',
            }
     * @param param object;//返回传递参数
     * @param page string;//要返回指定的页面名
     * @param isfresh bool;//要返回页面是否刷新，true：刷新，false:不刷新，默认false
     * **/
    static goBack(page,param,isfresh){
        console.info("pageStack",JSON.stringify(StackPages.pageStack))
        isfresh = isfresh == undefined ? false : isfresh;
        if(page == undefined || page == null)
        {
            // this.navigationer.goBack();
            let pageObj =  StackPages.pop();
            // console.info("pageObj",pageObj);
            if(!pageObj || !pageObj.routeName){
                return;
            }

            let curParams = this.getPageParams();
            let routeName = pageObj.routeName;
            curParams = curParams == undefined ? {} : curParams;
            if(curParams.backToPage && curParams.backToPage != pageObj.routeName)
            {
                routeName = curParams.backToPage;
            }
            else if(BaseComponent.backPage){
                routeName = BaseComponent.backPage;
            }

            this.backData = curParams.backToPageParams == undefined
                ? null
                : curParams.backToPageParams;

            this.backData = param == undefined ?
                this.backData
                : param;

            if(this.backRefresh || isfresh){
                this.backRefresh = false;
                this.goPage(routeName,this.backData,false);
            }
            else {
                this.goPage(routeName,undefined,false);
            }
        }
        else
        {
            this.navigationer.goBack(page);
        }
    }
    goBack(page,param,isfresh){
        BaseComponent.navigationer = this.props.navigation;
        isfresh = isfresh == undefined ? false : isfresh;
        if(page == undefined || page == null)
        {
            // this.props.navigation.goBack();
            let pageObj = StackPages.pop();
            // console.info("pageObj",pageObj);
            if(!pageObj || !pageObj.routeName){
                return;
            }

            let curParams = this.getPageParams();
            let routeName = pageObj.routeName;
            curParams = curParams == undefined ? {} : curParams;
            if(curParams.backToPage && curParams.backToPage != pageObj.routeName)
            {
                routeName = curParams.backToPage;
            }
            else if(BaseComponent.backPage){
                routeName = BaseComponent.backPage;
            }

            BaseComponent.backData = curParams.backToPageParams == undefined
                ? pageObj.params
                : curParams.backToPageParams;

            BaseComponent.backData = param == undefined ?
                BaseComponent.backData
                : param;

            if(BaseComponent.backRefresh || isfresh){
                BaseComponent.backRefresh = false;
                this.goPage(routeName,BaseComponent.backData,false);
            }
            else {
                this.goPage(routeName,undefined,false);
            }

        }
        else
        {
            this.props.navigation.goBack(page);
        }
    }

    /**
     * 设置参数改变导航栏
     * @param pageName json,//页面的名字
     * **/
    static setParams(params){
        this.navigationer.setParams(params);
    }
    setParams(params){
        BaseComponent.navigationer = this.props.navigation;
        this.props.navigation.setParams(params);
    }

    /**
     * 设置任意路由的参数，
     * @param key string,//路由的键值
     * @param param json,//需要设置的参数
     * **/
    setParamsTo(key,param){
        BaseComponent.navigationer = this.props.navigation;
        const setParamsAction = NavigationActions.setParams({
            params: param, // these are the new params that will be merged into the existing route params
            // The key of the route that should get the new params
            // key: 'screen-123',
            key: key,
        })
        this.props.navigation.dispatch(setParamsAction);

        /*  const resetAction = NavigationActions.reset({
              index: 0,
              swipeEnabled:false,
              actions: [
                  NavigationActions.navigate({ routeName: 'PageTask',swipeEnabled:false})
              ]
          })
          this.props.navigation.dispatch(resetAction);*/
    }

    /**
     * 获取页面跳转传递的参数
     * @param isBack bool,//是否获取返回传递数据，默认是false
     * **/
    static getPageParams(isBack){

        isBack = isBack == undefined ? false : isBack;

        if(isBack)
        {
            const backData = this.backData;
            this.backData = null;
            return backData;
        }
        else
        {
            // console.info("this.navigationer",this.navigationer);
            return this.navigationer.state.params;
        }

    }
    getPageParams(isBack){
        BaseComponent.navigationer = this.props.navigation;
        isBack = isBack == undefined ? false : isBack;

        if(isBack)
        {
            const backData = BaseComponent.backData;
            BaseComponent.backData = null;
            return backData;
        }
        else
        {
            return this.props.navigation.state.params;
        }

    }

}

const styles = StyleSheetAdapt.create({
    iconTab:{
        width:40,
        height:40,
        resizeMode:"contain",
    },
    iconLeft:{
        width:30,
        height:30,
        marginLeft:10,
    },
    iconRight:{
        width:30,
        height:30,
        marginRight:20,
    },
    headerTitleStyle:{
        flex: 1,
        textAlign: 'center',
        fontSize:25,
        left:-45,
    },
    iconStyle:{
        // tintColor:"#FFFFFF",
    },
});