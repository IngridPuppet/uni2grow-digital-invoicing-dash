import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate("/")
    }, 3e3)
  }, [])

  return (
    <>
      <div className="fixed top-0 h-screen w-screen z-50 bg-white flex items-center justify-around">
        <div className="text-5xl text-gray-700 mb-12">
          <span className="text-gray-900 mr-2">404</span> Page not found
        </div>
      </div>
    </>
  )
}
