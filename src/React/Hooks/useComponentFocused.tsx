import { useState, useRef, useEffect } from "react";

export default function useComponentFocused(initialIsFocused: any) {
    const [isComponentFocused, setIsComponentFocused] = useState(initialIsFocused);
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: Event) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsComponentFocused(false);
        } else if(ref.current) {
            setIsComponentFocused(true);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            //document.removeEventListener('keydown', handleHideDropdown, true);
            document.removeEventListener('click', handleClickOutside, true);
        };
    });

    return { ref, isComponentFocused, setIsComponentFocused };
}