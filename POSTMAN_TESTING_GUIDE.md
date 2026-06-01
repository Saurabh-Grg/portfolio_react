# Postman API Testing Guide

## Setup in Postman

1. **Create a new Collection:** `Portfolio API`
2. **Create an Environment Variable** for the base URL:
   - Variable name: `base_url`
   - Value: `http://localhost:5002/api`
3. **Create another variable** for the JWT token:
   - Variable name: `authToken`
   - Value: (will be populated after login)

---

## Phase 1: Authentication (No Auth Required)

### 1.1 Register Admin User

**POST** `{{base_url}}/auth/register`

```json
{
  "email": "saurabhgurung20@gmail.com",
  "password": "Godblessme25$"
}
```

**Expected Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "email": "saurabhgurung20@gmail.com"
  }
}
```

✅ **After success:** Copy the `token` and paste it into your `authToken` environment variable

---

### 1.2 Login with Admin Credentials

**POST** `{{base_url}}/auth/login`

```json
{
  "email": "saurabhgurung20@gmail.com",
  "password": "Godblessme25$"
}
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "email": "saurabhgurung20@gmail.com"
  }
}
```

✅ **After success:** Update `authToken` variable with the new token

---

### 1.3 Verify Token (Auth Required ✅)

**GET** `{{base_url}}/auth/me`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Expected Response (200):**
```json
{
  "user": {
    "id": 3,
    "email": "saurabhgurung20@gmail.com"
  }
}
```

---

## Phase 2: Profile (Public Read, Auth Write)

### 2.1 Get Profile (No Auth)

**GET** `{{base_url}}/profile`

**Expected Response (200):**
```json
{
  "id": 1,
  "name": "Your Name",
  "title": "Full Stack Developer",
  "bio": "Welcome to my portfolio.",
  "email": "",
  "phone": "",
  "location": "",
  "avatar_url": "",
  "github_url": "",
  "linkedin_url": "",
  "twitter_url": "",
  "website_url": "",
  "updated_at": "2026-05-31T14:30:00.000Z"
}
```

---

### 2.2 Update Profile (Auth Required ✅)

**PUT** `{{base_url}}/profile`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Body:**
```json
{
  "name": "Saurabh Gurung",
  "title": "Full Stack Developer & Flutter Expert",
  "bio": "Passionate about building scalable web and mobile applications",
  "email": "saurabhgurung20@gmail.com",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "avatar_url": "https://example.com/avatar.jpg",
  "github_url": "https://github.com/saurabhg",
  "linkedin_url": "https://linkedin.com/in/saurabhg",
  "twitter_url": "https://twitter.com/saurabhg",
  "website_url": "https://saurabhgurung.com"
}
```

**Expected Response (200):**
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "id": 1,
    "name": "Saurabh Gurung",
    "title": "Full Stack Developer & Flutter Expert",
    "bio": "Passionate about building scalable web and mobile applications",
    "email": "saurabhgurung20@gmail.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "avatar_url": "https://example.com/avatar.jpg",
    "github_url": "https://github.com/saurabhg",
    "linkedin_url": "https://linkedin.com/in/saurabhg",
    "twitter_url": "https://twitter.com/saurabhg",
    "website_url": "https://saurabhgurung.com",
    "updated_at": "2026-06-01T02:31:27.581Z"
  }
}
```

---

## Phase 3: Projects (Public Read, Auth Write)

### 3.1 Get All Projects (No Auth)

**GET** `{{base_url}}/projects`

**Expected Response (200):**
```json
[
  {
    "id": 1,
    "title": "E-commerce Platform",
    "description": "Full-stack e-commerce with React and Node.js",
    "image_url": "https://...",
    "tags": ["React", "Node.js", "MongoDB"],
    "demo_url": "https://demo.com",
    "github_url": "https://github.com/...",
    "featured": true,
    "created_at": "2026-05-31T14:30:00.000Z",
    "updated_at": "2026-05-31T14:30:00.000Z"
  }
]
```

---

### 3.2 Create Project (Auth Required ✅)

