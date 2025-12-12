"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { FiDownload, FiMail, FiGithub, FiLinkedin, FiExternalLink, FiArrowRight, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';

export default function PortfolioPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Scroll animations
    const fadeSections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 100);
        }
      });
    }, { threshold: 0.1 });

    fadeSections.forEach(section => observer.observe(section));

    // Improved scroll tracking for active section
    const handleScroll = () => {
      const sections = ['home', 'experience', 'projects', 'education', 'contact'];
      const scrollPosition = window.scrollY + 100; // Add offset for better detection
      
      let currentSection = 'home';
      
      // Check which section is in view with better threshold
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          // Use 30% threshold instead of exact match
          if (scrollPosition >= offsetTop - 150 && scrollPosition < offsetTop + offsetHeight - 100) {
            currentSection = section;
            break;
          }
        }
      }
      
      // For home - if near top of page
      if (scrollPosition < 300) {
        currentSection = 'home';
      }
      
      setActiveSection(currentSection);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    // Initial check
    handleScroll();
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:ismailabrahem990719@gmail.com';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+46720380382';
  };

  const handleMapClick = () => {
    window.open('https://maps.google.com/?q=Stockholm,Sweden', '_blank');
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSubmitting(true);

    // Add timestamp as hidden input
    const now = new Date();
    const timeString = now.toLocaleString("sv-SE");
    const timeInput = document.createElement("input");
    timeInput.type = "hidden";
    timeInput.name = "time";
    timeInput.value = timeString;
    form.current.appendChild(timeInput);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form.current,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        }
      );

      setSubmitStatus("success");
      form.current.reset();
    } catch (err) {
      console.error("Failed to send:", err);
      setSubmitStatus("error");
    } finally {
      // Remove hidden input
      if (form.current && form.current.contains(timeInput)) {
        form.current.removeChild(timeInput);
      }

      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 8000);
    }
  };

  const skillsByCategory = {
    'Languages & Tools': [
      'C#', 'C++', 'PHP', 'LUA', 'JavaScript', 'TypeScript', 'HTML/CSS', 'SQL',
      'Git', 'Docker', 'Bash Scripting', 'Linux Command Line',
      'Visual Studio', 'VS Code'
    ],
    'Frontend Development': [
      'React', 'Next.js', 'Blazor', 'Responsive Design',
      'Tailwind CSS', 'CSS-in-JS'
    ],
    'Backend Development': [
      '.NET Core', 'ASP.NET', 'MVC Framework', 'Entity Framework',
      'RESTful APIs', 'Microservices', 'API Development',
      'Node.js', 'Express.js', 'Server-side Rendering'
    ],
    'Database & DevOps': [
      'MySQL', 'MariaDB', 'PostgreSQL', 'SQLite', 'MongoDB',
      'Azure', 'DevOps', 'Docker Compose', 'Linux Server Administration',
      'Ubuntu Server', 'Apache', 'CI/CD Pipelines'
    ],
    'CMS & Specializations': [
      'Umbraco CMS', 'CMS Integration', 'E-commerce',
      'Payment Integration', 'Headless CMS'
    ]
  };

  const experiences = [
    {
      company: "Freelance Developer",
      position: "Full-Stack Developer",
      period: "2025 - Present",
      description: "Building and maintaining a production Tibia private game server infrastructure that consistently achieves 99.8% uptime through Docker containerization and VPS management. The server supports over 300 registered players in MySQL/MariaDB while maintaining data security and performance. Currently serving 15+ active concurrent players who engage with both the game server (C++ backend with custom LUA scripting) and the PHP-based administration website, demonstrating full-stack system architecture skills in a live production environment.",
      logo: "/assets/experiences/exp7.png"
    },
    {
      company: "Vällingby Körakademin AB",
      position: "Full-Stack Developer",
      period: "2025 - Present",
      description: "Leading the technical development of a comprehensive driving school platform that has increased customer acquisition by 150% through improved digital presence and accessibility. Built with Next.js and .NET Core, the platform allows potential students to easily discover courses, view schedules, and access information - with upcoming Stripe payment integration designed to streamline course purchases. The custom-built student management dashboard has reduced administrative workload by 50% through automation, while real-time notifications keep students engaged throughout their learning journey.",
      logo: "/assets/experiences/exp1.png"
    },
    {
      company: "Carelyo Inc.",
      position: "Back-end Developer",
      period: "2024-2025",
      description: "Implemented a secure payment infrastructure using Stripe that successfully processed hundreds of monthly transactions for the eHealth platform. Developed robust authentication systems with bearer tokens that maintain 99.9% uptime while ensuring data security and PCI compliance. The optimized checkout process and webhook handling significantly improved transaction success rates, providing patients with reliable payment options for their healthcare services.",
      logo: "/assets/experiences/exp2.png"
    },
    {
      company: "Freelance Developer",
      position: "Full-stack Developer",
      period: "2024-2025",
      description: "Developed and launched GeekApp and Spelsida as passion projects that demonstrate full-stack development capabilities while serving as practical tools for personal use. GeekApp functions as a custom media database that allows me to track and organize films, series, and content without depending on external platforms. Similarly, Spelsida serves as a gaming database where I can catalog and review games using my own curated system. Both projects showcase my expertise with modern frameworks and provide hands-on experience that I utilize daily, turning technical learning into functional applications.",
      logo: "/assets/experiences/exp3.png"
    },
    {
      company: "Rapid Säkerhet AB",
      position: "Security Guard",
      period: "2023 - 2025",
      description: "Ensured comprehensive security across multiple client sites by monitoring advanced security systems and implementing systematic patrol patterns. Maintained perfect compliance records with zero security breaches, while developing meticulous documentation skills that transferred well to technical environments. This experience built strong foundations in systematic thinking, attention to detail, and reliability - qualities that directly translate to software development and production environment management.",
      logo: "/assets/experiences/exp4.png"
    },
    {
    company: "PostNord AB",
    position: "Delivery Driver",
    period: "2022 - 2023",
    description: "Delivered 150+ packages daily across Stockholm, maintaining tight schedules and direct customer interactions. I became skilled at route optimization—finding faster ways through traffic and residential areas, which cut average delivery times by 15 minutes per route. Keeping packages organized and ensuring everything reached the right address built my attention to detail. This hands-on logistics experience taught me how to work efficiently under pressure, a mindset I now apply to writing clean, performant code.",
    logo: "/assets/experiences/exp5.png"
},
{
      company: "Randstad AB",
      position: "Video Coding Specialist",
      period: "2017 - 2022",
      description: "Processed thousands of package images with precision, developing exceptional attention to detail and systematic workflow management. Administered customs declarations with 100% accuracy, building skills in data management and regulatory compliance. This experience established a strong foundation in meticulous data handling and process optimization that directly applies to database management and quality assurance in software development.",
      logo: "/assets/experiences/exp6.png"
    }
  ];

  const projects = [
    {
      title: "Custom Tibia Server",
      description: "Complete game hosting solution featuring C++ server backend, LUA scripting engine, and PHP-based administrative interface. Containerized with Docker for service isolation, utilizing MySQL/MariaDB with phpMyAdmin, and deployed on Ubuntu Linux server.",
      technologies: ["C++", "LUA", "PHP", "Docker", "MySQL/MariaDB", "phpMyAdmin", "Linux", "Ubuntu"],
      image: "/assets/projects/project6.jpg",
      link: "https://tibia.swev.se/"
    },
    {
      title: "E-Commerce Dashboard",
      description: "Full-stack e-commerce platform with React/Next.js frontend and .NET backend. Features admin dashboard with CRUD operations, shopping cart, checkout system, payment integration, user authentication, and coupon management.",
      technologies: ["Next.js", "TypeScript", "ASP.NET", "SQLite", "Entity Framework", "CRUD", "API"],
      image: "/assets/projects/project5.jpg",
      link: "https://github.com/Ismail-Abrahem/E-Commerce-Dashboard"
    },
    {
      title: "Vällingby Körakademin AB",
      description: "Full-stack driving school platform with Next.js frontend and ASP.NET backend. Features responsive design, course management system, and upcoming payment & schedule system.",
      technologies: ["Next.js", "TypeScript", "ASP.NET", "MongoDB", "Tailwind CSS"],
      image: "/assets/projects/project1.jpg",
      link: "https://vällingbykörakademin.se"
    },
    {
      title: "Stripe Payment Integration",
      description: "Secure payment processing system using Stripe. Implemented bearer token authentication, webhook handling, checkout flows, and PCI-compliant transaction management.",
      technologies: ["ASP.NET", "Stripe API", "Docker", "MongoDB", "JWT Authentication"],
      image: "/assets/projects/project2.jpg",
      link: "https://github.com/ismail-abrahem/StripeFunction"
    },
    {
      title: "GeekApp (Media Database)",
      description: "Full-stack media tracking platform with content discovery features. Built RESTful APIs, user collection management, and responsive frontend implementation.",
      technologies: ["ASP.NET", "MongoDB", "JavaScript", "REST API", "Responsive Design"],
      image: "/assets/projects/project3.jpg",
      link: "https://github.com/Ismail-Abrahem/GeekApp"
    },
    {
      title: "Spelsida (Gaming Database)",
      description: "CMS-driven gaming database built with Umbraco. Features custom API integrations, content management system, and dynamic frontend rendering.",
      technologies: ["Umbraco CMS", "ASP.NET", "JavaScript", "API Integration"],
      image: "/assets/projects/project4.jpg",
      link: "https://github.com/Ismail-Abrahem/UmbracoGame"
    }
  ];

  const education = [
    {
      institution: "Nackademin Yrkeshögskola",
      degree: "Web Developer .NET with CMS Specialization",
      period: "2023 - 2025",
      description: "Comprehensive .NET development program focusing on web applications, e-commerce systems, and Content Management Systems. Gained expertise in Microsoft .NET platform, RESTful APIs, responsive design, and modern web development practices. Completed industry-relevant LIA internship with hands-on experience in professional development environments.",
      image: "/assets/educations/education1.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border py-2">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">
        {/* Logo/Name */}
        <button 
          onClick={() => {
            setActiveSection('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          Ismail Abrahem
        </button>
        
        {/* Right side container */}
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {['home', 'experience', 'projects', 'education', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section);
                  if (section === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    document.getElementById(section)?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
                className={`relative px-3 py-1.5 rounded-lg transition-all duration-300 font-medium text-sm ${
                  activeSection === section
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
                {activeSection === section && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-primary rounded-full"></span>
                )}
              </button>
            ))}
          </div>
          
          {/* Mobile Navigation - Dropdown (comes before theme toggle) */}
          <div className="md:hidden flex items-center gap-2">
            <select 
              value={activeSection}
              onChange={(e) => {
                const value = e.target.value;
                setActiveSection(value);
                if (value === 'home') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  document.getElementById(value)?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
              className="w-32 p-1.5 rounded-lg bg-card border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="home">Home</option>
              <option value="experience">Experience</option>
              <option value="projects">Projects</option>
              <option value="education">Education</option>
              <option value="contact">Contact</option>
            </select>
          </div>
          
          {/* Theme Toggle - Always on far right (after everything else) */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
                <div className={`w-12 h-6 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-400'} rounded-full transition-colors duration-300`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-300 ${isDarkMode ? 'transform translate-x-6' : ''}`}>
                  {isDarkMode ? (
                    <span className="text-[10px]">🌙</span>
                  ) : (
                    <span className="text-[10px]">☀️</span>
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </nav>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Wider */}
        <aside className="lg:col-span-1 space-y-8 lg:sticky lg:top-8 lg:h-fit">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-8 shadow-2xl border border-border hover-lift"
          >
            <div className="text-center">
              <div className="w-44 h-44 mx-auto mb-6 rounded-2xl overflow-hidden border-4 border-primary/20 glow-animation relative">
                <Image
                  src="/assets/profile/profile1.jpg"
                  alt="Profile"
                  fill
                  priority
                  fetchPriority="high"
                  className="object-cover transform hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 176px"
                />
              </div>

              <div className="flex items-center justify-center mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm text-green-600 font-semibold">Available for work</span>
              </div>

              <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
                Ismail Abrahem
              </h1>

              <div className="flex justify-center space-x-5 mb-6">
                <a href="https://linkedin.com/in/ismail-abrahem-60870b291" className="text-muted-foreground hover:text-primary p-3 rounded-full bg-secondary hover:bg-primary/10 hover-lift">
                  <FiLinkedin size={22} />
                </a>
                <a href="https://github.com/Ismail-Abrahem" className="text-muted-foreground hover:text-primary p-3 rounded-full bg-secondary hover:bg-primary/10 hover-lift">
                  <FiGithub size={22} />
                </a>
                <a href="https://www.vällingbykörakademin.se/" className="text-muted-foreground hover:text-primary p-3 rounded-full bg-secondary hover:bg-primary/10 hover-lift">
                  <FiGlobe size={22} />
                </a>
              </div>

              {/* Languages */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-lg">Languages</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Swedish', 'English', 'Arabic'].map((lang) => (
                    <span key={lang} className="language-item px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-md cursor-default hover-lift bg-secondary text-secondary-foreground">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => window.open('/certifications/CV.pdf', '_blank')}
                  className="btn-primary w-full py-3 px-6 rounded-xl flex items-center justify-center gap-3 shadow-sm hover-lift hover:shadow-md font-medium hover:border-primary/50 hover:bg-primary/10"
                >
                  <FiDownload size={18} />
                  Download CV
                </button>
                <button
                  onClick={handleEmailClick}
                  className="btn-primary w-full py-3 px-6 rounded-xl flex items-center justify-center gap-3 shadow-sm hover-lift hover:shadow-md font-medium hover:border-primary/50 hover:bg-primary/10"
                >
                  Contact Me
                </button>
              </div>
            </div>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            id="skills-sidebar"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 shadow-2xl border border-border hover-lift"
          >
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Skills & Technologies
            </h2>

            <div className="space-y-6">
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-lg text-foreground mb-2">{category}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="skill-item px-4 py-3 rounded-lg text-sm text-center font-medium cursor-default bg-secondary text-secondary-foreground shadow-sm hover:shadow-md transition-all min-h-[3rem] flex items-center justify-center"
                        title={skill}
                      >
                        <span className="line-clamp-2">{skill}</span>
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Main Content - Right side */}
        <main className="lg:col-span-3 space-y-12">
          {/* Hero Section */}
          <section
            id="home"
            ref={(el) => {
              sectionsRef.current[0] = el;
            }}
            className="fade-in-section"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Full Stack Developer
              </h1>
              <h3 className="text-xl text-muted-foreground mb-6 font-light float-animation">
                Crafting digital experiences with modern technologies
              </h3>
              <p className="text-lg leading-relaxed max-w-2xl mx-auto text-foreground/90">
                Full-stack developer with 2 years of experience specializing in C#, .NET, and modern web technologies. 
                Built scalable applications including game server infrastructure with C++/LUA/PHP and production-ready 
                web platforms using React, Next.js, and ASP.NET. Passionate about clean architecture, performance 
                optimization, and creating intuitive user experiences.
              </p>
            </div>
          </section>

          {/* Experience */}
          <section
            id="experience"
            ref={(el) => { sectionsRef.current[1] = el; }}
            className="fade-in-section"
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent typewriter">Experience</h2>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 shadow-2xl border border-border hover-lift group"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden relative shrink-0">
                      <Image
                        src={exp.logo}
                        alt={exp.company}
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center text-white font-bold text-sm absolute inset-0';
                          fallback.textContent = exp.company.split(' ').map(word => word[0]).join('').toUpperCase();
                          if (target.parentNode) {
                            target.parentNode.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 w-full min-w-0">
                      <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                        {exp.position}
                      </h3>
                      <p className="text-primary font-medium text-lg mb-2">{exp.company}</p>
                      <p className="text-muted-foreground text-sm mb-4 font-medium">{exp.period}</p>
                      <p className="text-foreground/90 leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Projects - 2 per row */}
          <section
            id="projects"
            ref={(el) => {
              sectionsRef.current[2] = el;
            }}
            className="fade-in-section"
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-2xl border border-border hover-lift group"
                >
                  <div className="project-image-container bg-gradient-to-br from-secondary to-secondary/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-80 transition-opacity duration-300 flex items-end justify-end p-4 z-10">
  <a
    href={project.link}
    className="bg-primary text-primary-foreground p-2 rounded-full hover:scale-110 transition-transform duration-300 shadow-lg z-20"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FiExternalLink size={18} />
  </a>
</div>
                    <div className="w-full h-full relative">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                          const fallback = target.nextSibling as HTMLElement;
                          if (fallback && fallback.style) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center absolute inset-0 bg-secondary">
                        Project Image
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-badge px-3 py-1 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href={project.link}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project <FiArrowRight />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section
            id="education"
            ref={(el) => { sectionsRef.current[3] = el; }}
            className="fade-in-section"
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent typewriter">Education</h2>
            <div className="grid grid-cols-1 gap-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 shadow-2xl border border-border hover-lift group"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0 relative">
                      <Image
                        src={edu.image}
                        alt={`${edu.institution} logo`}
                        fill
                        className="object-cover"
                        sizes="56px"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center text-2xl absolute inset-0';
                          fallback.textContent = '🎓';
                          if (target.parentNode) {
                            target.parentNode.appendChild(fallback);
                          }
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                        {edu.degree}
                      </h3>
                      <p className="text-primary font-medium text-lg mb-3">{edu.institution}</p>
                      <p className="text-muted-foreground text-sm mb-4 font-medium">{edu.period}</p>
                      <p className="text-foreground/90 leading-relaxed mb-6">{edu.description}</p>

                      {/* Certification Download Button */}
                      <button
                        onClick={() => window.open('/certifications/Examensbevis.pdf', '_blank')}
                        className="btn-primary w-full py-3 px-6 rounded-xl flex items-center justify-center gap-3 shadow-sm hover-lift hover:shadow-md font-medium hover:border-primary/50 hover:bg-primary/10"
                      >
                        <FiDownload size={16} />
                        View Certification
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section
            id="contact"
            ref={(el) => { sectionsRef.current[4] = el; }}
            className="fade-in-section bg-card rounded-2xl p-8 shadow-2xl border border-border"
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent typewriter">Get In Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {/* Email Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={handleEmailClick}
                    className="contact-card bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-4 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                        <FiMail size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          ismailabrahem990719@gmail.com
                        </p>
                        <p className="text-sm text-muted-foreground">Email</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Phone Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={handlePhoneClick}
                    className="contact-card bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-4 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                        <FiPhone size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          +46 720 380 382
                        </p>
                        <p className="text-sm text-muted-foreground">Phone</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Location Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={handleMapClick}
                    className="contact-card bg-gradient-to-br from-card to-card/80 border border-border rounded-xl p-4 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                        <FiMapPin size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          Stockholm, Sweden
                        </p>
                        <p className="text-sm text-muted-foreground">Location</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
                <form ref={form} onSubmit={sendEmail} className="space-y-4">
                  <input
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3 px-6 rounded-xl flex items-center justify-center gap-3 shadow-sm hover-lift hover:shadow-md font-medium hover:border-primary/50 hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                      Thank you for your message! I will get back to you soon.
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                      Something went wrong. Please try again later.
                    </div>
                  )}
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <p>© {new Date().getFullYear()} Ismail Abrahem. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                className="footer__link-button"
                onClick={() => {
                  const cc = (window as unknown as { cookieconsent?: { openPreferencesCenter?: () => void } }).cookieconsent;
                  cc?.openPreferencesCenter?.();
                }}
              >
                CookieConsent
              </button>
            </div>
            <div className="flex justify-center mt-4 space-x-5">
              <a href="https://linkedin.com/in/ismail-abrahem-60870b291" className="text-muted-foreground hover:text-primary p-3 rounded-full bg-secondary hover:bg-primary/10 hover-lift">
                <FiLinkedin size={22} />
              </a>
              <a href="https://github.com/Ismail-Abrahem" className="text-muted-foreground hover:text-primary p-3 rounded-full bg-secondary hover:bg-primary/10 hover-lift">
                <FiGithub size={22} />
              </a>
              <a href="https://www.vällingbykörakademin.se/" className="text-muted-foreground hover:text-primary p-3 rounded-full bg-secondary hover:bg-primary/10 hover-lift">
                <FiGlobe size={22} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}