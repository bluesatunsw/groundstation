// Navbar.tsx
// Inital design from Dasiy UI but then added icons and theme changes by me
// William Papantoniou

import React, { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

interface SideBarProps {
  onFindId?: () => void
  onCalcEn: () => void
  setTargetModal: (b: boolean) => void
  setWhatsUpModal: (b: boolean) => void
}

const NavBar = ({ setWhatsUpModal, onFindId, onCalcEn, setTargetModal }: SideBarProps) => {
  // use theme from local storage if available or set light theme
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'corporate')

  // update state on toggle
  const handleToggle = (e: any) => {
    if (e.target.checked) {
      setTheme('dark')
    } else {
      setTheme('corporate')
    }
  }

  // set theme state in localstorage on mount & also update localstorage on state change
  useEffect(() => {
    if (theme) localStorage.setItem('theme', theme)
    const localTheme = localStorage.getItem('theme')
    if (localTheme)
      // add custom data-theme attribute to html tag required to update theme using DaisyUI
      document.querySelector('html')?.setAttribute('data-theme', localTheme)
  }, [theme])

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <img src={require('./1Asset 1.png')} alt="BluesatLogo" className="w-10" />
        <a href="/" className="btn btn-ghost text-xl normal-case">
          Bluesat Ground Station
        </a>
      </div>
      <div className="flex-none">
        <button
          className="btn btn-ghost text-lg normal-case"
          onClick={(e) => {
            setWhatsUpModal(true)
          }}
        >
          What's Up
        </button>
        <button
          className="btn btn-ghost text-lg normal-case"
          onClick={(e) => {
            setTargetModal(true)
          }}
        >
          Find by ID
        </button>
        <button className="btn btn-ghost text-lg normal-case" onClick={onCalcEn}>
          Calculate Encounter
        </button>
        <button className="btn btn-square btn-ghost">
          <label className="swap swap-rotate h-12 w-12">
            <input
              type="checkbox"
              onChange={handleToggle}
              // show toggle image based on localstorage theme
              checked={theme === 'corporate' ? false : true}
            />
            {/* light theme sun image */}
            <SunIcon className="swap-on h-8 w-8"></SunIcon>
            {/* dark theme moon image */}
            <MoonIcon className="swap-off h-8 w-8"></MoonIcon>
          </label>
        </button>
      </div>
    </div>
  )
}

export default NavBar
