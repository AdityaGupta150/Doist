//Imports for using material-ui
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import login from './pages/login'

import React from 'react'

//Using Switch and Route to assign routes for our ToDoApp
<Router>
  <div>
    <Switch>
      <Route exact path='/login' component={login}/>
    </Switch>
  </div>
</Router>

// function App() {
//   return (<div></div>);
// }

export default App;