**POST** `{{base_url}}/projects`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Body:**
```json
{
  "title": "AI Chat Application",
  "description": "Real-time chat app with AI integration using WebSockets",
  "image_url": "https://example.com/ai-chat.jpg",
  "tags": ["React", "Node.js", "AI", "WebSocket"],
  "demo_url": "https://ai-chat-demo.com",
  "github_url": "https://github.com/saurabhg/ai-chat",
  "featured": true
}
```

**Expected Response (201):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": 1,
    "title": "AI Chat Application",
    "description": "Real-time chat app with AI integration using WebSockets",
    "image_url": "https://example.com/ai-chat.jpg",
    "tags": ["React", "Node.js", "AI", "WebSocket"],
    "demo_url": "https://ai-chat-demo.com",
    "github_url": "https://github.com/saurabhg/ai-chat",
    "featured": true,
    "created_at": "2026-06-01T02:39:05.759Z",
    "updated_at": "2026-06-01T02:39:05.759Z"
  }
}
```

---

### 3.3 Update Project (Auth Required ✅)

**PUT** `{{base_url}}/projects/2`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Body:**
```json
{
  "title": "AI Chat Application v2",
  "description": "Updated real-time chat app with advanced AI features",
  "featured": true
}
```

**Expected Response (200):**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": 1,
    "title": "AI Chat Application v2",
    "description": "Updated real-time chat app with advanced AI features",
    "image_url": "https://example.com/ai-chat.jpg",
    "tags": ["React", "Node.js", "AI", "WebSocket"],
    "demo_url": "https://ai-chat-demo.com",
    "github_url": "https://github.com/saurabhg/ai-chat",
    "featured": true,
    "created_at": "2026-06-01T02:39:05.759Z",
    "updated_at": "2026-06-01T02:39:10.123Z"
  }
}
```

---

### 3.4 Delete Project (Auth Required ✅)

**DELETE** `{{base_url}}/projects/2`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Expected Response (200):**
```json
{
  "message": "Project deleted"
}
```

---

## Phase 4: Skills (Public Read, Auth Write)

### 4.1 Get All Skills (No Auth)

**GET** `{{base_url}}/skills`

**Expected Response (200):**
```json
[
  {
    "id": 1,
    "name": "React",
    "category": "Frontend",
    "percentage": 95,
    "created_at": "2026-05-31T14:30:00.000Z",
    "updated_at": "2026-05-31T14:30:00.000Z"
  }
]
```

---

### 4.2 Create Skill (Auth Required ✅)

**POST** `{{base_url}}/skills`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Body:**
```json
{
  "name": "TypeScript",
  "category": "Frontend",
  "percentage": 90
}
```

**Expected Response (201):**
```json
{
  "message": "Skill created successfully",
  "skill": {
    "id": 2,
    "name": "TypeScript",
    "category": "Frontend",
    "percentage": 90,
    "created_at": "2026-06-01T02:40:00.000Z",
    "updated_at": "2026-06-01T02:40:00.000Z"
  }
}
```

---

### 4.3 Update Skill (Auth Required ✅)

**PUT** `{{base_url}}/skills/2`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Body:**
```json
{
  "name": "TypeScript",
  "category": "Frontend",
  "percentage": 95
}
```

**Expected Response (200):**
```json
{
  "message": "Skill updated successfully",
  "skill": {
    "id": 2,
    "name": "TypeScript",
    "category": "Frontend",
    "percentage": 95,
    "created_at": "2026-06-01T02:40:00.000Z",
    "updated_at": "2026-06-01T02:40:05.000Z"
  }
}
```

---

### 4.4 Delete Skill (Auth Required ✅)

**DELETE** `{{base_url}}/skills/2`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Expected Response (200):**
```json
{
  "message": "Skill deleted"
}
```

---

## Phase 5: Experience (Public Read, Auth Write)

### 5.1 Get All Experience (No Auth)

**GET** `{{base_url}}/experience`

