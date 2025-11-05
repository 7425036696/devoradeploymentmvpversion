import React, { useEffect } from 'react'
function useScroll(threshhold = 10) {
    const [isScroll, setIsScrolled] = React.useState(false)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > threshhold) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [threshhold])
    return isScroll
}

export default useScroll
