const FEED_DATA = {
  scholarships: [
    {
      id: "s1",
      title: "Google Generation Scholarship",
      organization: "Google",
      deadline: "2026-09-15",
      description: "Established to help aspiring computer scientists excel in technology and become leaders in the field. Award: $2,500 USD.",
      link: "https://buildyourfuture.withgoogle.com/scholarships",
      badge: "Tech"
    },
    {
      id: "s2",
      title: "DecodeLabs Innovators Grant",
      organization: "DecodeLabs",
      deadline: "2026-10-01",
      description: "Supporting students working on open source productivity tools and developer education projects. Award: $1,500 USD.",
      link: "https://decodelabs.org/scholarship",
      badge: "Open Source"
    },
    {
      id: "s3",
      title: "Women in STEM Academic Scholarship",
      organization: "Adobe",
      deadline: "2026-11-10",
      description: "Aimed at helping female students pursue undergraduate degrees in computer science and technology. Award: $5,000 USD.",
      link: "https://www.adobe.com/university-relations",
      badge: "STEM"
    }
  ],
  hackathons: [
    {
      id: "h1",
      title: "SpaceApps Hackathon 2026",
      organization: "NASA",
      deadline: "2026-10-05",
      description: "The world's largest global hackathon. Solve real challenges on Earth and in space using open data.",
      link: "https://www.spaceappschallenge.org/",
      badge: "Global"
    },
    {
      id: "h2",
      title: "EduVerse Creator Sprint",
      organization: "EduVerse Dev Team",
      deadline: "2026-11-20",
      description: "Build next-generation widgets or AI helpers for the EduVerse productivity dashboard. Prizes total $3,000.",
      link: "#",
      badge: "EduTech"
    },
    {
      id: "h3",
      title: "HackMIT 2026",
      organization: "MIT",
      deadline: "2026-09-08",
      description: "MIT's premier annual student hackathon, welcoming 1,000+ students from around the world to build creative tech.",
      link: "https://hackmit.org",
      badge: "Elite"
    }
  ],
  internships: [
    {
      id: "i1",
      title: "Software Engineering Intern (Summer 2027)",
      organization: "Microsoft",
      deadline: "2026-10-15",
      description: "Work on Azure core services, Windows development, or office productivity integrations. Relocation included.",
      link: "https://careers.microsoft.com",
      badge: "Big Tech"
    },
    {
      id: "i2",
      title: "Frontend Engineering Intern (Remote)",
      organization: "Notion",
      deadline: "2026-11-30",
      description: "Join the desktop editor core engineering squad. Experience in design systems and clean animations preferred.",
      link: "https://notion.so/careers",
      badge: "Product Startup"
    },
    {
      id: "i3",
      title: "UI/UX Designer Intern",
      organization: "Figma",
      deadline: "2026-12-05",
      description: "Collaborate with product designers to map user flows, build prototypes, and define the future of UI design tools.",
      link: "https://figma.com/careers",
      badge: "UI/UX"
    }
  ],
  contests: [
    {
      id: "c1",
      title: "ICPC Regional Contest 2026",
      organization: "ICPC Foundation",
      deadline: "2026-10-12",
      description: "The premier global algorithmic programming contest for college students. Forms university representative teams.",
      link: "https://icpc.global",
      badge: "Competitive Coding"
    },
    {
      id: "c2",
      title: "Codeforces Round #1042 (Div 2)",
      organization: "Codeforces",
      deadline: "2026-07-02",
      description: "2-hour virtual competitive programming contest. Standard rating changes and algorithmic puzzle solving.",
      link: "https://codeforces.com",
      badge: "Bi-Weekly"
    },
    {
      id: "c3",
      title: "LeetCode Weekly Contest 498",
      organization: "LeetCode",
      deadline: "2026-07-05",
      description: "Solve 4 algorithm problems in 90 minutes. Earn coins and global ranking points.",
      link: "https://leetcode.com/contest",
      badge: "Weekly"
    }
  ],
  news: [
    {
      id: "n1",
      title: "OpenAI Announces New Student GPT Framework",
      organization: "TechNews",
      deadline: "2026-06-25",
      description: "A free development tier for student researchers that offers direct API tokens and fine-tuning privileges.",
      link: "https://openai.com",
      badge: "Tech News"
    },
    {
      id: "n2",
      title: "GitHub Universe 2026 Tickets Available for Students",
      organization: "GitHub Education",
      deadline: "2026-09-01",
      description: "Students with an active GitHub Student Developer Pack can apply for a 100% discount on in-person and digital tickets.",
      link: "https://education.github.com",
      badge: "Developer Pack"
    }
  ]
};

const getFeed = async (req, res) => {
  try {
    const category = req.query.category || "all";
    
    if (category === "all") {
      res.json(FEED_DATA);
    } else if (FEED_DATA[category]) {
      res.json(FEED_DATA[category]);
    } else {
      res.status(400).json({ message: "Invalid category. Select from scholarships, hackathons, internships, contests, news." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to load Student Feed data", error: error.message });
  }
};

module.exports = {
  getFeed,
};