**Expected Response (200):**
```json
[
  {
    "id": 1,
    "company": "Tech Company Inc",
    "position": "Senior Developer",
    "duration": "2 years",
    "description": "Led development of microservices architecture",
    "type": "work",
    "start_date": "2024-01-01",
    "end_date": null,
    "current": true,
    "created_at": "2026-05-31T14:30:00.000Z",
    "updated_at": "2026-05-31T14:30:00.000Z"
  }
]
```

---

### 5.2 Create Experience (Auth Required ✅)

**POST** `{{base_url}}/experience`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Body:**
```json
{
  "company": "Google",
  "position": "Software Engineer",
  "duration": "3 years",
  "description": "Worked on Cloud Platform infrastructure",
  "type": "work",
  "start_date": "2022-06-01",
  "end_date": "2025-06-01",
  "current": false
}
```

**Expected Response (201):**
```json
{
  "message": "Experience created successfully",
  "experience": {
    "id": 2,
    "company": "Google",
    "position": "Software Engineer",
    "duration": "3 years",
    "description": "Worked on Cloud Platform infrastructure",
    "type": "work",
    "start_date": "2022-06-01",
    "end_date": "2025-06-01",
    "current": false,
    "created_at": "2026-06-01T02:41:00.000Z",
    "updated_at": "2026-06-01T02:41:00.000Z"
  }
}
```

---

**Expected Response (200):**
```json
{
  "message": "Experience updated successfully",
  "experience": {
    "id": 2,
    "company": "Google",
    "position": "Software Engineer",
    "duration": "3 years",
    "description": "Updated: Worked on Cloud Platform infrastructure and DevOps",
    "type": "work",
    "start_date": "2022-06-01",
    "end_date": "2025-06-01",
    "current": false,
    "created_at": "2026-06-01T02:41:00.000Z",
    "updated_at": "2026-06-01T02:41:10.000Z"
  }
}```

---

### 5.4 Delete Experience (Auth Required ✅)

**DELETE** `{{base_url}}/experience/2`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

---

## Phase 6: Testimonials (Public Read, Auth Write)

### 6.1 Get All Testimonials (No Auth)

**GET** `{{base_url}}/testimonials`

**Expected Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "role": "CTO",
    "company": "Tech Startup",
    "content": "Saurabh is an excellent developer with strong problem-solving skills",
    "avatar_url": "https://...",
    "created_at": "2026-05-31T14:30:00.000Z",
    "updated_at": "2026-05-31T14:30:00.000Z"
  }
]
```

---

### 6.2 Create Testimonial (Auth Required ✅)

**POST** `{{base_url}}/testimonials`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Body:**
```json
{
  "name": "Jane Smith",
  "role": "Product Manager",
  "company": "Big Tech Corp",
  "content": "Great to work with, delivered high-quality code on time",
  "avatar_url": "https://example.com/jane.jpg"
}
```

**Expected Response (201):**
```json
{
  "message": "Testimonial created successfully",
  "testimonial": {
    "id": 2,
    "name": "Jane Smith",
    "role": "Product Manager",
    "company": "Big Tech Corp",
    "content": "Great to work with, delivered high-quality code on time",
    "avatar_url": "https://example.com/jane.jpg",
    "rating": 5,
    "created_at": "2026-06-01T02:42:00.000Z",
    "updated_at": "2026-06-01T02:42:00.000Z"
  }
}
```

---

### 6.3 Update Testimonial (Auth Required ✅)

**PUT** `{{base_url}}/testimonials/2`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Body:**
```json
{
  "content": "Updated: Great to work with, delivered high-quality code consistently on time"
}
```

**Expected Response (200):**
```json
{
  "message": "Testimonial updated successfully",
  "testimonial": {
    "id": 2,
    "name": "Jane Smith",
    "role": "Product Manager",
    "company": "Big Tech Corp",
    "content": "Updated: Great to work with, delivered high-quality code consistently on time",
    "avatar_url": "https://example.com/jane.jpg",
    "rating": 5,
    "created_at": "2026-06-01T02:42:00.000Z",
    "updated_at": "2026-06-01T02:42:10.000Z"
  }
}
```

---

### 6.4 Delete Testimonial (Auth Required ✅)

**DELETE** `{{base_url}}/testimonials/2`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

---

## Phase 7: Messages (Public Create, Auth Read/Delete)

### 7.1 Send Contact Message (No Auth - Public)

**POST** `{{base_url}}/messages`

**Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "subject": "Project Inquiry",
  "message": "Hi Saurabh, I'm interested in hiring you for a project. Let's discuss!"
}
```

