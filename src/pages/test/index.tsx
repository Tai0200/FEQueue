import React, {useState} from "react";
import './style.css';
const Test = () => {
    const [degree, setDegree] = useState(270);
    return(
        <div>
            <button onClick={()=>setDegree(degree=>degree+5)}>Change</button>
        <div className="circle" 
        style={{background:`conic-gradient(red 0deg ${degree}deg, white ${degree}deg 360deg)`}}>
            <div className="middle-circle">
            <div className="first-circle"
            style={{background:`conic-gradient(blue 0deg ${360-degree}deg, white ${360-degree}deg 360deg)`}}
            >
            <div className="inner-circle">
                <p>{Math.round(degree*100/360)}%</p>
            </div>
            </div>
            </div>
        </div>
        </div>
    )
}
export default Test