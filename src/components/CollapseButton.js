import React, { useRef, useState, useEffect } from 'react';
import CustomExpand from './CustomExpand';
import CustomHide from './CustomHide';

const CollapseButton = ({ children }) => {
    const buttonRef = useRef(null); // Create a ref for the button element
    const [expanded, setExpanded] = useState(true)

    const logReturn = (elem) => {
        console.log(buttonRef.current?.getAttribute("aria-expanded"));
        return elem;
    }


    const onCollapseClick = () => {
        if (buttonRef.current) {
            // Check if the ref is defined (not null)
            // You can now access the button element using buttonRef.current
            const button = buttonRef.current;

            document.body.classList.toggle("collapsed");
            
            setExpanded(!expanded);

            if(button.getAttribute("aria-expanded") === "true") {
                button.setAttribute("aria-expanded", "false");
                setExpanded(false);
            } else {
                button.setAttribute("aria-expanded", "true");
                setExpanded(true);
            }
            button.getAttribute("aria-label") === "collapse menu"
                ? button.setAttribute("aria-label", "expand menu")
                : button.setAttribute("aria-label", "collapse menu");
            }
    }

    return (
    <button ref={buttonRef} className="collapse-btn" aria-expanded="true" aria-label="collapse menu" onClick={onCollapseClick}>
            {
                expanded ?
                <CustomHide /> :
                <CustomExpand />
            }
        <span>Collapse</span>
    </button>
    )
}

export default CollapseButton;