**Expected Response (201):**
```json
{
  "message": "Message sent successfully",
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "subject": "Project Inquiry",
    "message": "Hi Saurabh, I'm interested in hiring you for a project. Let's discuss!",
    "is_read": false,
    "created_at": "2026-05-31T14:30:00.000Z"
  }
}
```

---

### 7.2 Get All Messages (Auth Required ✅)

**GET** `{{base_url}}/messages`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Expected Response (200):**
```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "subject": "Project Inquiry",
    "message": "Hi Saurabh, I'm interested in hiring you...",
    "read": false,
    "created_at": "2026-05-31T14:30:00.000Z"
  }
]
```

---

### 7.3 Mark Message as Read (Auth Required ✅)

**PATCH** `{{base_url}}/messages/1/read`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Expected Response (200):**
```json
{
  "message": "Message marked as read",
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "subject": "Project Inquiry",
    "message": "Hi Saurabh, I'm interested in hiring you...",
    "is_read": true,
    "created_at": "2026-05-31T14:30:00.000Z"
  }
}
```

---

### 7.4 Delete Message (Auth Required ✅)

**DELETE** `{{base_url}}/messages/1`

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Expected Response (200):**
```json
{
  "message": "Message deleted"
}
```

---

## Testing Checklist

### Phase 1: Authentication ✅
- [ ] Register user
- [ ] Login user (save token)
- [ ] Verify token

### Phase 2: Profile ✅
- [ ] Get profile (no auth)
- [ ] Update profile (with auth)

### Phase 3: Projects ✅
- [ ] Get all projects (no auth)
- [ ] Create project (with auth)
- [ ] Update project (with auth)
- [ ] Delete project (with auth)

### Phase 4: Skills ✅
- [ ] Get all skills (no auth)
- [ ] Create skill (with auth)
- [ ] Update skill (with auth)
- [ ] Delete skill (with auth)

### Phase 5: Experience ✅
- [ ] Get all experience (no auth)
- [ ] Create experience (with auth)
- [ ] Update experience (with auth)
- [ ] Delete experience (with auth)

### Phase 6: Testimonials ✅
- [ ] Get all testimonials (no auth)
- [ ] Create testimonial (with auth)
- [ ] Update testimonial (with auth)
- [ ] Delete testimonial (with auth)

### Phase 7: Messages ✅
- [ ] Send message (public)
- [ ] Get all messages (with auth)
- [ ] Mark as read (with auth)
- [ ] Delete message (with auth)

---

## Error Scenarios to Test

### Invalid Credentials
```
POST {{base_url}}/auth/login
{
  "email": "wrong@email.com",
  "password": "wrongpassword"
}
```
**Expected:** 401 - Invalid email or password

### Missing Auth Header
```
GET {{base_url}}/projects (without Authorization header)
```
**Expected:** 200 - Should work (public endpoint)

### Invalid Token
```
GET {{base_url}}/auth/me
Authorization: Bearer invalidtoken123
```
**Expected:** 401 - Invalid or expired token

### Duplicate Email
```
POST {{base_url}}/auth/register
{
  "email": "saurabhgurung20@gmail.com",
  "password": "AnotherPassword123"
}
```
**Expected:** 400 - Email already registered

---

## Summary

✅ All **24 endpoints** are ready to test!
✅ **Authentication** is working (JWT 7-day expiry)
✅ **CORS** configured for localhost
✅ **Database** persists all data to PostgreSQL

Start with Phase 1 (Authentication) and work your way through all phases!
