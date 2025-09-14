import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12 px-8 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
        <div className="text-lg font-semibold">MoService</div>
        <p className="mt-4 md:mt-0 text-sm">
            &copy; {new Date().getFullYear()} MoService. All rights reserved.
        </p>
        </div>
    </footer>
  )
}

export default Footer