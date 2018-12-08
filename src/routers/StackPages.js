import * as TD from "react-native-talkingdata";

export default class StackPages {
    /**
     * 页面数据列
     * 成员
     * {'屏幕名':实例}
     * **/
    static stackPages = {};

    /**
     * 页面详细结构
     * **/
    static stackPagesStruct = null;

    /**
     * 页面进入的历史堆栈
     * **/
    static stackPagesHistory = [];

    /**
     * 当前页面状态数据
     * **/
    static curPageState = {
        routeName:null,//页面名字
        params:null,//页面传递参数
        action:null,//激活动作（事件）
        isExe:true,//是否页面可以执行
    }

    /**
     * 退出页面是回调方法
     * **/
    static componentWillExit(){
        if(StackPages.stackPagesHistory.length > 0){
            let page = StackPages.stackPagesHistory[StackPages.stackPagesHistory.length - 1];

            TD.trackPageEnd(page.routeName);

            let clsPre = StackPages.stackPages[page.routeName].screen.prototype;;
            if(clsPre.context){
                // clsPre.context.componentWillExit&&clsPre.context.componentWillExit.bind(clsPre.context);
                clsPre.context.componentWillExit&&clsPre.context.componentWillExit(
                    page.params,
                    page.action,
                    page.routeName);
            }
        }
    }

    /**
     * 进入页面是回调方法
     * @param routeName string,//路由名（页面的名字）
     * @param params json,// 页面跳转的传递参数
     * **/
    static componentWillEnter(routeName,params){
        let cls = StackPages.stackPages[routeName].screen.prototype;

        if(cls.context){
            StackPages.curPageState = params ? params : {};
            StackPages.curPageState.routeName = routeName;
            TD.trackPageBegin(routeName);

            setTimeout(()=>{
                // cls.context.componentWillEnter&&cls.context.componentWillEnter.bind(cls.context);
                //第二个参数是否返回，true进入，false： 返回
                cls.context.componentWillEnter&&cls.context.componentWillEnter(
                    StackPages.curPageState.params,
                    StackPages.curPageState.action,
                    StackPages.curPageState.routeName);

                StackPages.stackPagesHistory.push(StackPages.curPageState);
                // StackPages.curPageState.isExe = true;
            },0);
        }

        // console.info("this.navState:", this.navState);
        // console.info("StackPages.curPageState:", StackPages.curPageState);
    }

    /**
     * 获取当前的路由
     * @param nav json,//导航状态
     * **/
    static getRoutes(nav){
        if(nav.routes && nav.routes.length > 0){
            return this.getRoutes(nav.routes[nav.index]);
            // return this.getRoutes(nav.routes[index],nav.routes[index].index);
        }
        else
        {
            return nav;
        }
    }

    /**
     * 进入页面执行回调方法
     * @param navigationState json,//导航状态
     * @param curIndex int,//当前路由地址，只有iOS有效
     * **/
    static componentEnter(navigationState,curIndex){

        this.stackPagesStruct = navigationState;
        let nav = JSON.stringify(navigationState);
        nav = JSON.parse(nav);
        nav.index = curIndex == undefined ? nav.index : curIndex;


        let curState = this.getRoutes(nav);
        // console.info("this.curPageState",this.curPageState);
        // console.info("curState",curState);
        if(!this.curPageState.routeName || this.curPageState.routeName != curState.routeName){
            this.componentWillExit();
            this.componentWillEnter(curState.routeName,curState.params
                ? curState.params.params
                    ? curState.params.params
                    : {}
                : {});
        }
    }

}