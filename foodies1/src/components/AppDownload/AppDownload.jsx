import React from 'react'
import "./AppDownload.css"
import { assets } from '../../assets/assets'
const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
      <p>For Better Experience Download <br /> foodies App</p>
      <div className='app-download-platforms'>
        <div className="download-platforms">
          <a href="https://play.google.com/store" target="_blank" rel="noreferrer">
            <img src={assets.play_store} alt="Play Store" />
          </a>
          <a href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer">
            <img src={assets.app_store} alt="App Store" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default AppDownload