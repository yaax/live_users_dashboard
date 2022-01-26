import './App.scss';

import NameForm from './NameForm.js';

import { Route, Routes } from 'react-router-dom';

import Dashboard from './dashboard.js';

function App() {

  return (
      <Routes>
        <Route path="/" element={<NameForm />}>
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
     </Routes>
  );
}

export default App;
