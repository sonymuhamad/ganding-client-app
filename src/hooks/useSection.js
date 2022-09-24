import React, { useRef } from "react";
import useScrollSpy from 'react-use-scrollspy'


export const useSection = () => {

    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ]

    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -80
    })

    return {
        sectionRefs,
        activeSection
    }

}


