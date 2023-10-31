import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

interface SideBarProps {
    onFindId?: () => void;
    onCalcEn: () => void;
    setTargetModal: (b: boolean) => void;
    setWhatsUpModal: (b: boolean) => void;
  }

const NavBar = ({ setWhatsUpModal, onFindId, onCalcEn, setTargetModal }:SideBarProps) => {
  

   // use theme from local storage if available or set light theme
   const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "corporate"
  );

  // update state on toggle
  const handleToggle = (e:any) => {
    if (e.target.checked) {
      setTheme("dark");
    } else {
      setTheme("corporate");
    }
  };

  // set theme state in localstorage on mount & also update localstorage on state change
  useEffect(() => {
    if (theme)
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    if (localTheme)
    // add custom data-theme attribute to html tag required to update theme using DaisyUI
    document.querySelector("html")?.setAttribute("data-theme", localTheme);
  }, [theme]);

  return (
    <div className="navbar bg-base-200">
        <div className='flex-1'>
            <a className="btn btn-ghost normal-case text-xl">Bluesat Ground Station</a>
        </div>
        <div className="flex-none">
        <button className="btn btn-ghost normal-case text-lg" onClick={(e) => {setWhatsUpModal(true)}}>What's Up</button>
        <button className="btn btn-ghost normal-case text-lg" onClick={(e) => {setTargetModal(true) }}>Find by ID</button>
        <button className="btn btn-ghost normal-case text-lg" onClick={onCalcEn}>Calculate Encounter</button>
        <button className="btn btn-square btn-ghost">
                <label className="swap swap-rotate w-12 h-12">
                    <input
                    type="checkbox"
                    onChange={handleToggle}
                    // show toggle image based on localstorage theme
                    checked={theme === "corporate" ? false : true}
                    />
                    {/* light theme sun image */}
                    <SunIcon className="w-8 h-8 swap-on"></SunIcon>
                    {/* dark theme moon image */}
                    <MoonIcon className="w-8 h-8 swap-off"></MoonIcon>
                </label>
            </button>
            </div>
    </div>
  )
}

export default NavBar;