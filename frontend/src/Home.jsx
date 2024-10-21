import React from 'react'
import './App.css'
import b from './assets/bg.jpg'
function Home() {
  return (
  <>
  <hr />
  <div className='h-bg'>
<br></br>

    <div className='h-font'>
        Welcome to Rooster<br />
    </div>
    <div className='q-f'>
      
      A restaurant is a place <br />
where you can sit down and relax,<br />
             and 
    let someone else do the <br />
       cooking for you.<br/>
       A great restaurant is one that <br/>
       just makes you feel like you're not <br/>
       sure whether you went out or you <br/>
       came home and confuses you. <br/>
       If it can do both of those<br/>
      things at the same time, <br/>
      you're hooked.<br/>
      
    </div>
    {/* <div className='s-f'>
      Traditional Kudil Restaurant
    </div> */}
    </div>
    {/* <img src={b} width={1100} height={300} alt='nope' /> */}
    <hr />
    <div className='s-f'>
      Traditional Kudil Restaurant
    </div>
    <hr />
    <div className='bb-container'>
    <img src={b} width={1000} height={300} alt='nope' className='bbg' />
    </div>
    </>
  )
}

export default Home