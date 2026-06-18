import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initDb, pool, isConnected } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

// Helper to send registration email
async function sendCredentialsEmail({ email, name, clubName, role, username, password }) {
  const loginUrl = "http://localhost:5173/login";
  const emailSubject = `Welcome to ${clubName} - Your Login Credentials`;
  const emailText = `Dear ${name},

You have been successfully assigned the role of "${role}" for "${clubName}".

Here are your temporary login credentials:
- Username: ${username}
- Temporary Password: ${password}

Please log in at: ${loginUrl}
Note: You are advised to change your password after logging in for the first time.

Best regards,
Aurora Campus Administration`;

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
      <h2 style="color: #6b21a8; text-align: center; margin-bottom: 24px;">Aurora Event Management Portal</h2>
      <p style="font-size: 16px; color: #1e293b; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">You have been assigned the role of <strong>${role}</strong> for the campus club <strong>${clubName}</strong>.</p>
      
      <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 16px; margin: 24px 0;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 14px;">Your Temporary Login Credentials</h3>
        <p style="margin: 8px 0; font-size: 14px; color: #334155;"><strong>Username:</strong> <code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${username}</code></p>
        <p style="margin: 8px 0; font-size: 14px; color: #334155;"><strong>Temporary Password:</strong> <code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${password}</code></p>
        <p style="margin: 8px 0; font-size: 14px; color: #334155;"><strong>Login URL:</strong> <a href="${loginUrl}" style="color: #2563eb; text-decoration: none;">${loginUrl}</a></p>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.6;"><strong>Security Tip:</strong> For security reasons, please update your temporary password immediately upon your first login.</p>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
      <p style="font-size: 12px; text-align: center; color: #94a3b8;">This is an automated administrative notification. Please do not reply to this email.</p>
    </div>
  `;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      await transporter.sendMail({
        from: `"Aurora Campus Administration" <${process.env.SMTP_USER}>`,
        to: email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
      console.log(`Email sent successfully to ${email}`);
      return { success: true };
    } catch (err) {
      console.error("Failed to send email via SMTP, falling back to logging:", err);
    }
  }

  const logMessage = `
========================================
[EMAIL NOTIFICATION DETECTED]
Timestamp: ${new Date().toLocaleString()}
To: ${email} (${name})
Club: ${clubName}
Role: ${role}
Username: ${username}
Temporary Password: ${password}
Subject: ${emailSubject}
Body:
${emailText}
========================================
`;
  console.log(logMessage);
  try {
    const logFilePath = path.join(__dirname, "sent_emails.log");
    fs.appendFileSync(logFilePath, logMessage, "utf8");
    console.log(`Saved email log to ${logFilePath}`);
  } catch (fsErr) {
    console.error("Failed to write email log to file:", fsErr);
  }
  return { success: true, logged: true };
}

function generateUsername(fullName) {
  let base = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, ".");
  return base || "user." + Math.floor(Math.random() * 1000);
}

function generateTemporaryPassword() {
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `Temp@${digits}`;
}

function mapMemberRoleToUserRole(role) {
  if (role === "Club Head") return "club_head";
  if (role === "Club Coordinator") return "club_coordinator";
  if (role === "Faculty Coordinator") return "faculty_coordinator";
  if (role === "Volunteer Lead") return "volunteer_lead";
  if (role === "Volunteer") return "volunteer";
  return "student";
}

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database connection
initDb();

// DB connection check middleware
const dbCheck = (req, res, next) => {
  if (!isConnected()) {
    return res.status(503).json({
      success: false,
      message: "PostgreSQL Database is offline. Please make sure PostgreSQL is started and credentials are correct in .env",
    });
  }
  next();
};

// Map database User row to client representation
function mapUserToClient(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    email: row.email,
    role: row.role,
    college: row.college,
    department: row.department,
    rollNo: row.roll_no,
    year: row.year,
    joinedClubs: row.joined_clubs || [],
    profilePicture: row.profile_picture || "",
    phone: row.phone || "",
    achievements: row.achievements || [],
    activityHistory: row.activity_history || [],
    memberId: row.member_id
  };
}

// Map database Event row to client representation
function mapEventToClient(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    type: row.type,
    description: row.description,
    date: row.date,
    time: row.time,
    venue: row.venue,
    coordinator: row.coordinator,
    studentCoordinator: row.student_coordinator,
    price: row.price,
    image: row.image,
    tags: row.tags || [],
    trending: row.trending || false,
    totalSeats: row.total_seats,
    rules: row.rules || [],
    prizePool: row.prize_pool,
    requirements: row.requirements,
    registrations: parseInt(row.registrations_count || row.registrations || 0)
  };
}

// Base route for status testing
app.get("/", (req, res) => {
  res.json({
    status: "online",
    database: isConnected() ? "connected" : "offline",
    message: "Aurora Event Management API Working Successfully"
  });
});

// ==========================================
// AUTH ROUTING
// ==========================================

// User registration
app.post("/api/auth/register", dbCheck, async (req, res) => {
  const { name, email, password, department, role } = req.body;

  if (!name || !email || !password || !department) {
    return res.status(400).json({ success: false, message: "Please fill in all inputs." });
  }

  const emailDomain = "@aurora.edu.in";
  if (!email.toLowerCase().endsWith(emailDomain)) {
    return res.status(400).json({
      success: false,
      message: "Strict Campus Rule: You must use your official university email domain ending with @aurora.edu.in to register."
    });
  }

  try {
    // Check if email already registered
    const userExist = await pool.query("SELECT email FROM users WHERE email = $1", [email.toLowerCase()]);
    if (userExist.rowCount > 0) {
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const isStudent = (role || "student") === "student";
    const rollNo = isStudent ? `AUR2026CSE${Math.floor(100 + Math.random() * 900)}` : `AUR2026ADM${Math.floor(100 + Math.random() * 900)}`;
    const year = isStudent ? "1st Year" : "Faculty";

    const joinedClubs = [];
    const achievements = ["First Registration"];
    const activityHistory = [
      { id: Date.now(), text: "Account created successfully", time: new Date().toLocaleString() }
    ];

    const result = await pool.query(
      `INSERT INTO users (email, name, password, role, college, department, roll_no, year, joined_clubs, achievements, activity_history)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        email.toLowerCase(),
        name,
        hashedPassword,
        role || "student",
        "Aurora Deemed to be University",
        department,
        rollNo,
        year,
        joinedClubs,
        achievements,
        JSON.stringify(activityHistory)
      ]
    );

    const newUser = result.rows[0];
    res.status(201).json({ success: true, user: mapUserToClient(newUser) });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// User login
