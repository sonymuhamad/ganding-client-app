import React, { useMemo } from "react";

import BaseAside from "./BaseAside";
import { useSection } from "../../hooks";
import BreadCrumb from "../BreadCrumb";
import { Title, Divider } from "@mantine/core";


const BaseContent = ({ links, breadcrumb, contents }) => {


    const { classes, activeSection, sectionRefs } = useSection()

    const contentList = useMemo(() => {

        return contents.map((content, index) => {

            const { description, component } = content

            return (
                <section id={`${links[index].link}`} key={index} className={classes.section} ref={sectionRefs[index]} >
                    <Title className={classes.title} >
                        <a href={`#${links[index].link}`} className={classes.a_href} >
                            {links[index].label}
                        </a>
                    </Title>
                    <p>
                        {description}
                    </p>

                    <Divider my='md'></Divider>

                    {component}

                </section>
            )

        })

    }, [classes, links, sectionRefs, contents])


    return (
        <>
            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            {contentList}

        </>
    )
}


export default BaseContent