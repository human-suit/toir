import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

import { adminResources } from "./admin/generated/resources";

const dataProvider = simpleRestProvider("http://172.18.0.1:3000");

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      {adminResources.map((r) => (
        <Resource
          key={r.name}
          name={r.name}
          list={r.list}
          create={r.create}
          edit={r.edit}
          show={r.show}
        />
      ))}
    </Admin>
  );
}

export default App;