app.post("/api/auth/login", dbCheck, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please fill in all credentials." });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email.toLowerCase(), email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: "Invalid email/username or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.json({ success: true, user: mapUserToClient(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// OAuth Sign-In (automatic register if not found)
app.post("/api/auth/oauth", dbCheck, async (req, res) => {
  const { name, email, avatar } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, message: "Missing profile details." });
  }

  try {
    let result = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    
    if (result.rowCount === 0) {
      // Create account
      const defaultPasswordHash = await bcrypt.hash("password", 10);
      const rollNo = `AUR2026CSE${Math.floor(100 + Math.random() * 900)}`;
      const activityHistory = [
        { id: Date.now(), text: "Connected account via OAuth", time: new Date().toLocaleString() }
      ];

      const insertResult = await pool.query(
        `INSERT INTO users (email, name, password, role, college, department, roll_no, year, profile_picture, joined_clubs, achievements, activity_history)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [
          email.toLowerCase(),
          name,
          defaultPasswordHash,
          "student",
          "Aurora Deemed to be University",
          "Computer Science & Engineering",
          rollNo,
          "3rd Year",
          avatar || "",
          [],
          ["First Registration"],
          JSON.stringify(activityHistory)
        ]
      );
      result = insertResult;
    }

    const user = result.rows[0];
    res.json({ success: true, user: mapUserToClient(user) });
  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// Update Profile
app.post("/api/auth/profile", dbCheck, async (req, res) => {
  const { email, ...fields } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "User email is required." });
  }

  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const currentUser = userRes.rows[0];

    // Map fields and set defaults if not provided
    const name = fields.name !== undefined ? fields.name : currentUser.name;
    const college = fields.college !== undefined ? fields.college : currentUser.college;
    const department = fields.department !== undefined ? fields.department : currentUser.department;
    const roll_no = fields.rollNo !== undefined ? fields.rollNo : currentUser.roll_no;
    const year = fields.year !== undefined ? fields.year : currentUser.year;
    const profile_picture = fields.profilePicture !== undefined ? fields.profilePicture : currentUser.profile_picture;
    const phone = fields.phone !== undefined ? fields.phone : currentUser.phone;
    const achievements = fields.achievements !== undefined ? fields.achievements : (currentUser.achievements || []);
    
    // Log activity
    let currentActivities = currentUser.activity_history || [];
    const updatedActivities = [
      { id: Date.now(), text: "Profile details updated", time: new Date().toLocaleString() },
      ...currentActivities
    ];

    const result = await pool.query(
      `UPDATE users 
       SET name = $1, college = $2, department = $3, roll_no = $4, year = $5, profile_picture = $6, phone = $7, achievements = $8, activity_history = $9
       WHERE email = $10 RETURNING *`,
      [
        name,
        college,
        department,
        roll_no,
        year,
        profile_picture,
        phone,
        achievements,
        JSON.stringify(updatedActivities),
        email.toLowerCase()
      ]
    );

    res.json({ success: true, user: mapUserToClient(result.rows[0]) });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// Fetch all users with 'admin' or 'superadmin' role
app.get("/api/admins", dbCheck, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT email, name, role, college, department FROM users WHERE role = 'admin' OR role = 'superadmin' ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch admins error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// Club Authority Management endpoints

app.get("/api/clubs", dbCheck, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clubs ORDER BY club_name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch clubs error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

app.get("/api/authority/stats", dbCheck, async (req, res) => {
  try {
    const clubsRes = await pool.query("SELECT COUNT(*) FROM clubs");
    const headsRes = await pool.query("SELECT COUNT(*) FROM members WHERE role = 'Club Head'");
    const coordRes = await pool.query("SELECT COUNT(*) FROM members WHERE role IN ('Club Coordinator', 'Faculty Coordinator')");
    const volRes = await pool.query("SELECT COUNT(*) FROM members WHERE role IN ('Volunteer', 'Volunteer Lead')");
    const activeRes = await pool.query("SELECT COUNT(*) FROM members WHERE status = 'Active'");
    const inactiveRes = await pool.query("SELECT COUNT(*) FROM members WHERE status = 'Inactive'");

    res.json({
      totalClubs: parseInt(clubsRes.rows[0].count),
      totalClubHeads: parseInt(headsRes.rows[0].count),
      totalCoordinators: parseInt(coordRes.rows[0].count),
      totalVolunteers: parseInt(volRes.rows[0].count),
      activeMembers: parseInt(activeRes.rows[0].count),
      inactiveMembers: parseInt(inactiveRes.rows[0].count)
    });
  } catch (err) {
    console.error("Fetch stats error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

app.get("/api/members", dbCheck, async (req, res) => {
  const { search, club_id, role, status } = req.query;
  try {
    let queryStr = `
      SELECT m.*, c.club_name 
      FROM members m
      LEFT JOIN clubs c ON m.club_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (search) {
      queryStr += ` AND (m.name ILIKE $${paramIndex} OR m.email ILIKE $${paramIndex} OR m.employee_id ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    if (club_id) {
      queryStr += ` AND m.club_id = $${paramIndex}`;
      params.push(parseInt(club_id));
      paramIndex++;
    }
    if (role) {
      queryStr += ` AND m.role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }
    if (status) {
      queryStr += ` AND m.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    queryStr += " ORDER BY m.name ASC";
    const result = await pool.query(queryStr, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch members error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

app.post("/api/members", dbCheck, async (req, res) => {
  const { name, email, mobile, department, designation, employeeId, profileImage, clubId, role, joiningDate, status } = req.body;

  if (!name || !email || !mobile || !department || !clubId || !role) {
    return res.status(400).json({ success: false, message: "Please fill in all required fields." });
  }

  try {
    const memberExists = await pool.query("SELECT id FROM members WHERE email = $1", [email.toLowerCase()]);
    if (memberExists.rowCount > 0) {
      return res.status(400).json({ success: false, message: "A member with this email already exists." });
    }

    const clubRes = await pool.query("SELECT club_name FROM clubs WHERE id = $1", [parseInt(clubId)]);
    if (clubRes.rowCount === 0) {
      return res.status(400).json({ success: false, message: "Selected club does not exist." });
    }
    const clubName = clubRes.rows[0].club_name;

    let username = generateUsername(name);
    let userCheck = await pool.query("SELECT email FROM users WHERE username = $1", [username]);
    let counter = 1;
    while (userCheck.rowCount > 0) {
      username = `${generateUsername(name)}${counter}`;
      userCheck = await pool.query("SELECT email FROM users WHERE username = $1", [username]);
      counter++;
    }

    const tempPassword = generateTemporaryPassword();
    const hashedPass = await bcrypt.hash(tempPassword, 10);

    const mappedRole = mapMemberRoleToUserRole(role);

    const memberInsert = await pool.query(
      `INSERT INTO members (name, email, mobile, department, designation, role, club_id, status, profile_image, joining_date, employee_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        name,
        email.toLowerCase(),
        mobile,
        department,
        designation || "",
        role,
        parseInt(clubId),
        status || "Active",
        profileImage || "",
        joiningDate || new Date().toISOString().split("T")[0],
        employeeId || ""
      ]
    );
    const newMember = memberInsert.rows[0];

    const userExists = await pool.query("SELECT email FROM users WHERE email = $1", [email.toLowerCase()]);
    if (userExists.rowCount > 0) {
      await pool.query(
        `UPDATE users 
         SET role = $1, username = $2, password = $3, member_id = $4, department = $5, phone = $6, profile_picture = $7, name = $8
         WHERE email = $9`,
        [
          mappedRole,
          username,
          hashedPass,
          newMember.id,
          department,
          mobile,
          profileImage || "",
          name,
          email.toLowerCase()
        ]
      );
    } else {
      const rollNo = employeeId || `AUR2026CSE${Math.floor(100 + Math.random() * 900)}`;
      const year = mappedRole === "admin" ? "Faculty" : "3rd Year";
      const activityHistory = [
        { id: Date.now(), text: `Account assigned role ${role} in ${clubName}`, time: new Date().toLocaleString() }
      ];

      await pool.query(
        `INSERT INTO users (email, name, password, role, college, department, roll_no, year, profile_picture, phone, achievements, activity_history, username, member_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          email.toLowerCase(),
          name,
          hashedPass,
          mappedRole,
          "Aurora Deemed to be University",
          department,
          rollNo,
          year,
          profileImage || "",
          mobile,
          ["Authority Assignment"],
          JSON.stringify(activityHistory),
          username,
          newMember.id
        ]
      );
    }

    await sendCredentialsEmail({
      email: email.toLowerCase(),
      name,
      clubName,
      role,
      username,
      password: tempPassword
    });

    res.status(201).json({
      success: true,
      message: "Member assigned successfully. Login credentials have been sent to the registered email.",
      member: newMember,
      generated: { username, tempPassword }
    });
  } catch (err) {
    console.error("Create member error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

app.put("/api/members/:id", dbCheck, async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, department, designation, employeeId, profileImage, clubId, role, status } = req.body;

  try {
    const currentRes = await pool.query("SELECT * FROM members WHERE id = $1", [parseInt(id)]);
    if (currentRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }
    const current = currentRes.rows[0];

    const updatedRes = await pool.query(
      `UPDATE members 
       SET name = $1, email = $2, mobile = $3, department = $4, designation = $5, role = $6, club_id = $7, status = $8, profile_image = $9, employee_id = $10
       WHERE id = $11 RETURNING *`,
      [
        name !== undefined ? name : current.name,
        email !== undefined ? email.toLowerCase() : current.email,
        mobile !== undefined ? mobile : current.mobile,
        department !== undefined ? department : current.department,
        designation !== undefined ? designation : current.designation,
        role !== undefined ? role : current.role,
        clubId !== undefined ? parseInt(clubId) : current.club_id,
        status !== undefined ? status : current.status,
        profileImage !== undefined ? profileImage : current.profile_image,
        employeeId !== undefined ? employeeId : current.employee_id,
        parseInt(id)
      ]
    );
    const updatedMember = updatedRes.rows[0];

    const actualRole = role !== undefined ? role : current.role;
    const mappedRole = mapMemberRoleToUserRole(actualRole);

    await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, role = $3, department = $4, phone = $5, profile_picture = $6, roll_no = $7
       WHERE member_id = $8`,
      [
        updatedMember.name,
        updatedMember.email,
        mappedRole,
        updatedMember.department,
        updatedMember.mobile,
        updatedMember.profile_image,
        updatedMember.employee_id || `AUR2026CSE${Math.floor(100 + Math.random() * 900)}`,
        parseInt(id)
      ]
    );

    res.json({ success: true, member: updatedMember });
  } catch (err) {
    console.error("Update member error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

app.delete("/api/members/:id", dbCheck, async (req, res) => {
  const { id } = req.params;
  try {
    const memberRes = await pool.query("SELECT email FROM members WHERE id = $1", [parseInt(id)]);
    if (memberRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }
    const email = memberRes.rows[0].email;

    await pool.query("DELETE FROM members WHERE id = $1", [parseInt(id)]);
    await pool.query("DELETE FROM users WHERE member_id = $1 OR email = $2", [parseInt(id), email]);

    res.json({ success: true, message: "Member deleted successfully." });
  } catch (err) {
    console.error("Delete member error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

app.post("/api/members/:id/reset-password", dbCheck, async (req, res) => {
  const { id } = req.params;
  try {
    const memberRes = await pool.query(
      "SELECT m.*, c.club_name FROM members m LEFT JOIN clubs c ON m.club_id = c.id WHERE m.id = $1", 
      [parseInt(id)]
    );
    if (memberRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }
    const member = memberRes.rows[0];

    const userRes = await pool.query("SELECT username FROM users WHERE member_id = $1", [parseInt(id)]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User account not found for this member." });
    }
    const username = userRes.rows[0].username;

    const tempPassword = generateTemporaryPassword();
    const hashedPass = await bcrypt.hash(tempPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE member_id = $2", [hashedPass, parseInt(id)]);

    await sendCredentialsEmail({
      email: member.email,
      name: member.name,
      clubName: member.club_name || "Aurora Campus Clubs",
      role: member.role,
      username,
      password: tempPassword
    });

    res.json({
      success: true,
      message: "Password reset successful. Credentials have been re-sent to the email.",
      generated: { username, tempPassword }
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

app.post("/api/members/:id/resend-credentials", dbCheck, async (req, res) => {
  const { id } = req.params;
  try {
    const memberRes = await pool.query(
      "SELECT m.*, c.club_name FROM members m LEFT JOIN clubs c ON m.club_id = c.id WHERE m.id = $1", 
      [parseInt(id)]
    );
    if (memberRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Member not found." });
    }
    const member = memberRes.rows[0];

    const userRes = await pool.query("SELECT username FROM users WHERE member_id = $1", [parseInt(id)]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User account not found for this member." });
    }
    const username = userRes.rows[0].username;

    const tempPassword = generateTemporaryPassword();
    const hashedPass = await bcrypt.hash(tempPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE member_id = $2", [hashedPass, parseInt(id)]);

    await sendCredentialsEmail({
      email: member.email,
      name: member.name,
      clubName: member.club_name || "Aurora Campus Clubs",
      role: member.role,
      username,
      password: tempPassword
    });

    res.json({
      success: true,
      message: "Credentials sent successfully to the registered email.",
      generated: { username, tempPassword }
    });
  } catch (err) {
    console.error("Resend credentials error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// ==========================================
// CLUBS ROUTING
// ==========================================

// Join Club
app.post("/api/clubs/join", dbCheck, async (req, res) => {
  const { email, clubId, clubName } = req.body;

  if (!email || !clubId || !clubName) {
    return res.status(400).json({ success: false, message: "Missing join details." });
  }

  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const user = userRes.rows[0];
    const joinedClubs = user.joined_clubs || [];
    if (joinedClubs.includes(clubId)) {
      return res.status(400).json({ success: false, message: "Already joined!" });
    }

    const updatedClubs = [...joinedClubs, clubId];
    
    // Add achievement if they join their first club
    const achievements = user.achievements || [];
    const updatedAchievements = [...achievements];
    if (!updatedAchievements.includes("Club Enthusiast")) {
      updatedAchievements.push("Club Enthusiast");
    }

    const currentActivities = user.activity_history || [];
    const updatedActivities = [
      { id: Date.now(), text: `Joined club: ${clubName}`, time: new Date().toLocaleString() },
      ...currentActivities
    ];

    const result = await pool.query(
      `UPDATE users 
       SET joined_clubs = $1, achievements = $2, activity_history = $3
       WHERE email = $4 RETURNING *`,
      [updatedClubs, updatedAchievements, JSON.stringify(updatedActivities), email.toLowerCase()]
    );

    res.json({ success: true, user: mapUserToClient(result.rows[0]) });
  } catch (err) {
    console.error("Join club error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// Leave Club
app.post("/api/clubs/leave", dbCheck, async (req, res) => {
  const { email, clubId, clubName } = req.body;

  if (!email || !clubId || !clubName) {
    return res.status(400).json({ success: false, message: "Missing leave details." });
  }

  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const user = userRes.rows[0];
    const joinedClubs = user.joined_clubs || [];
    const updatedClubs = joinedClubs.filter(id => id !== clubId);

    const currentActivities = user.activity_history || [];
    const updatedActivities = [
      { id: Date.now(), text: `Left club: ${clubName}`, time: new Date().toLocaleString() },
      ...currentActivities
    ];

    const result = await pool.query(
      `UPDATE users 
       SET joined_clubs = $1, activity_history = $2
       WHERE email = $3 RETURNING *`,
      [updatedClubs, JSON.stringify(updatedActivities), email.toLowerCase()]
    );

    res.json({ success: true, user: mapUserToClient(result.rows[0]) });
  } catch (err) {
    console.error("Leave club error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// ==========================================
// FEEDBACK ROUTING
// ==========================================

// Submit Feedback
app.post("/api/feedback", dbCheck, async (req, res) => {
  const { email, eventId, eventTitle, rating, feedbackText } = req.body;

  if (!email || !eventId || !rating) {
    return res.status(400).json({ success: false, message: "Missing feedback details." });
  }

  try {
    // 1. Insert feedback
    await pool.query(
      `INSERT INTO feedbacks (user_email, event_id, event_title, rating, feedback_text)
       VALUES ($1, $2, $3, $4, $5)`,
      [email.toLowerCase(), eventId, eventTitle || "", rating, feedbackText || ""]
    );

    // 2. Update achievements & activity
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (userRes.rowCount > 0) {
      const user = userRes.rows[0];
      const achievements = user.achievements || [];
      const updatedAchievements = [...achievements];
      if (!updatedAchievements.includes("Feedback Contributor")) {
        updatedAchievements.push("Feedback Contributor");
      }

      const currentActivities = user.activity_history || [];
      const updatedActivities = [
        { id: Date.now(), text: `Submitted feedback for: ${eventTitle || "Event"} (Rating: ${rating}/5)`, time: new Date().toLocaleString() },
        ...currentActivities
      ];

      const result = await pool.query(
        `UPDATE users 
         SET achievements = $1, activity_history = $2
         WHERE email = $3 RETURNING *`,
        [updatedAchievements, JSON.stringify(updatedActivities), email.toLowerCase()]
      );

      return res.json({ success: true, user: mapUserToClient(result.rows[0]) });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Submit feedback error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// ==========================================
// EVENTS ROUTING
// ==========================================

// GET all events (joins registrations to compute live count)
app.get("/api/events", dbCheck, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, COUNT(r.id)::int as registrations_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      GROUP BY e.id
      ORDER BY e.trending DESC, e.title ASC
    `);

    const mappedEvents = result.rows.map(row => mapEventToClient(row));
    res.json(mappedEvents);
  } catch (err) {
    console.error("Fetch events error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// Create new event
app.post("/api/events", dbCheck, async (req, res) => {
  const eventData = req.body;

  if (!eventData.title || !eventData.category || !eventData.type) {
    return res.status(400).json({ success: false, message: "Missing required event fields." });
  }

  const prefix = eventData.category.toLowerCase().substring(0, 4);
  const id = `${prefix}-${Date.now()}`;

  try {
    const result = await pool.query(
      `INSERT INTO events (id, title, category, type, description, date, time, venue, coordinator, student_coordinator, price, image, tags, trending, total_seats, rules, prize_pool, requirements)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
      [
        id,
        eventData.title,
        eventData.category,
        eventData.type,
        eventData.description || "",
        eventData.date || "",
        eventData.time || "",
        eventData.venue || "",
        eventData.coordinator || "",
        eventData.studentCoordinator || "",
        eventData.price || "Free",
        eventData.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
        eventData.tags || [],
        eventData.trending || false,
        eventData.totalSeats || 100,
        eventData.rules || [],
        eventData.prizePool || "N/A",
        eventData.requirements || ""
      ]
    );

    const newEvent = result.rows[0];
    res.status(201).json({ success: true, event: mapEventToClient(newEvent) });
  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// Edit event
app.put("/api/events/:id", dbCheck, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const currentRes = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    if (currentRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const current = currentRes.rows[0];

    const title = updatedData.title !== undefined ? updatedData.title : current.title;
    const category = updatedData.category !== undefined ? updatedData.category : current.category;
    const type = updatedData.type !== undefined ? updatedData.type : current.type;
    const description = updatedData.description !== undefined ? updatedData.description : current.description;
    const date = updatedData.date !== undefined ? updatedData.date : current.date;
    const time = updatedData.time !== undefined ? updatedData.time : current.time;
    const venue = updatedData.venue !== undefined ? updatedData.venue : current.venue;
    const coordinator = updatedData.coordinator !== undefined ? updatedData.coordinator : current.coordinator;
    const student_coordinator = updatedData.studentCoordinator !== undefined ? updatedData.studentCoordinator : current.student_coordinator;
    const price = updatedData.price !== undefined ? updatedData.price : current.price;
    const image = updatedData.image !== undefined ? updatedData.image : current.image;
    const tags = updatedData.tags !== undefined ? updatedData.tags : current.tags;
    const trending = updatedData.trending !== undefined ? updatedData.trending : current.trending;
    const total_seats = updatedData.totalSeats !== undefined ? updatedData.totalSeats : current.total_seats;
    const rules = updatedData.rules !== undefined ? updatedData.rules : current.rules;
    const prize_pool = updatedData.prizePool !== undefined ? updatedData.prizePool : current.prize_pool;
    const requirements = updatedData.requirements !== undefined ? updatedData.requirements : current.requirements;

    await pool.query(
      `UPDATE events 
       SET title = $1, category = $2, type = $3, description = $4, date = $5, time = $6, venue = $7, coordinator = $8, student_coordinator = $9, price = $10, image = $11, tags = $12, trending = $13, total_seats = $14, rules = $15, prize_pool = $16, requirements = $17
       WHERE id = $18`,
      [
        title,
        category,
        type,
        description,
        date,
        time,
        venue,
        coordinator,
        student_coordinator,
        price,
        image,
        tags,
        trending,
        total_seats,
        rules,
        prize_pool,
        requirements,
        id
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// Delete event
app.delete("/api/events/:id", dbCheck, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM events WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// ==========================================
// REGISTRATION ROUTING
// ==========================================

// Register for event
app.post("/api/events/:id/register", dbCheck, async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Please login to register for events." });
  }

  try {
    // 1. Verify event exists and capacity is not full
    const eventRes = await pool.query(`
      SELECT e.*, COUNT(r.id)::int as registrations_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.id
    `, [id]);

    if (eventRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const event = eventRes.rows[0];
    if (event.registrations_count >= event.total_seats) {
      return res.status(400).json({ success: false, message: "This event has reached full capacity. Please choose another experience." });
    }

    // 2. Check if already registered
    const regRes = await pool.query("SELECT 1 FROM registrations WHERE user_email = $1 AND event_id = $2", [email.toLowerCase(), id]);
    if (regRes.rowCount > 0) {
      return res.status(400).json({ success: false, message: "You have already registered for this event!" });
    }

    // 3. Insert registration
    await pool.query(
      `INSERT INTO registrations (user_email, event_id) VALUES ($1, $2)`,
      [email.toLowerCase(), id]
    );

    res.json({ success: true, message: "Registration Successful!" });
  } catch (err) {
    console.error("Register event error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// Unregister from event
app.post("/api/events/:id/unregister", dbCheck, async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Missing email address." });
  }

  try {
    const result = await pool.query(
      "DELETE FROM registrations WHERE user_email = $1 AND event_id = $2",
      [email.toLowerCase(), id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ success: false, message: "You were not registered for this event." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Unregister event error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// Get user's registered event IDs
app.get("/api/registrations/:email", dbCheck, async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      "SELECT event_id FROM registrations WHERE user_email = $1",
      [email.toLowerCase()]
    );

    const eventIds = result.rows.map(row => row.event_id);
    res.json({ success: true, eventIds });
  } catch (err) {
    console.error("Fetch registrations error:", err);
    res.status(500).json({ success: false, message: "Database server error: " + err.message });
  }
});

// ==========================================
// VOLUNTEER CORE ROUTES
// ==========================================

// Get all volunteer tasks or tasks for specific volunteer
app.get("/api/volunteers/tasks", dbCheck, async (req, res) => {
  const { volunteer_name } = req.query;
  try {
    let result;
    if (volunteer_name) {
      result = await pool.query(
        "SELECT * FROM volunteer_tasks WHERE volunteer_name = $1 ORDER BY id DESC",
        [volunteer_name]
      );
    } else {
      result = await pool.query("SELECT * FROM volunteer_tasks ORDER BY id DESC");
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch volunteer tasks error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Create new volunteer task
app.post("/api/volunteers/tasks", dbCheck, async (req, res) => {
  const { volunteerName, role, eventTitle, taskDescription, shift } = req.body;
  if (!volunteerName || !eventTitle || !taskDescription || !shift) {
    return res.status(400).json({ success: false, message: "Please fill in all task specifications." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO volunteer_tasks (volunteer_name, role, event_title, task_description, shift, status)
       VALUES ($1, $2, $3, $4, $5, 'Assigned') RETURNING *`,
      [volunteerName, role || 'volunteer', eventTitle, taskDescription, shift]
    );
    res.status(201).json({ success: true, task: result.rows[0] });
  } catch (err) {
    console.error("Create volunteer task error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Update volunteer task status
app.put("/api/volunteers/tasks/:id", dbCheck, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: "Missing next status designation." });
  }
  try {
    const result = await pool.query(
      "UPDATE volunteer_tasks SET status = $1 WHERE id = $2 RETURNING *",
      [status, parseInt(id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Task allocation not found." });
    }
    res.json({ success: true, task: result.rows[0] });
  } catch (err) {
    console.error("Update task status error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Get volunteer attendance logs
app.get("/api/volunteers/attendance", dbCheck, async (req, res) => {
  const { volunteer_name } = req.query;
  try {
    let result;
    if (volunteer_name) {
      result = await pool.query(
        "SELECT * FROM volunteer_attendance WHERE volunteer_name = $1 ORDER BY id DESC",
        [volunteer_name]
      );
    } else {
      result = await pool.query("SELECT * FROM volunteer_attendance ORDER BY id DESC");
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch volunteer attendance error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Log check-in attendance
app.post("/api/volunteers/attendance", dbCheck, async (req, res) => {
  const { volunteerName, eventTitle, shift, date, checkInTime } = req.body;
  if (!volunteerName || !eventTitle || !shift || !date || !checkInTime) {
    return res.status(400).json({ success: false, message: "Missing check-in parameter fields." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO volunteer_attendance (volunteer_name, event_title, shift, date, check_in_time, status)
       VALUES ($1, $2, $3, $4, $5, 'Present') RETURNING *`,
      [volunteerName, eventTitle, shift, date, checkInTime]
    );
    res.status(201).json({ success: true, log: result.rows[0] });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Log check-out time
app.put("/api/volunteers/attendance/checkout", dbCheck, async (req, res) => {
  const { volunteerName, eventTitle, checkOutTime } = req.body;
  if (!volunteerName || !eventTitle || !checkOutTime) {
    return res.status(400).json({ success: false, message: "Missing checkout parameters." });
  }
  try {
    const result = await pool.query(
      `UPDATE volunteer_attendance 
       SET check_out_time = $1 
       WHERE volunteer_name = $2 AND event_title = $3 AND check_out_time IS NULL RETURNING *`,
      [checkOutTime, volunteerName, eventTitle]
    );
    res.json({ success: true, log: result.rows[0] });
  } catch (err) {
    console.error("Check-out error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Get volunteer ratings
app.get("/api/volunteers/ratings", dbCheck, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM volunteer_ratings");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch ratings error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Create/Update volunteer rating (coordinators only)
app.post("/api/volunteers/ratings", dbCheck, async (req, res) => {
  const { volunteerName, rating, feedback, ratedBy } = req.body;
  if (!volunteerName || !rating) {
    return res.status(400).json({ success: false, message: "Missing rating parameters." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO volunteer_ratings (volunteer_name, rating, feedback, rated_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (volunteer_name) 
       DO UPDATE SET rating = $2, feedback = $3, rated_by = $4 RETURNING *`,
      [volunteerName, parseInt(rating), feedback || '', ratedBy || '']
    );
    res.json({ success: true, rating: result.rows[0] });
  } catch (err) {
    console.error("Save rating error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Get coordinator messages
app.get("/api/volunteers/messages", dbCheck, async (req, res) => {
  const { club_id } = req.query;
  try {
    let result;
    if (club_id) {
      result = await pool.query(
        "SELECT * FROM volunteer_messages WHERE club_id = $1 ORDER BY id DESC",
        [parseInt(club_id)]
      );
    } else {
      result = await pool.query("SELECT * FROM volunteer_messages ORDER BY id DESC");
    }
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch messages error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Send helpdesk message
app.post("/api/volunteers/messages", dbCheck, async (req, res) => {
  const { senderName, senderEmail, clubId, clubName, message, timestamp } = req.body;
  if (!senderName || !senderEmail || !clubId || !message) {
    return res.status(400).json({ success: false, message: "Missing message details." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO volunteer_messages (sender_name, sender_email, club_id, club_name, message, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [senderName, senderEmail, parseInt(clubId), clubName || 'General', message, timestamp || new Date().toLocaleString()]
    );
    res.status(201).json({ success: true, message: result.rows[0] });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Reply to message
app.put("/api/volunteers/messages/:id/reply", dbCheck, async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;
  if (!reply) {
    return res.status(400).json({ success: false, message: "Reply body cannot be empty." });
  }
  try {
    const result = await pool.query(
      `UPDATE volunteer_messages 
       SET reply = $1, replied_at = $2 
       WHERE id = $3 RETURNING *`,
      [reply, new Date().toLocaleString(), parseInt(id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Message thread not found." });
    }
    res.json({ success: true, message: result.rows[0] });
  } catch (err) {
    console.error("Reply message error:", err);
    res.status(500).json({ success: false, message: "Database error: " + err.message });
  }
});

// Startup backend
app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
});