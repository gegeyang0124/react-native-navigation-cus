
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
     * 页面进入的历史堆栈，只增不减，主要用于历史记录
     * Tab导航和Drawer导航有效
     * **/
    static stackPagesHistory = [];

    /**
     * 页面堆栈（对所有导航有效），主要用户返回和进入新页面
     * 数量和数据会动态变化
     * //成员： {key:'',routeName:'页面名',params:{传递参数}}
     * **/
    static pageStack = [];

    /**
     * 是否压入pageStack的历史堆栈
     * 默认压入
     * **/
    static isPushStack = true;

    /**
     * 当前页面状态数据，主要用于导航
     * Tab导航和Drawer导航有效
     * **/
    static curPageState = {
        routeName:null,//页面名字
        params:null,//页面传递参数
        action:null,//激活动作（事件）
        isExe:true,//是否页面可以执行
    }

    /**
     * 当前页面状态数据 主要用户堆栈历史记录
     * 所有导航有效
     * **/
    static curPageStateStack = {
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

            setTimeout(()=>{
                // cls.context.componentWillEnter&&cls.context.componentWillEnter.bind(cls.context);
                //第二个参数是否返回，true进入，false： 返回
                /**
                 * 第一个参数，页面传递参数
                 * 第二个参数，页面传递动作
                 * 第三个参数，页面名
                 * **/
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

    /**
     * 进入页面执行回调方法
     * @param navigationState json,//导航状态
     * **/
    static componentEnterStack(navigationState){
        // exeOnece = false;
        let curState = this.getRoutes(navigationState);
        // console.info("curState",curState);

        if(curState.routeName == "DrawerOpen"
            || curState.routeName == "DrawerToggle"
            || curState.routeName == "DrawerClose")
        {
            this.isPushStack = false;
        }

        if(this.isPushStack){
            this.curPageStateStack = curState.params
                ? curState.params.params
                    ? curState.params.params
                    : {}
                : {};
            this.curPageStateStack.routeName = curState.routeName;

            let len = this.pageStack.length;
            if(len > 0){
                if(this.pageStack[len - 1].routeName == this.curPageStateStack.routeName)
                {
                    this.pageStack[len - 1] = this.curPageStateStack;
                }
                else
                {
                    this.pageStack.push(this.curPageStateStack);
                }
            }
            else
            {
                this.pageStack.push(this.curPageStateStack);
            }
        }
        else
        {
            this.isPushStack = false;
        }

        // console.info("curState",curState);
    }

}