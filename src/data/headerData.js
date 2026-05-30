import resume from '../assets/pdf/Resume.pdf'
import pic from '../assets/png/Resume.jpeg'

export const headerData = {
    name: 'Vignesh M',
    title: 'Software Engineer',
    description:
        'Full-Stack Developer with 4+ years of experience building scalable, responsive web applications. I focus on clean code, smooth user experiences, and reliable production delivery. Quick learner with a collaborative mindset and Agile workflow experience.',
    image: pic,
    resumePdf: resume,
}

// Legacy typo kept for any external references
headerData.desciption = headerData.description;
