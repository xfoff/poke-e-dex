import './App.css'

const Main: React.FC = () => {

  return (
    <>
      <div className="border">
        <div className="background">
          <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg" className="nimbembo">
            <path id="curve" d="M50,150 Q200,200 350,150" fill="transparent" stroke="transparent"/>
            <text fill="white" fontSize="15">
              <textPath href="#curve">nimbembo</textPath>
            </text>
          </svg>
          <div className="name">
            <p>POK-E-DEX</p>
            <span className="tl"><span></span></span>
            <span className="tr"><span></span></span>
            <span className="bl"><span></span></span>
            <span className="br"><span></span></span>
          </div>
          <div className="main">
          </div>
        </div>
      </div>
    </>
  )
}

export default Main
