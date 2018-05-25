
/**
 * @param mapState
 * 1.mapState生成计算属性
 */
import { mapState } from 'vuex'; 
export default {
  computed: mapState({
    count: state => state.count,
    // 传字符串参数'count'等同于`state => state.count`
    countAlias: 'count',
    // 为了使`this`获取局部状态，使用常规函数
    countPlusLocalState(state) {
      return state.count + this.localCount
    }
  }),
  // 计算属性名称与state子节点名称相同，给mapState传一个字符串数组
  computed: mapState([
    // 映射 this.count为store.state.count
    'count'
  ]),
  //???
  computed: {
    localComputed() {},
    // 使用对象展开符，将此对象混入到外部对象中
    ...mapState({
      //.....
    })
  }
}

/**
 * 2.Getter 从store中的state派生出一些状态,(通过属性访问vs通过方法访问)
 */
const store = new Vuex.Store({
  state: {
    todos:[
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    // a.通过属性访问
    doneTodos: state => {
      return state.todos.filter(todo => todo.done);
    },
    // 接受其他getter作为第二个参数
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length;
    },
    // b.通过方法访问
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id);
    }
    // store.getters.getTodoById(2) // 
  },
  // store.getters.doneTodosCount -1
  // 在其他组件中使用
  computed: {
    doneTodosCount() {
      this.$store.getters.doneTodosCount
    }
  },
});
/**
 * @param mapGetters
 * 3.mapGetters 辅助函数将state中的getter映射到局部计算属性中
 */
import { mapGetters } from 'vuex';
export default {
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter'
    ]),
    // 给getter属性取另一个名
    ...mapGetters({
      // `this.doneCount`映射为`store.getters.doneTodosCount`
      doneCount: 'doneTodosCount'
    })
  },
}
/**
 * @param mutation
 * 4.更改 Vuex 的 store 中的状态的唯一方法
 */
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment(state) {
      // 变更状态
      state.count++;
    },
    // 提交载荷，即向store.commit传入额外的参数
    addCount(state, playload) {
      state.count += playload.amount;
    }
  }
})
// 方式一：使用store.commit('addCount', {amount: 10});
// 方式二：(对象方式的提交方式) store.commit({type: 'addCount', amount: 10});

/**
 * 5.使用常量代替mutation事件类型
 */
// mutation-type.js
export const SOME_MUTATION ='SOME_MUTATION';
// store.js
const store = new Vuex.Store({
  state: {

  },
  mutation: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
/**
 * @param mapMutations
 * 6.在组件中提交mutation方法：
 */
// 方法一:this.$store.commit('xxxx')
// 方法二：mapMutations辅助函数将组件中的methos映射为store.commit
import { mapMutations } from 'vuex';
export default {
  methods: {
    ...mapMutations([
      'increment', // 将`this.increment()` 映射为`this.$store.commit('increment')`
      // mapMutations也支持载荷
      'incrementBy'// 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
// mutation 都是同步事务
/**
 * 7.Action与mutation类似，不同action提交的是mutation,而不是直接改变状态
 * Action可以包含任意异步操作
 */
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    increment(context) {
      // Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，
      // 或者通过 context.state 和 context.getters 来获取 state 和 getters
      context.commit('increment');
    }
  },
  //  ES2015 的 参数解构 来简化代码
  actions: {
    increment({commit}) {
      commit('increment');
    }
  }
})
// 分发action store.dispatch('increment');
// 以载荷和对象形式分发
store.dispatch('incrementAsync', {
  amount: 10
})
// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
});
/**
 * @param mapActions
 * 8.在组件中分发
 */
import { mapActions } from 'vuex';
export default {
  //...
  methods: {
    ...mapActions([
      'increment', // 将`this.increment()`映射为`this.$store.dispatch('increment')`
      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`

    ])
  }
}
// 组合action
// 假设 getData() 和 getOtherData() 返回的是 Promise

// actions: {
//   async actionA ({ commit }) {
//     commit('gotData', await getData())
//   },
//   async actionB ({ dispatch, commit }) {
//     await dispatch('actionA') // 等待 actionA 完成
//     commit('gotOtherData', await getOtherData())
//   }
// }
/**
 * @param Module
 * 9.Vuex 允许我们将 store 分割成模块（module）
 * 每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割
 */
const moduleA = {
  state: {},
  mutations: {},
  actions: {},
  getters: {}
}
const moduleB = {
  state: {},
  mutation: {},
  actions: {},
  getters: {}
}
const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
});
store.state.a // moduleA的状态
