import React, { useContext } from 'react';
import { Fade } from 'react-awesome-reveal';

import { ThemeContext } from '../../contexts/ThemeContext';
import { projectsData } from '../../data/projectsData';
import ProjectDetailCard from './ProjectDetailCard/ProjectDetailCard';

import './Projects.css';

function Projects() {
    const { theme } = useContext(ThemeContext);

    return (
        <>
            {projectsData.length > 0 && (
                <div className="projects" id="projects" style={{ backgroundColor: theme.secondary }}>
                    <div className="projects--header">
                        <h1 style={{ color: theme.primary }}>Projects</h1>
                    </div>
                    <div className="projects--body">
                        <div className="projects--list">
                            {projectsData.map((project, index) => (
                                <Fade
                                    key={project.id}
                                    direction={index % 2 === 0 ? 'left' : 'right'}
                                    className="projects--reveal"
                                >
                                    <ProjectDetailCard
                                        theme={theme}
                                        name={project.projectName}
                                        desc={project.projectDesc}
                                        highlights={project.highlights}
                                        tags={project.tags}
                                        code={project.code}
                                        demo={project.demo}
                                        image={project.image}
                                        imageZoomOut={project.imageZoomOut}
                                        imageLightBg={project.imageLightBg}
                                    />
                                </Fade>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Projects;
