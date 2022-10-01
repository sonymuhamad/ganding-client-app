import { useRef } from "react";
import useScrollSpy from 'react-use-scrollspy'


export const useSectionProduct = () => {

    const sectionRefs = [
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


