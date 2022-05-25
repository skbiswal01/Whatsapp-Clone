import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";
const Loading = () => {
  return (
    <center style={{display:'grid', placeItems:'center', height:'100vh'}}>
      <div>
        <img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" style={{marginBottom:10}} height={200} alt="" />
      </div>
      <ClipLoader color="#3CBC28" size={60}/>
    </center>
  )
}

export default Loading