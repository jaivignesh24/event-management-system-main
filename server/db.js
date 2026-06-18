import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const { Pool, Client } = pg;

// Flag to track database connection status
let isDbConnected = false;

// Create configuration object for PostgreSQL
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
};

const targetDbName = process.env.DB_NAME || "event_management";

// Establish PG Pool connecting directly to our target database
export const pool = new Pool({
  ...dbConfig,
  database: targetDbName,
});

/**
 * Checks if the database is currently connected.
 */
export const isConnected = () => isDbConnected;

/**
 * Attempt to create the database if it doesn't exist.
 * This connects to the default 'postgres' database first.
 */
async function ensureDatabaseExists() {
  const defaultClient = new Client({
    ...dbConfig,
    database: "postgres", // Connect to default database
  });

  try {
    await defaultClient.connect();
    const res = await defaultClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDbName]
    );

    if (res.rowCount === 0) {
      console.log(`Database "${targetDbName}" does not exist. Creating it...`);
      // CREATE DATABASE cannot run inside a transaction block or with parameters, so we do it dynamically
      await defaultClient.query(`CREATE DATABASE ${targetDbName}`);
      console.log(`Database "${targetDbName}" created successfully.`);
    }
  } catch (err) {
    console.warn(
      `⚠️  Could not connect to PostgreSQL default database to verify/create "${targetDbName}":`,
      err.message
    );
    throw err; // Propagate to let outer block know it failed
  } finally {
    try {
      await defaultClient.end();
    } catch (e) {
      // Ignore cleanup error
    }
  }
}

/**
 * Initializes tables and seeds default data.
 */
