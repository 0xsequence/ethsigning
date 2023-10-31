import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useTheme } from '@0xsequence/design-system'

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
  const { theme } = useTheme()

  return (
    <div className={theme === 'dark' ? 'pattern' : 'pattern-light'}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
