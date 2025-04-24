import React from 'react';
import pythonLogo from '../assets/python.png';
import cybersecurityImage from '../assets/cyber-security.png';
import dataScienceImage from '../assets/data.png';
import cloudComputingImage from '../assets/img.png';
import '../style/Courses.css';

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Programming",
      description: "Python, JavaScript, Web Dev",
      image: pythonLogo,
      skills: ["Python", "JS", "Web", "Mobile"],
      color: "#3498db"
    },
    {
      id: 2,
      title: "Cybersecurity",
      description: "Network security & hacking",
      image: cybersecurityImage,
      skills: ["Security", "Hacking", "Encryption"],
      color: "#e74c3c"
    },
    {
      id: 3,
      title: "Data Science",
      description: "ML & big data tools",
      image: dataScienceImage,
      skills: ["ML", "Hadoop", "Analysis"],
      color: "#9b59b6"
    },
    {
      id: 4,
      title: "Cloud",
      description: "AWS, Azure, GCP",
      image: cloudComputingImage,
      skills: ["AWS", "Azure", "DevOps"],
      color: "#f39c12"
    }
  ];

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1 className="courses-title">Our Training Programs</h1>
        <p className="courses-subtitle">Explore the most in-demand tech courses</p>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <img src={course.image} alt={course.title} className="course-image" />
            <h3 className="course-title">{course.title}</h3>
            <p className="course-description">{course.description}</p>
            <div className="skills-list">
              {course.skills.map((skill, i) => (
                <span
                  key={i}
                  className="skill-tag"
                  style={{
                    backgroundColor: `${course.color}20`,
                    color: course.color
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