async function initializeSchema() {
  const clubsTableSql = `
    CREATE TABLE IF NOT EXISTS clubs (
      id SERIAL PRIMARY KEY,
      club_name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT
    );
  `;

  const membersTableSql = `
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      mobile VARCHAR(50) NOT NULL,
      department VARCHAR(255) NOT NULL,
      designation VARCHAR(255),
      role VARCHAR(100) NOT NULL,
      club_id INTEGER REFERENCES clubs(id) ON DELETE SET NULL,
      status VARCHAR(50) DEFAULT 'Active',
      profile_image TEXT,
      joining_date DATE DEFAULT CURRENT_DATE,
      employee_id VARCHAR(100)
    );
  `;

  const usersTableSql = `
    CREATE TABLE IF NOT EXISTS users (
      email VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'student',
      college VARCHAR(255) DEFAULT 'Aurora Deemed to be University',
      department VARCHAR(255),
      roll_no VARCHAR(100),
      year VARCHAR(50),
      joined_clubs TEXT[] DEFAULT '{}',
      profile_picture TEXT DEFAULT '',
      phone VARCHAR(50) DEFAULT '',
      achievements TEXT[] DEFAULT '{}',
      activity_history JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const alterUsersTableSql = `
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id') THEN
        ALTER TABLE users ADD COLUMN id SERIAL;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='username') THEN
        ALTER TABLE users ADD COLUMN username VARCHAR(255) UNIQUE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='member_id') THEN
        ALTER TABLE users ADD COLUMN member_id INTEGER REFERENCES members(id) ON DELETE SET NULL;
      END IF;
    END $$;
  `;

  const eventsTableSql = `
    CREATE TABLE IF NOT EXISTS events (
      id VARCHAR(100) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      type VARCHAR(100) NOT NULL,
      description TEXT,
      date VARCHAR(50),
      time VARCHAR(50),
      venue VARCHAR(255),
      coordinator VARCHAR(255),
      student_coordinator VARCHAR(255),
      price VARCHAR(50),
      image TEXT,
      tags TEXT[] DEFAULT '{}',
      trending BOOLEAN DEFAULT false,
      total_seats INTEGER DEFAULT 100,
      rules TEXT[] DEFAULT '{}',
      prize_pool VARCHAR(100),
      requirements TEXT
    );
  `;

  const registrationsTableSql = `
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
      event_id VARCHAR(100) REFERENCES events(id) ON DELETE CASCADE,
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_email, event_id)
    );
  `;

  const feedbacksTableSql = `
    CREATE TABLE IF NOT EXISTS feedbacks (
      id SERIAL PRIMARY KEY,
      user_email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
      event_id VARCHAR(100) REFERENCES events(id) ON DELETE CASCADE,
      event_title VARCHAR(255),
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      feedback_text TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const volunteerTasksTableSql = `
    CREATE TABLE IF NOT EXISTS volunteer_tasks (
      id SERIAL PRIMARY KEY,
      volunteer_name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'volunteer',
      event_title VARCHAR(255) NOT NULL,
      task_description TEXT NOT NULL,
      shift VARCHAR(100) NOT NULL,
      status VARCHAR(50) DEFAULT 'Assigned',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const volunteerAttendanceTableSql = `
    CREATE TABLE IF NOT EXISTS volunteer_attendance (
      id SERIAL PRIMARY KEY,
      volunteer_name VARCHAR(255) NOT NULL,
      event_title VARCHAR(255) NOT NULL,
      shift VARCHAR(100) NOT NULL,
      date VARCHAR(50) NOT NULL,
      check_in_time VARCHAR(50) NOT NULL,
      check_out_time VARCHAR(50),
      status VARCHAR(50) DEFAULT 'Present',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const volunteerRatingsTableSql = `
    CREATE TABLE IF NOT EXISTS volunteer_ratings (
      id SERIAL PRIMARY KEY,
      volunteer_name VARCHAR(255) UNIQUE NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      feedback TEXT,
      rated_by VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const volunteerMessagesTableSql = `
    CREATE TABLE IF NOT EXISTS volunteer_messages (
      id SERIAL PRIMARY KEY,
      sender_name VARCHAR(255) NOT NULL,
      sender_email VARCHAR(255) NOT NULL,
      club_id INTEGER NOT NULL,
      club_name VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      timestamp VARCHAR(100) NOT NULL,
      reply TEXT,
      replied_at VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create tables sequentially
  await pool.query(clubsTableSql);
  await pool.query(membersTableSql);
  await pool.query(usersTableSql);
  await pool.query(alterUsersTableSql);
  await pool.query(eventsTableSql);
  await pool.query(registrationsTableSql);
  await pool.query(feedbacksTableSql);
  await pool.query(volunteerTasksTableSql);
  await pool.query(volunteerAttendanceTableSql);
  await pool.query(volunteerRatingsTableSql);
  await pool.query(volunteerMessagesTableSql);
  console.log("Database tables verified/created successfully.");

  // Check if seeding is required for clubs
  const clubCheck = await pool.query("SELECT COUNT(*) FROM clubs");
  if (parseInt(clubCheck.rows[0].count) === 0) {
    console.log("Seeding default clubs...");
    const defaultClubs = [
      { name: "Turing Coding Club", description: "The premier competitive programming, web development, and artificial intelligence community. Host of national hackathons and weekly algorithms sessions." },
      { name: "Tesla Robotics Club", description: "Where hardware meets artificial intelligence. We design mechanical bots, drone networks, and state-of-the-art automated rovers for national championships." },
      { name: "Mudras Dance Club", description: "Celebrating classical bharatanatyam, modern bollywood, and heavy hip-hop fusion choreography. We lead coordinates for all premium college fest openers." },
      { name: "Symphony Music Club", description: "Home to traditional Indian carnatic vocalists, heavy metal bands, and pop fusion artists. Hosts of battle of bands and open-air acoustics nights." },
      { name: "Spandan Cultural Society", description: "Representing drama, poetry, fine-arts, and high-fashion modeling groups. We manage the visual aesthetics and coordination of the grand Aura fest." },
      { name: "Gladiators Sports Club", description: "Promoting competitive cricket, football, basketball, and table tennis. We host Hyderabad’s prime T10 college premier leagues and indoor futsals." },
      { name: "Shutter Society", description: "The photography collective capturing fest highlights, stage performances, and campus culture in cinematic detail." }
    ];
    for (const club of defaultClubs) {
      await pool.query(
        "INSERT INTO clubs (club_name, description) VALUES ($1, $2) ON CONFLICT (club_name) DO NOTHING",
        [club.name, club.description]
      );
    }
    console.log("Default clubs seeded.");
  }

  // Check if seeding is required (no users)
  const userCheck = await pool.query("SELECT COUNT(*) FROM users");
  if (parseInt(userCheck.rows[0].count) === 0) {
    console.log("Seeding default users...");
    const studentPasswordHash = await bcrypt.hash("password", 10);
    const adminPasswordHash = await bcrypt.hash("password", 10);

    await pool.query(
      `INSERT INTO users (email, name, password, role, college, department, roll_no, year, achievements, activity_history) VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
      ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
      [
        "student@aurora.edu.in",
        "Rohit Kumar",
        studentPasswordHash,
        "student",
        "Aurora Deemed to be University",
        "Computer Science & Engineering",
        "AUR2023CSE045",
        "3rd Year",
        ["First Registration"],
        JSON.stringify([
          { id: Date.now(), text: "Account created successfully", time: new Date().toLocaleString() }
        ]),
        "admin@aurora.edu.in",
        "Jaivignesh",
        adminPasswordHash,
        "admin",
        "Aurora Deemed to be University",
        "Academic Affairs Coordinators",
        "AUR2023ADM001",
        "Faculty",
        ["Administrator Privileges"],
        JSON.stringify([
          { id: Date.now(), text: "Admin account initialized", time: new Date().toLocaleString() }
        ])
      ]
    );
    console.log("Default users seeded.");
  }

  // Check if seeding events is required
  const eventCheck = await pool.query("SELECT COUNT(*) FROM events");
  if (parseInt(eventCheck.rows[0].count) === 0) {
    console.log("Seeding default events...");

    const initialEvents = [
      {
        id: "tech-1",
        title: "Aurora Hackathon 2026",
        category: "Technical",
        type: "Hackathon",
        description: "A national 36-hour hackathon to solve real-world problems in AI, Blockchain, and Sustainability. Win cash prizes worth ₹2,50,000!",
        date: "2026-05-24",
        time: "09:00 AM onwards",
        venue: "Main Seminar Hall, CSE Block",
        coordinator: "Dr. Vivek Saini (+91 98765 43210)",
        studentCoordinator: "Rahul Sharma (+91 98765 00001)",
        price: "₹200 per team",
        image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
        tags: ["AI/ML", "Blockchain", "Cash Prizes"],
        trending: true,
        totalSeats: 120,
        rules: [
          "Teams must consist of 2-4 members from the same or different colleges.",
          "Plagiarism in code will lead to instant disqualification.",
          "Bring your own laptops, extension cords, and sleeping bags.",
          "Final presentation must include a working prototype."
        ],
        prizePool: "₹2,50,000",
        requirements: "Laptops, Student ID, GitHub account"
      },
      {
        id: "tech-2",
        title: "Robo-Wars: Clash of Titans",
        category: "Technical",
        type: "Robotics",
        description: "Design and build bots that crush, shred, and push their opponents out of the ring. High-octane mechanical action guaranteed.",
        date: "2026-05-25",
        time: "11:00 AM",
        venue: "Mechanical Workshop Arena",
        coordinator: "Prof. Alok Mehta (+91 87654 32109)",
        studentCoordinator: "Aman Verma (+91 98765 00002)",
        price: "₹500 per bot",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        tags: ["Robotics", "Hardware", "Battle Arena"],
        trending: true,
        totalSeats: 80,
        rules: [
          "Maximum bot weight limit is 15kg.",
          "No use of liquid weapons, EMPs, or fire-based attacks.",
          "Bots must fit within a 50cm x 50cm starting box.",
          "Matches are 3 minutes long. Judges decision is final."
        ],
        prizePool: "₹1,00,000",
        requirements: "Custom-built robot, Spare parts, Safety gear"
      },
      {
        id: "tech-3",
        title: "Speed Coding Showdown",
        category: "Technical",
        type: "Coding Club",
        description: "Solve complex algorithmic challenges in the shortest time. Multiple programming languages supported. Top positions get placements!",
        date: "2026-05-24",
        time: "02:00 PM",
        venue: "Advanced CSE Lab 3",
        coordinator: "Mrs. Ruchi Jain (+91 76543 21098)",
        studentCoordinator: "Neha Gupta (+91 98765 00003)",
        price: "₹50 per head",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        tags: ["Algorithms", "Data Structures", "Competitive Coding"],
        trending: false,
        totalSeats: 100,
        rules: [
          "Individual participation only.",
          "Accessing the internet for solutions is strictly prohibited.",
          "Languages allowed: C++, Java, Python, JavaScript.",
          "Ties will be broken based on submission time."
        ],
        prizePool: "₹50,000 + PPIs",
        requirements: "Basic algorithms knowledge, HackerRank profile"
      },
      {
        id: "cult-1",
        title: "Spandan: Inter-College Group Dance",
        category: "Cultural",
        type: "Dance Club",
        description: "A spectacular showcase of Indian classical, fusion, folk, and hip-hop dance styles. Experience premium rhythm and energy!",
        date: "2026-05-25",
        time: "05:00 PM",
        venue: "Aurora Central Auditorium",
        coordinator: "Mrs. Rekha Sen (+91 65432 10987)",
        studentCoordinator: "Priya Singh (+91 98765 00004)",
        price: "₹300 per group",
        image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80",
        tags: ["Dance", "Folk/Bollywood", "Grand Trophy"],
        trending: true,
        totalSeats: 90,
        rules: [
          "Group size: 6-15 members.",
          "Time limit: 5-8 minutes per performance.",
          "Audio tracks must be submitted 2 days prior to the event.",
          "Use of hazardous props (fire, glass) is banned."
        ],
        prizePool: "₹75,000",
        requirements: "Costumes, MP3 track in pendrive, Student IDs"
      },
      {
        id: "cult-2",
        title: "Acoustics: Battle of Bands",
        category: "Cultural",
        type: "Music Club",
        description: "Rock, metal, semi-classical, and acoustic bands battle it out on stage for the ultimate bragging rights and custom band setups.",
        date: "2026-05-24",
        time: "04:00 PM",
        venue: "Open Air Amphitheatre",
        coordinator: "Mr. Shivam Vyas (+91 54321 09876)",
        studentCoordinator: "Karan Desai (+91 98765 00005)",
        price: "₹400 per band",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
        tags: ["Live Music", "Rock & Fusion", "Cash Prizes"],
        trending: true,
        totalSeats: 70,
        rules: [
          "Band size: 3-8 members.",
          "Performance time: 15 minutes (including soundcheck).",
          "Basic drum kit and amplifiers will be provided.",
          "Original compositions carry bonus points."
        ],
        prizePool: "₹1,00,000 + Studio Recording Session",
        requirements: "Own instruments (guitars, keyboards, etc.), Setlist"
      },
      {
        id: "cult-3",
        title: "Aurora DJ Night & EDM Fest",
        category: "Cultural",
        type: "Cultural Club",
        description: "End the grand university festival dancing to neon lights with premium live sets by international and leading Bollywood DJs!",
        date: "2026-05-26",
        time: "07:00 PM",
        venue: "Aurora Stadium Ground",
        coordinator: "Prof. T. Reddy (+91 43210 98765)",
        studentCoordinator: "Aditya Raj (+91 98765 00006)",
        price: "Free with Fest Pass",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80",
        tags: ["EDM", "DJ Night", "Laser Lights", "Epic Finale"],
        trending: true,
        totalSeats: 1400,
        rules: [
          "Entry restricted to Aurora students and registered guests only.",
          "No bags or outside food/drinks allowed inside the arena.",
          "Gate closes at 8:00 PM sharp.",
          "Follow security instructions at all times."
        ],
        prizePool: "N/A",
        requirements: "Valid Festival Pass, Valid ID Card"
      },
      {
        id: "sports-1",
        title: "Aurora Premier League (APL)",
        category: "Sports",
        type: "Cricket",
        description: "The mega inter-collegiate T10 tennis ball cricket championship. Grab your bats and aim for the boundary lines.",
        date: "2026-05-23",
        time: "08:00 AM onwards",
        venue: "Aurora Sports Complex Field A",
        coordinator: "Mr. Sunil Gavaskar (+91 32109 87654)",
        studentCoordinator: "Vikram Singh (+91 98765 00007)",
        price: "₹1000 per squad",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80",
        tags: ["Cricket", "T10 format", "Mega Trophy"],
        trending: false,
        totalSeats: 24,
        rules: [
          "Squad size: 15 players maximum.",
          "Knockout format. Matches are 10 overs per side.",
          "Umpire decision is final. No arguments allowed.",
          "Teams must report 30 mins before the scheduled toss."
        ],
        prizePool: "₹50,000 + Championship Trophy",
        requirements: "Team Kit (Whites/Color), Bats, Abdomen Guards"
      },
      {
        id: "sports-2",
        title: "Futsal Arena: 5v5 Championship",
        category: "Sports",
        type: "Football",
        description: "Fast-paced, action-packed 5v5 indoor football under state-of-the-art sports complex lights. Instant knockout matches.",
        date: "2026-05-24",
        time: "09:30 AM",
        venue: "Aurora Indoor Stadium Court 1",
        coordinator: "Mr. Rahul Roy (+91 21098 76543)",
        studentCoordinator: "Ankit Patel (+91 98765 00008)",
        price: "₹500 per team",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
        tags: ["Futsal", "Speed Play", "Knockout"],
        trending: false,
        totalSeats: 32,
        rules: [
          "5 players on court, 3 rolling substitutes.",
          "Matches consist of two 15-minute halves.",
          "No studded boots allowed on indoor courts (flat soles only).",
          "Yellow/Red card rules apply standard futsal regulations."
        ],
        prizePool: "₹30,000",
        requirements: "Team Jerseys, Indoor non-marking shoes, Shin pads"
      },
      {
        id: "work-1",
        title: "Generative AI Developer Bootcamp",
        category: "Workshops",
        type: "Workshop",
        description: "Hands-on practical training on OpenAI APIs, LangChain, and deploying custom AI LLM agents in real production networks.",
        date: "2026-05-25",
        time: "10:00 AM",
        venue: "GenAI Center of Excellence",
        coordinator: "Dr. Sandeep Nair (+91 10987 65432)",
        studentCoordinator: "Meghna Roy (+91 98765 00009)",
        price: "₹150 per head",
        image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=800&q=80",
        tags: ["ChatGPT", "LangChain", "AI Agents", "Certificates"],
        trending: true,
        totalSeats: 160,
        rules: [
          "Basic Python knowledge is expected.",
          "Bring laptops with VS Code and Python 3.10+ installed.",
          "API keys will be provided during the workshop.",
          "Certificates will be issued only upon completing the capstone project."
        ],
        prizePool: "Certification + Swags",
        requirements: "Laptop with WiFi capability"
      },
      {
        id: "work-2",
        title: "Future of Web3 & Blockchain networks",
        category: "Webinars",
        type: "Webinar",
        description: "An online global seminar discussing the shift towards decentralised cloud, Ethereum L2 networks, and future smart contracts.",
        date: "2026-05-23",
        time: "04:00 PM",
        venue: "Virtual (Zoom link provided on register)",
        coordinator: "Prof. Anjali Sen (+91 99887 76655)",
        studentCoordinator: "Rohan Mehta (+91 98765 00010)",
        price: "Free",
        image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80",
        tags: ["Web3", "Blockchain", "Ethereum", "Online"],
        trending: false,
        totalSeats: 450,
        rules: [
          "Join the Zoom link 10 minutes prior.",
          "Keep microphones muted unless permitted during Q&A.",
          "Attendance will be marked via feedback form at the end."
        ],
        prizePool: "Digital Certificates",
        requirements: "Stable Internet Connection"
      }
    ];

    for (const evt of initialEvents) {
      await pool.query(
        `INSERT INTO events (id, title, category, type, description, date, time, venue, coordinator, student_coordinator, price, image, tags, trending, total_seats, rules, prize_pool, requirements) VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          evt.id,
          evt.title,
          evt.category,
          evt.type,
          evt.description,
          evt.date,
          evt.time,
          evt.venue,
          evt.coordinator,
          evt.studentCoordinator,
          evt.price,
          evt.image,
          evt.tags,
          evt.trending,
          evt.totalSeats,
          evt.rules,
          evt.prizePool,
          evt.requirements,
        ]
      );
    }
    console.log("Default events seeded.");
  }

  // Ensure the admin user's name is updated to Jaivignesh if they are already seeded
  await pool.query("UPDATE users SET name = 'Jaivignesh' WHERE email = 'admin@aurora.edu.in'");

  // Ensure superadmin is seeded
  const superadminCheck = await pool.query("SELECT 1 FROM users WHERE email = $1", ["superadmin@aurora.edu.in"]);
  if (superadminCheck.rowCount === 0) {
    console.log("Seeding superadmin user...");
    const superadminPasswordHash = await bcrypt.hash("password", 10);
    await pool.query(
      `INSERT INTO users (email, name, password, role, college, department, roll_no, year, achievements, activity_history) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        "superadmin@aurora.edu.in",
        "Super Admin",
        superadminPasswordHash,
        "superadmin",
        "Aurora Deemed to be University",
        "Central Administration",
        "AUR2026SA001",
        "System Authority",
        ["Full System Ownership"],
        JSON.stringify([{ id: Date.now(), text: "Super Admin account initialized", time: new Date().toLocaleString() }])
      ]
    );
    console.log("Super Admin user seeded successfully.");
  }
}

/**
 * Initialize the database connection, database verification, schemas, and seeding.
 */
export async function initDb() {
  try {
    // 1. Ensure target DB exists
    await ensureDatabaseExists();

    // 2. Test pool connection to the target database
    const client = await pool.connect();
    client.release();
    isDbConnected = true;
    console.log(`📡 Connected successfully to PostgreSQL database: "${targetDbName}"`);

    // 3. Setup tables and seed defaults
    await initializeSchema();
  } catch (err) {
    isDbConnected = false;
    console.error("❌ PostgreSQL database initialization failed!");
    console.error(`Please verify that PostgreSQL is running and credentials in your .env file are correct.`);
    console.error(`Error details:`, err.message);
  }
}
