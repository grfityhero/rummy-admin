import { BrowserRouter as Router } from 'react-router-dom'
import Routing from './routes'
import './styles/App.css'
import './styles/index.css'
import './styles/variable.css'
import './styles/common.css'

function App() {

  return (<>
    <Router>
      <Routing />
    </Router>
  </>)
}

export default App
