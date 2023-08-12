# Questions

## 1. What is the difference between Component and PureComponent? give an example where it might break my app.

PureComponent performs shallow comparison of props and state. If the props or state has not changed the component will not re-render. It helps to avoid unnecessary re-renders. In the meantime, when the Component updates, it triggers re-render even if the component's props or state have changed because its `shouldComponentUpdate` method always returns true.

Example when it can break my app:
Using mutable array or object can lead to unexpected behavior and not trigger re-renders when it's expected. Because PureComponent checks for reference change not the content change. Below here is small piece of code that can represent the issue itslef:

Parent Component

```
 Class ParentClass extends Component {
   state = {
     data: [
       { id: 1, name: 'first' },
       { id: 2, name: 'second' }
     ]
   };

   handleChangeData = (id) => {
     this.setState((prevState) => {
       const data = prevState.data.map((item) => {
         if (item.id === id) {
           return { ...item, name: 'new item' };
         }
         return item;
       });
       return { data };
     });
   }

   render() {
     const { data } = this.state;
     return (
       <div>
         {data.map((item) => (
           <Item key={item.id} item={item} />
         ))}
         <button onClick={() => handleChangeData(1)}>Change</button>
       </div>
     );
   }
 }
```

Child Component

```
 class Item extends PureComponent {
   render() {
     const { item } = this.props;
     return (
       <div>{item.name}</div>
     );
   }
 }
```

## 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

1.  With Context, changes to the context value affect all components consuming that context. If you have multiple components using the same context and one of them has a `shouldComponentUpdate` method with custom logic it can lead to inconsistencies and unexpected behavior.
2.  If a component's `shouldComponentUpdate` returns false, the component will not update, and its render method will not be called. This can be beneficial for performance but if the context value changes and a component with `shouldComponentUpdate` returns false, it will not receive the latest context value. This can lead to components using outdated information.

## 3. Describe 3 ways to pass information from a component to its PARENT.

1. Lifting State Up - pass information from a child component to its parent is through props and callbacks.
   The parent component can define a function and pass it down to the child as a prop. The child component can then call this function and pass data back to the parent.
2. React Context - use the same approach as in the first point. The child component can use the callback from `useContext` to pass the data.
3. State Management Library - use dispatching action function in the parent component and pass to child component. And use the callback to pass the data again up.

## 4. Give 2 ways to prevent components from re-rendering.

1. React.memo()/PureComponent
2. shouldComponentUpdate

## 5. What is a fragment and why do we need it? Give an example where it might break my app.

Fragment is a way of grouping multiple elements in react component but without adding additional DOM element. It's much cleaner and no extra DOM element is needed which can help to improve the performance.

Example when it can break my app:
It may break the CSS styling of the componet and cause layout issues.

## 6. Give 3 examples of the HOC pattern.

1. `connect` from react-redux. It receives as arguments two functions for passing state and dispatch functions to props and the component itself.
2. `withRouter` from react-router-dom. Used to provide an access to get router props to a component.
3. `withStyles` from Material-UI. Used to add custom styles.

## 7. what's the difference in handling exceptions in promises, callbacks and async...await.

Consider that `promise()` is a function that returns a promise. Exceptions can be handled like this:

1. Promises - with the help of `then()` and `catch()` methods.

```
  promise()
    .then(res => console.log(res))
    .catch(err => console.error());
```

2. Async await - with the help `try...catch` block.

```
  const handleSomeAsyncFunc = async () => {
    try {
      const res = await promise();
      console.log(res);
    } catch(err) {
      console.error(err);
    }
  }
```

3. Callback - usually the first argument is error and the second one is null or undefined.

```
  promise((err, data) => {
    if (err) {
      console.error(err)
    } else {
      console.log(data)
    }
  })
```

## 8. How many arguments does setState take and why is it async.

`setState` can take two arguments. The first one is object or function. The second one is optional callback which is executed once the state is updated. And you can use this callback for several manipulations if you need it. It is async because it doesn't update the state immediately and trigger re-render for better performance. Usually React merges/batches the state updates and perform a single re-render.

## 9. List the steps needed to migrate a Class to Function Component.

1. Rewrite states to useState hook
2. Rewrite lifecycle method to useEffect hook
3. Remove keywords that belong to class components like this, bind and e.t.c
4. Convert class methods to functions
5. Remove render() method
6. Make sure that props are correctly integrated to functional component
7. Test and make sure that everything works ok

## 10. List a few ways styles can be used with components.

1. Inline styling
2. CSS classnames
3. CSS modules
4. CSS in JS
5. UI libraries

## 11. How to render an HTML string coming from the server.

With the help of attribute `dangerouslySetInnerHTML`. But this attribute might lead to some security risks as it allows to inject html elements and scripts.
