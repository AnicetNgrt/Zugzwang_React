import { useState, useRef, useEffect } from "react";

export default function handleClicked(initialIsClicked: any) {
    const [isComponentClicked, setIsComponentClicked] = useState(initialIsClicked);
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: Event) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsComponentClicked(false);
        } else if(ref.current) {
            setIsComponentClicked(true);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            //document.removeEventListener('keydown', handleHideDropdown, true);
            document.removeEventListener('click', handleClickOutside, true);
        };
    });

    return { ref, isComponentClicked, setIsComponentClicked };
}