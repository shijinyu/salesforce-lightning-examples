该示例将一个ReactApp挂载到了LCC上。

这个ReactApp使用了 `create-react-app` 工具创建，懂得都懂。

示例内容：

 - 将一个最简单的`react-app`导入到`salesforce`里。
 - 众所周知，`react-app`最终会 `build`成一个`html`并链接`js`、`css`等资源。而lcc就是把这个html以`iframe`的方式嵌入到他的视图里。

#### 构建步骤

###### 第一步：安装依赖

```bash
npm install
# or
yarn
```

###### 第二步：构建

这里采用了`react-script`默认构建，会打包到`build`文件夹。

在`.env`文件里配置了`publicPath`，否则资源在`lcc`里会出现路径错误。

###### 第三步：将Build的代码打压缩包

切换到`build`目录，执行:

```bash
zip -r ExampleUsageBasicUsage.zip * -x ".*" -x "__MACOSX"
```

###### 第四步：上传压缩包

注：以下部分最好在sandbox环境或test下操作，否则可能会影响生产环境。

 1. 登录你的salesforce org，并进入Setup界面（右上角齿轮图标弹出菜单）。
 2. 右侧菜单找到【Custom Code】→【Static Resources】，进入。
 3. 【New】新建Static Resource，也就是将刚才打包的zip上传，注意资源的name为`ExampleUsageBasicUsage`。

###### 第五步：创建 Custom Lightning Component

**第一种方式：使用Developer Console**

`Developer Console`打开方式：页面左上角齿轮图标→【Developer Console】

这种方法方便调试salesforce app。

 1. 新建`Custom Lightning Component`。
 2. 将`./metadata/aura/Basic`目录下的文件拷贝到`Developer Console`内的对应文件。

**第二种方式：使用SFDX方式**

这种方式适合本地使用IDE开发，例如VSCode。

`SFDX`安装和配置，链接到ORG，略。
`SFDX`在没有`Dev Hub`的情况下创建临时`ORG`，略。

创建一个lwc:

````bash
sfdx force:lightning:component:create --componentname ExampleUsageBasicUsage --outputdir metadata/aura
````

同步代码:

```bash
#拉取代码

sfdx force:source:pull

#推送代码

sfdx force:source:push

```

...

###### 第六步：创建 FlexPage

一个flexPage相当于一个页面容器，它可以容纳若干个组件（LWC），并配置布局。

主要用到`Setup`里的【`User Interface`】→【`Lightning App Builder`】这个页面。
在这里`New`即可，我们将它命名为`BasicDemo`。

###### 第七步：配置刚才的FlexPage页面

还是【`User Interface`】→【`Lightning App Builder`】，在创建的`FlexPage`那一条选择`Edit`，进入布局页面。

在左侧选择你刚才上传的组件。保存并激活这个FlexPage。（界面右上）。

切回Home，在tab栏找到右侧的编辑图标。在【Edit App Navigation Items】中，点击【Add More Items】，将你刚才操作的`FlexPage`加入，保存，即可在选项卡找到该页面，你上传的ReactApp将会以iframe形式展现。

#### 总结

**LWC如何嵌入第三方的内容**

关键在这里：
看`*.cmp`组件文件：

```xml
<aura:component access="global" implements="flexipage:availableForAllPageTypes" >
    <lightning:container src="{!$Resource.ExampleUsageBasicUsage + '/index.html'}"/>
</aura:component>
```

它用到了`lightning:container`这个组件，而`$Resource.ExampleUsageBasicUsage`即指向了你上传的那个Static Resource（名称要对上）。

**React组件，HTML资源引入jscssimg的路径问题**

需要正确设置webpack的publicPath，如还有问题需要在build文件夹手动修改。因为salesforce在请求的时候会加上自己的前置path，导致上述问题。

默认配置：
```js
// .env
PUBLIC_URL='./'
```

**Content Security Policy 导致JS无法执行的问题**

 1. 在HTML中添加CSP标签：

 ```html
<meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://canary.lwc.dev https://visualforce.com">
 ```

 2. 一定要关闭`create-react-app`中的`INLINE_RUNTIME_CHUNK`选项：

 ```js
// .env
INLINE_RUNTIME_CHUNK=false
 ```

 该选项会让`CRA`这个SB不把运行时脚本嵌入`index.html`，而是直接打入`script`标签。而默认生产环境下，`cra`的构建不会这么做，而是嵌入一段脚本，再通过类似`document.write`的方式动态加载`js`，而这种行为在`iframe`会被浏览器安全策略屏蔽。