import { useRef } from "react";
import useScrollSpy from 'react-use-scrollspy'
import { sectionStyle } from "../services/styles"

export const useSection = () => {

    const { classes } = sectionStyle()

    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
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
        activeSection,
        classes
    }

}


