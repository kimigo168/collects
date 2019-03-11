

// 块级 diplay:flex;
// 行内 display:inline-flex;
/* webkit内涵浏览器 */
// .box{
//   display: -webkit-flex; /* Safari */
//   display: flex;
// }
// 容器： flex container 
// 项目 flex item

// 1.容器属性,6个：flex-direction, flex-wrap, flex-flow, justify-content, align-items, align-content 

// (1) flex-direction 决定主轴的方向，即项目的排列方向
// flex-direction: row | row-reverse | column | column-reverse  起点在左 | 起点在右端 | 起点在上 | 起点在下

// (2) flex-wrap 默认项目都排在一条线，如果一条轴线拍不下，如何换行
// flex-wrap: nowrap | wrap | wrap-reverse;  默认不换行 | 换行，第一行在上 | 换行，第一行在下

// （3） flex-flow： flex-direction 和 flex-wrap 两个属性的简写
// flex-flow: <flex-direction> <flex-wrap>;

// （4）justify-content: 定义了项目在主轴上的对齐方式
// justify-content: flex-start | flex-end | center | space-between | space-around; 
// 左对齐 | 右对齐 | 居中 | 两端对齐，项目之间间距都相等 | 每个项目两侧的间隔相等，项目之间的间隔比项目与边框的间隔大一倍

// （5）align-items: 定义了项目在交叉轴上如何对齐
// align-items: flex-start | flex-end | center | baseline | stretch
// 交叉轴起点对齐 | 交叉轴终点对齐 | 交叉轴中点对齐 | 项目第一行文字基线对齐 | 默认占满整个高度

// （6）align-content： 定义了多根轴线的对齐方式，如果一根则不起作用
// align-content: flex-start | flex-end | center | space-between | space-around | stretch;
// 与交叉轴的起点对齐 | 与交叉轴的终点对齐 | 交叉轴的中点对齐 | 与交叉轴两端对齐，轴线之间的间隔平均分布 | 每根轴线两侧的间隔都相等，轴线之间的间隔比轴线与边框的间隔大一倍 |
// 默认占满整个交叉轴

// 2.项目的属性,6个：order, flex-grow, flex-shrink, flex-basis, flex, align-self
// (1) order: <integer> 定义项目的排列顺序，值越小，排列越前，默认为0

// (2) flex-grow: <number> 定义项目的放大比例，所占空间，默认是0

// (3) flex-shrink: <number> 定义了项目的缩小比例，如果空间不足，该项目将缩小，默认是1

// （4）flex-basis: <length> | auto; 定义了分配多余空间前，项目占据的主轴空间，设置固定值，

// （5）flex: none | [<'flex-grow'> <'flex-shrink'> ? || <'flex-basis'>]  // 后两个属性可选
//  auto( 1 1 auto) 和 none (0 0 auto)

// (6) align-self： 允许单个项目与其它项目不一样的对齐方式，可覆盖align-items属性，默认auto
// align-self: auto | flex-start | flex-end | center | baseline | stretch;





