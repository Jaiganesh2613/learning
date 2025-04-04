import React from "react";
import LearnComponent from "./Components/LearnComponent";
import Students from "./Components/Students";
import ArraySample from "./Components/ArraySample";
import "./css/App.css";
import OneofSample from "./Components/OneofSample";

function App() {
  const items = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" }
  ];

  return (
    <>
      <div>Jaiganesh Learning</div>
      <LearnComponent />
      <Students name="Jaiganesh" age={25} isMarried={true} />
      <Students name="Raju" age={51} isMarried={false} />
      <Students name="Dinesh" age={30} isMarried={true} />
      <Students />
      <childComponent>
        <p>This is a paragraph from child component</p>
        <p>This is a sample paragraph 1</p>
        <p>This is a sample paragraph 2</p>
      </childComponent>
      <ArraySample items={items} />
      <OneofSample color="green"/>
    </>
  );
}

export default App;
