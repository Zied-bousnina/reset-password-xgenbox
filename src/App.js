import Form from "./components/Form";

import {

  Route,
 BrowserRouter,
  Routes,
} from "react-router-dom";
import NotFound from "./components/NotFound";


function App() {

return (
  <BrowserRouter>
    <Routes>
      <Route path="/reset-password" element={<Form />} />
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  </BrowserRouter>
 

 
)
  

}
  
export default App;
