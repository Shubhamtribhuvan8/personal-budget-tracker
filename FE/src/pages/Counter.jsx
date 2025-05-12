import { useState } from "react";
import DisplayCounter from "./DisplayCounter";
import Button from '../component/ui/button'

export default function Counter() {
  const [counter, setCounter] = useState(0);

  const Add = () => {

        setCounter((prev)=>{
            return prev+1
        })
      
  };

  const Minus = () => {
    if(counter===0) return
    setCounter((prev)=>{
        return prev-1
    })
  };
  
  console.log(Add)
  console.log("test", counter);
  return (
    <div>
      <Button onClick={Add}>ADD(+)</Button>
      <Button onClick={Minus}>MINUS(-)</Button>
      <p>{counter}</p>
      {/* <DisplayCounter value={counter} /> */}
    </div>
  );
}
