import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Guide from './Guide'
import Debugger from './Debugger'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Guide />
    },
    {
      path: '/debugger',
      element: <Debugger />
    }
  ],
  { basename: '/ethsigning/' }
)

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
