// loading的使用
<Spin>
  <div>包裹要加载的内容</div>
</Spin>
// 自定义指示符
const antIcon = <Icon type="loading" style={{fontSize:24}} spin />
ReactDOM.render(<Spin indictor={antIcon}/>, mountNode)

// 表单
this.props.form.getFieldsValue()