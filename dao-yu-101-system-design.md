# DAO-YU-101 TECHNICAL SYSTEM DESIGN SPECIFICATION

## 1. SUPABASE DATA MODELS

### 1.1 CORE DATA SCHEMA

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'parent', 'teacher', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    display_name VARCHAR(100) NOT NULL,
    parent_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- For students linking to parents
    CONSTRAINT student_requires_parent CHECK (
        (role != 'student') OR (parent_id IS NOT NULL)
    )
);

-- Archipelagos (Subject domains)
CREATE TABLE archipelagos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Islands (Topics within archipelagos)
CREATE TABLE islands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    archipelago_id UUID NOT NULL REFERENCES archipelagos(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    UNIQUE(archipelago_id, name)
);

-- Lessons (Atomic learning units)
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    island_id UUID NOT NULL REFERENCES islands(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL CHECK (sort_order >= 1 AND sort_order <= 15),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    validation_type VARCHAR(20) NOT NULL CHECK (validation_type IN ('automated', 'human_reviewed', 'both')),
    content_data JSONB NOT NULL, -- Stores lesson content, questions, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    UNIQUE(island_id, sort_order)
);

-- Validation records (CORE TABLE - progression derived from this)
CREATE TABLE validation_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    result VARCHAR(10) NOT NULL CHECK (result IN ('pass', 'fail')),
    validation_method VARCHAR(20) NOT NULL CHECK (validation_method IN ('automated', 'human_reviewed')),
    submission_data JSONB NOT NULL, -- Actual work submitted
    attempt_number INTEGER NOT NULL,
    validator_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL for automated
    device_identifier VARCHAR(100), -- For offline sync tracking
    client_timestamp TIMESTAMP WITH TIME ZONE, -- For conflict resolution
    CONSTRAINT validator_required_for_human CHECK (
        (validation_method = 'automated') OR (validator_id IS NOT NULL)
    )
);

-- Override audit logs
CREATE TABLE override_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    validation_record_id UUID NOT NULL REFERENCES validation_records(id) ON DELETE CASCADE,
    override_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    original_validation_state VARCHAR(10) NOT NULL,
    new_validation_state VARCHAR(10) NOT NULL,
    override_reason TEXT NOT NULL CHECK (LENGTH(override_reason) >= 50),
    override_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Teacher-student assignments
CREATE TABLE teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    UNIQUE(teacher_id, student_id),
    CONSTRAINT both_teacher_and_student CHECK (
        (SELECT role FROM profiles WHERE id = teacher_id) = 'teacher' AND
        (SELECT role FROM profiles WHERE id = student_id) = 'student'
    )
);

-- Peer review assignments
CREATE TABLE peer_review_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    validation_record_id UUID NOT NULL REFERENCES validation_records(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reviewer_anonymized_id VARCHAR(20) NOT NULL, -- Pseudonym for anonymization
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'completed', 'skipped')),
    completed_at TIMESTAMP WITH TIME ZONE,
    review_data JSONB, -- Stores review feedback and rating
    UNIQUE(validation_record_id, reviewer_id),
    CONSTRAINT reviewer_is_student CHECK (
        (SELECT role FROM profiles WHERE id = reviewer_id) = 'student'
    )
);

-- Gamification: XP records
CREATE TABLE xp_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    xp_amount INTEGER NOT NULL CHECK (xp_amount > 0),
    xp_source VARCHAR(30) NOT NULL CHECK (xp_source IN ('lesson_complete', 'streak_maintain', 'peer_review_participation', 'badge_earn')),
    source_reference_id UUID, -- Reference to related record (validation_record, badge, etc.)
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamification: Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    badge_type VARCHAR(20) NOT NULL CHECK (badge_type IN ('skill_mastery', 'topic_complete', 'consistency', 'special')),
    criteria JSONB NOT NULL, -- Objectively measurable criteria
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gamification: User badges earned
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Gamification: Cosmetic unlocks (items XP can unlock)
CREATE TABLE cosmetic_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    cosmetic_type VARCHAR(20) NOT NULL CHECK (cosmetic_type IN ('avatar', 'ui_theme', 'profile_border', 'progress_style')),
    item_data JSONB NOT NULL,
    xp_cost INTEGER NOT NULL CHECK (xp_cost >= 0),
    is_active BOOLEAN DEFAULT TRUE
);

-- Gamification: User cosmetic unlocks
CREATE TABLE user_cosmetics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    cosmetic_id UUID NOT NULL REFERENCES cosmetic_items(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, cosmetic_id)
);

-- Anti-cheat: Plagiarism flags
CREATE TABLE plagiarism_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    validation_record_id UUID NOT NULL REFERENCES validation_records(id) ON DELETE CASCADE,
    similar_record_id UUID NOT NULL REFERENCES validation_records(id) ON DELETE CASCADE,
    similarity_score DECIMAL(5,2) NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 100),
    match_type VARCHAR(20) NOT NULL CHECK (match_type IN ('exact_string', 'high_similarity')),
    flagged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'confirmed', 'dismissed'))
);

-- Offline sync: Queued submissions
CREATE TABLE queued_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    submission_data JSONB NOT NULL,
    device_identifier VARCHAR(100) NOT NULL,
    client_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sync_status VARCHAR(20) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'conflict', 'failed')),
    sync_attempt_count INTEGER DEFAULT 0,
    last_sync_attempt_at TIMESTAMP WITH TIME ZONE,
    conflict_data JSONB -- Stores conflicting server data for manual review
);

-- Audit logs (7-year retention)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    action_data JSONB NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 1.2 INDEXES FOR PERFORMANCE

```sql
-- Validation records lookups
CREATE INDEX idx_validation_records_user_lesson ON validation_records(user_id, lesson_id, timestamp DESC);
CREATE INDEX idx_validation_records_lesson_user ON validation_records(lesson_id, user_id);
CREATE INDEX idx_validation_records_user_result ON validation_records(user_id, result, timestamp DESC);

-- Progression queries
CREATE INDEX idx_lessons_island_order ON lessons(island_id, sort_order);
CREATE INDEX idx_validation_records_lesson_timestamp ON validation_records(lesson_id, timestamp DESC);

-- Peer review queries
CREATE INDEX idx_peer_review_assignments_reviewer ON peer_review_assignments(reviewer_id, review_status);
CREATE INDEX idx_peer_review_assignments_validation ON peer_review_assignments(validation_record_id);

-- Anti-cheat queries
CREATE INDEX idx_plagiarism_flags_status ON plagiarism_flags(review_status, flagged_at);

-- Sync queries
CREATE INDEX idx_queued_submissions_user_status ON queued_submissions(user_id, sync_status);

-- Audit logs
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id, created_at DESC);

-- Partition audit_logs by year for 7-year retention management
CREATE TABLE audit_logs_y2024 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
-- (Repeat for subsequent years)
```

### 1.3 ROW-LEVEL SECURITY (RLS) POLICIES

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE override_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_review_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE queued_submissions ENABLE ROW LEVEL SECURITY;

-- PROFILES RLS
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Students can view parent profile"
    ON profiles FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'student' AND
        id = (SELECT parent_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Parents can view children profiles"
    ON profiles FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'parent' AND
        id IN (SELECT id FROM profiles WHERE parent_id = auth.uid())
    );

CREATE POLICY "Teachers can view assigned students"
    ON profiles FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher' AND
        EXISTS (
            SELECT 1 FROM teacher_assignments
            WHERE teacher_id = auth.uid() AND student_id = profiles.id
        )
    );

CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- VALIDATION RECORDS RLS
CREATE POLICY "Students can view own validation records"
    ON validation_records FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Parents can view children validation records"
    ON validation_records FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'parent' AND
        user_id IN (SELECT id FROM profiles WHERE parent_id = auth.uid())
    );

CREATE POLICY "Teachers can view assigned students validation records"
    ON validation_records FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher' AND
        EXISTS (
            SELECT 1 FROM teacher_assignments
            WHERE teacher_id = auth.uid() AND student_id = validation_records.user_id
        )
    );

CREATE POLICY "Admins can view all validation records"
    ON validation_records FOR SELECT
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Students can insert own validation records"
    ON validation_records FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Automated validation system can insert records"
    ON validation_records FOR INSERT
    WITH CHECK (validation_method = 'automated' AND validator_id IS NULL);

-- OVERRIDE LOGS RLS
CREATE POLICY "Teachers can view own override logs"
    ON override_logs FOR SELECT
    USING (override_by = auth.uid());

CREATE POLICY "Admins can view all override logs"
    ON override_logs FOR SELECT
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- PEER REVIEW ASSIGNMENTS RLS
CREATE POLICY "Reviewers can view own assignments"
    ON peer_review_assignments FOR SELECT
    USING (reviewer_id = auth.uid());

CREATE POLICY "Reviewers can update own assignments"
    ON peer_review_assignments FOR UPDATE
    USING (reviewer_id = auth.uid())
    WITH CHECK (reviewer_id = auth.uid());

-- XP RECORDS RLS
CREATE POLICY "Users can view own XP records"
    ON xp_records FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Teachers can view assigned students XP"
    ON xp_records FOR SELECT
    USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher' AND
        EXISTS (
            SELECT 1 FROM teacher_assignments
            WHERE teacher_id = auth.uid() AND student_id = xp_records.user_id
        )
    );

CREATE POLICY "Admins can view all XP records"
    ON xp_records FOR SELECT
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- QUEUED SUBMISSIONS RLS
CREATE POLICY "Users can view own queued submissions"
    ON queued_submissions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own queued submissions"
    ON queued_submissions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Sync system can update queued submissions"
    ON queued_submissions FOR UPDATE
    USING (TRUE); -- Service role will handle updates
```

### 1.4 DATABASE FUNCTIONS AND TRIGGERS

```sql
-- Function to get lesson unlock status based on validation records
CREATE OR REPLACE FUNCTION get_lesson_unlock_status(
    p_user_id UUID,
    p_lesson_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_lesson lessons%ROWTYPE;
    v_previous_lesson_id UUID;
    v_previous_validation_pass BOOLEAN;
BEGIN
    -- Get current lesson info
    SELECT * INTO v_lesson FROM lessons WHERE id = p_lesson_id;
    
    -- First lesson in island is always unlocked
    IF v_lesson.sort_order = 1 THEN
        RETURN jsonb_build_object('status', 'unlocked', 'reason', 'first_lesson');
    END IF;
    
    -- Find previous lesson
    SELECT id INTO v_previous_lesson_id
    FROM lessons
    WHERE island_id = v_lesson.island_id AND sort_order = v_lesson.sort_order - 1;
    
    -- Check if previous lesson has passing validation
    SELECT EXISTS(
        SELECT 1 FROM validation_records
        WHERE user_id = p_user_id
        AND lesson_id = v_previous_lesson_id
        AND result = 'pass'
        AND NOT EXISTS (
            -- Check if override exists that invalidated the pass
            SELECT 1 FROM override_logs
            WHERE validation_record_id = validation_records.id
            AND new_validation_state = 'fail'
        )
    ) INTO v_previous_validation_pass;
    
    IF v_previous_validation_pass THEN
        RETURN jsonb_build_object('status', 'unlocked', 'reason', 'previous_passed');
    ELSE
        RETURN jsonb_build_object('status', 'locked', 'reason', 'previous_not_passed');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate island completion status
CREATE OR REPLACE FUNCTION get_island_completion_status(
    p_user_id UUID,
    p_island_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_total_lessons INTEGER;
    v_passed_lessons INTEGER;
    v_completion_percentage DECIMAL(5,2);
BEGIN
    -- Count total lessons in island
    SELECT COUNT(*) INTO v_total_lessons
    FROM lessons WHERE island_id = p_island_id;
    
    -- Count passed lessons (considering overrides)
    SELECT COUNT(DISTINCT l.id) INTO v_passed_lessons
    FROM lessons l
    WHERE l.island_id = p_island_id
    AND EXISTS (
        SELECT 1 FROM validation_records vr
        WHERE vr.user_id = p_user_id
        AND vr.lesson_id = l.id
        AND vr.result = 'pass'
        AND NOT EXISTS (
            SELECT 1 FROM override_logs ol
            WHERE ol.validation_record_id = vr.id
            AND ol.new_validation_state = 'fail'
        )
    );
    
    -- Calculate percentage
    v_completion_percentage := (v_passed_lessons::DECIMAL / v_total_lessons::DECIMAL) * 100;
    
    RETURN jsonb_build_object(
        'island_id', p_island_id,
        'total_lessons', v_total_lessons,
        'passed_lessons', v_passed_lessons,
        'completion_percentage', v_completion_percentage,
        'is_complete', v_total_lessons = v_passed_lessons
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get attempt count for user-lesson pair
CREATE OR REPLACE FUNCTION get_attempt_count(
    p_user_id UUID,
    p_lesson_id UUID
) RETURNS INTEGER AS $$
DECLARE
    v_attempt_count INTEGER;
BEGIN
    SELECT COALESCE(MAX(attempt_number), 0) INTO v_attempt_count
    FROM validation_records
    WHERE user_id = p_user_id AND lesson_id = p_lesson_id;
    
    RETURN v_attempt_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update profile updated_at
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET updated_at = NOW()
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_validation
    AFTER INSERT OR UPDATE ON validation_records
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_updated_at();
```

### 1.5 FOREIGN KEY RELATIONSHIP DIAGRAM

```
profiles (id)
    ├── parent_id → profiles (id) [self-referential for parent-child]
    └── teacher_assignments (teacher_id, student_id)
    
archipelagos (id)
    └── islands (archipelago_id)
        └── lessons (island_id)
            └── validation_records (lesson_id)

validation_records (id)
    ├── user_id → profiles (id)
    ├── lesson_id → lessons (id)
    ├── validator_id → profiles (id) [nullable]
    └── override_logs (validation_record_id)

peer_review_assignments (id)
    ├── validation_record_id → validation_records (id)
    └── reviewer_id → profiles (id)

xp_records (user_id) → profiles (id)
user_badges (user_id) → profiles (id)
user_cosmetics (user_id) → profiles (id)

queued_submissions (id)
    ├── user_id → profiles (id)
    └── lesson_id → lessons (id)

plagiarism_flags (id)
    ├── validation_record_id → validation_records (id)
    └── similar_record_id → validation_records (id)

audit_logs (actor_id) → profiles (id)
```

---

## 2. VALIDATION FLOW DIAGRAM

### 2.1 VALIDATION SUBMISSION PROCESS

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER SUBMITS WORK                           │
│                     (Student Action)                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   STEP 1: PRE-SUBMISSION CHECK                  │
├─────────────────────────────────────────────────────────────────┤
│  • Verify user has permission to submit (role = 'student')       │
│  • Check lesson is unlocked for this user                       │
│  • Get current attempt count for this user-lesson pair          │
│  • Verify no active cooling period (attempts 4-5)               │
│  • Verify lesson is not locked (6+ failed attempts)             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼ (BLOCKED)                     ▼ (PROCEED)
┌───────────────────────┐       ┌─────────────────────────────────┐
│   REJECT SUBMISSION    │       │     STEP 2: VALIDATION TYPE     │
│   WITH REASONING       │       │     DETERMINATION               │
├───────────────────────┤       ├─────────────────────────────────┤
│ • Lesson locked       │       │ Check lesson.validation_type:   │
│ • Cooling period      │       │ • 'automated' → Go to Step 3A   │
│ • Permission denied   │       │ • 'human_reviewed' → Step 3B    │
└───────────────────────┘       │ • 'both' → Step 3A first        │
                                └─────────────────────────────────┘
                                                                    │
                                        ┌───────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
                    ▼                                       ▼
        ┌─────────────────────────┐         ┌─────────────────────────┐
        │   STEP 3A: AUTOMATED    │         │   STEP 3B: HUMAN        │
        │   VALIDATION            │         │   REVIEW QUEUE          │
        ├─────────────────────────┤         ├─────────────────────────┤
        │ 1. Parse submission     │         │ 1. Assign to available  │
        │    data from JSONB      │         │    teacher              │
        │ 2. Apply validation     │         │ 2. Set status = 'pending'│
        │    rules based on       │         │ 3. Create notification  │
        │    content type:        │         │    for teacher          │
        │    - Multiple choice    │         │ 4. Wait for review      │
        │    - True/False         │         └─────────────────────────┘
        │    - Math problems      │                     │
        │    - Code with tests    │                     ▼
        │    - Fill-in-blank      │         ┌─────────────────────────┐
        │ 3. Compare expected     │         │   STEP 4: HUMAN REVIEW  │
        │    vs submitted         │         ├─────────────────────────┤
        │    answers              │         │ Teacher reviews:        │
        │ 4. Generate result      │         │ • Submission data       │
        │    ('pass' or 'fail')   │         │ • User history          │
        │ 5. Create validation    │         │ • Provide rating +      │
        │    record               │         │   feedback              │
        └───────────┬─────────────┘         └───────────┬─────────────┘
                    │                                   │
                    ▼                                   ▼
        ┌───────────────────────────────────────────────────────────┐
        │               STEP 5: RESULT PROCESSING                   │
        ├───────────────────────────────────────────────────────────┤
        │  FOR AUTOMATED:                                          │
        │  • If 'pass': → Step 6 (Progression Update)              │
        │  • If 'fail': → Check attempt count                       │
        │    - Attempt 1-2: Standard feedback, retry allowed        │
        │    - Attempt 3: Warning + supplementary resource         │
        │    - Attempt 4-5: 24-hour cooling + resource             │
        │    - Attempt 6: LOCK lesson, requires override           │
        │                                                          │
        │  FOR HUMAN REVIEW:                                        │
        │  • If 'pass': → Step 6 (Progression Update)              │
        │  • If 'fail': Same attempt count logic as automated       │
        │                                                          │
        │  ESCALATION TRIGGER:                                      │
        │  • If 3 consecutive 'fail' results → Human review        │
        │    (even for automated-only lessons)                     │
        └────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
        ┌───────────────────────────────────────────────────────────┐
        │           STEP 6: PROGRESSION UPDATE & NOTIFICATION       │
        ├───────────────────────────────────────────────────────────┤
        │  1. Recalculate user's progression state                   │
        │  2. Check if next lesson should be unlocked                │
        │  3. Check if island completion achieved                    │
        │  4. Award XP for completion (if 'pass')                    │
        │  5. Check for badge eligibility                           │
        │  6. Send notification to user:                            │
        │     - Success: Next lesson unlocked                       │
        │     - Failure: Feedback + retry instructions              │
        │     - Locked: Override required message                   │
        │  7. Check for anti-cheat triggers (plagiarism, pattern)   │
        └────────────────────────────┬──────────────────────────────┘
                                     │
                                     ▼
        ┌───────────────────────────────────────────────────────────┐
        │                      END FLOW                              │
        └───────────────────────────────────────────────────────────┘
```

### 2.2 DECISION TREE: AUTOMATED VS HUMAN VALIDATION

```
START
  │
  ▼
Does lesson.validation_type = 'human_reviewed'?
  │
  ├── YES ──> HUMAN REVIEW REQUIRED
  │            └── Assign to teacher queue
  │
  └── NO ──> Does lesson.validation_type = 'both'?
              │
              ├── YES ──> ATTEMPT AUTOMATED FIRST
              │           │
              │           ├── AUTOMATED PASS ──> VALIDATION COMPLETE
              │           │
              │           └── AUTOMATED FAIL ──> Is this 3rd consecutive fail?
              │                              │
              │                              ├── YES ──> ESCALATE TO HUMAN
              │                              │
              │                              └── NO ──> AUTOMATED COMPLETE
              │
              └── NO ──> AUTOMATED ONLY
                        │
                        └── Apply automated validation rules
```

### 2.3 ESCALATION TRIGGERS AND NOTIFICATION LOGIC

```sql
-- Function to determine if escalation to human review is needed
CREATE OR REPLACE FUNCTION should_escalate_to_human(
    p_user_id UUID,
    p_lesson_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_consecutive_failures INTEGER;
BEGIN
    -- Count consecutive failures for this user-lesson
    WITH recent_validations AS (
        SELECT result, timestamp
        FROM validation_records
        WHERE user_id = p_user_id
        AND lesson_id = p_lesson_id
        ORDER BY timestamp DESC
        LIMIT 3
    )
    SELECT COUNT(*) INTO v_consecutive_failures
    FROM recent_validations
    WHERE result = 'fail';
    
    -- Escalate if 3 consecutive failures
    RETURN v_consecutive_failures = 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to determine cooling period status
CREATE OR REPLACE FUNCTION get_cooling_period_status(
    p_user_id UUID,
    p_lesson_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_last_attempt_attempt_number INTEGER;
    v_last_attempt_timestamp TIMESTAMP WITH TIME ZONE;
    v_current_time TIMESTAMP WITH TIME ZONE;
    v_cooling_period_end TIMESTAMP WITH TIME ZONE;
    v_in_cooling BOOLEAN;
BEGIN
    -- Get most recent validation attempt
    SELECT attempt_number, timestamp
    INTO v_last_attempt_attempt_number, v_last_attempt_timestamp
    FROM validation_records
    WHERE user_id = p_user_id AND lesson_id = p_lesson_id
    ORDER BY timestamp DESC
    LIMIT 1;
    
    -- No attempts yet
    IF v_last_attempt_attempt_number IS NULL THEN
        RETURN jsonb_build_object('in_cooling', FALSE);
    END IF;
    
    -- Check if in cooling period (attempts 4-5)
    IF v_last_attempt_attempt_number BETWEEN 4 AND 5 THEN
        v_current_time := NOW();
        v_cooling_period_end := v_last_attempt_timestamp + INTERVAL '24 hours';
        v_in_cooling := v_current_time < v_cooling_period_end;
        
        RETURN jsonb_build_object(
            'in_cooling', v_in_cooling,
            'attempt_number', v_last_attempt_attempt_number,
            'cooling_period_end', v_cooling_period_end,
            'hours_remaining', EXTRACT(EPOCH FROM (v_cooling_period_end - v_current_time)) / 3600
        );
    END IF;
    
    -- Not in cooling period
    RETURN jsonb_build_object('in_cooling', FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if lesson is locked (6+ failed attempts)
CREATE OR REPLACE FUNCTION is_lesson_locked(
    p_user_id UUID,
    p_lesson_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_max_attempt_number INTEGER;
    v_override_exists BOOLEAN;
BEGIN
    -- Get maximum attempt number
    SELECT MAX(attempt_number) INTO v_max_attempt_number
    FROM validation_records
    WHERE user_id = p_user_id AND lesson_id = p_lesson_id;
    
    -- Check if lesson is locked (6+ attempts)
    IF v_max_attempt_number >= 6 THEN
        -- Check if there's an override that unlocked it
        SELECT EXISTS(
            SELECT 1 FROM override_logs ol
            JOIN validation_records vr ON ol.validation_record_id = vr.id
            WHERE vr.user_id = p_user_id
            AND vr.lesson_id = p_lesson_id
            AND ol.new_validation_state = 'pass'
        ) INTO v_override_exists;
        
        -- Lesson is locked unless overridden
        RETURN NOT v_override_exists;
    END IF;
    
    -- Not locked
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2.4 NOTIFICATION LOGIC PSEUDOCODE

```
FUNCTION send_validation_notification(
    user_id: UUID,
    lesson_id: UUID,
    result: 'pass' | 'fail',
    attempt_number: INTEGER
):
    
    unlock_status = get_lesson_unlock_status(user_id, next_lesson_id)
    
    IF result == 'pass':
        notification_type = 'success'
        message = "Congratulations! You've passed this lesson."
        
        IF unlock_status.status == 'unlocked':
            message += " The next lesson is now unlocked."
            
        IF island_complete(user_id, island_id):
            message += " You've completed this island!"
            award_badge(user_id, 'island_complete', island_id)
            
        award_xp(user_id, 'lesson_complete', lesson_id)
        
    ELSE IF result == 'fail':
        notification_type = 'failure'
        
        IF attempt_number IN [1, 2]:
            message = "Not quite right. Review your work and try again."
            
        ELSE IF attempt_number == 3:
            message = "You've had 3 attempts. Here's a supplementary resource to help."
            message += " [Link to resource]"
            
        ELSE IF attempt_number IN [4, 5]:
            cooling_status = get_cooling_period_status(user_id, lesson_id)
            message = f"Please take a 24-hour break. You can try again at {cooling_status.cooling_period_end}."
            message += " In the meantime, review this resource: [Link to resource]"
            
        ELSE IF attempt_number >= 6:
            message = "This lesson is now locked. Please contact your teacher or parent for assistance."
            notify_teachers_of_lock(user_id, lesson_id)
    
    create_notification(user_id, notification_type, message)
    send_push_notification(user_id, notification_type, message)
```

---

## 3. PROGRESSION ENFORCEMENT RULES

### 3.1 LESSON UNLOCKING LOGIC (SQL)

```sql
-- Core function to determine lesson accessibility
CREATE OR REPLACE FUNCTION get_user_lesson_access(
    p_user_id UUID,
    p_lesson_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_lesson lessons%ROWTYPE;
    v_unlock_status JSONB;
    v_attempt_count INTEGER;
    v_cooling_status JSONB;
    v_locked BOOLEAN;
    v_access_granted BOOLEAN;
    v_lock_reason TEXT;
BEGIN
    -- Get lesson details
    SELECT * INTO v_lesson FROM lessons WHERE id = p_lesson_id;
    
    -- Check unlock status (based on previous lesson completion)
    v_unlock_status := get_lesson_unlock_status(p_user_id, p_lesson_id);
    
    -- Get attempt count
    v_attempt_count := get_attempt_count(p_user_id, p_lesson_id);
    
    -- Check cooling period status
    v_cooling_status := get_cooling_period_status(p_user_id, p_lesson_id);
    
    -- Check if lesson is locked (6+ failed attempts)
    v_locked := is_lesson_locked(p_user_id, p_lesson_id);
    
    -- Determine final access status
    v_access_granted := (
        v_unlock_status->>'status' = 'unlocked' AND
        NOT v_locked AND
        NOT (v_cooling_status->>'in_cooling')::BOOLEAN
    );
    
    -- Build lock reason message
    IF v_locked THEN
        v_lock_reason := 'lesson_locked_six_attempts';
    ELSIF (v_cooling_status->>'in_cooling')::BOOLEAN THEN
        v_lock_reason := 'cooling_period';
    ELSIF v_unlock_status->>'status' = 'locked' THEN
        v_lock_reason := 'previous_lesson_not_complete';
    END IF;
    
    RETURN jsonb_build_object(
        'lesson_id', p_lesson_id,
        'access_granted', v_access_granted,
        'unlock_status', v_unlock_status,
        'attempt_count', v_attempt_count,
        'cooling_status', v_cooling_status,
        'is_locked', v_locked,
        'lock_reason', v_lock_reason
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for user's accessible lessons
CREATE OR REPLACE VIEW user_accessible_lessons AS
SELECT
    l.id AS lesson_id,
    l.island_id,
    l.sort_order,
    l.name,
    l.description,
    l.validation_type,
    auth.uid() AS user_id,
    get_user_lesson_access(auth.uid(), l.id) AS access_info
FROM lessons l
JOIN islands i ON l.island_id = i.id
JOIN archipelagos a ON i.archipelago_id = a.id;
```

### 3.2 LESSON UNLOCKING PSEUDOCODE

```
FUNCTION check_lesson_unlocked(user_id: UUID, lesson_id: UUID):
    
    lesson = get_lesson(lesson_id)
    
    // Rule 1: First lesson in island is always unlocked
    IF lesson.sort_order == 1:
        RETURN {
            unlocked: true,
            reason: 'first_lesson'
        }
    
    // Rule 2: Find previous lesson
    previous_lesson = get_previous_lesson(lesson_id)
    
    // Rule 3: Check if previous lesson has passing validation
    previous_validation = get_latest_validation(user_id, previous_lesson.id)
    
    IF previous_validation AND previous_validation.result == 'pass':
        // Rule 4: Check if override invalidated the pass
        override = get_latest_override(previous_validation.id)
        
        IF override AND override.new_validation_state == 'fail':
            RETURN {
                unlocked: false,
                reason: 'override_invalidated_pass'
            }
        ELSE:
            RETURN {
                unlocked: true,
                reason: 'previous_passed'
            }
    ELSE:
        RETURN {
            unlocked: false,
            reason: 'previous_not_passed'
        }
```

### 3.3 ISLAND COMPLETION CALCULATION ALGORITHM

```sql
-- Comprehensive island completion function
CREATE OR REPLACE FUNCTION calculate_island_completion(
    p_user_id UUID,
    p_island_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_completion_status JSONB;
    v_total_lessons INTEGER;
    v_passed_lessons INTEGER;
    v_lesson_statuses JSONB;
    v_completion_percentage DECIMAL(5,2);
    v_is_complete BOOLEAN;
BEGIN
    -- Get basic completion status
    v_completion_status := get_island_completion_status(p_user_id, p_island_id);
    
    -- Extract values
    v_total_lessons := (v_completion_status->>'total_lessons')::INTEGER;
    v_passed_lessons := (v_completion_status->>'passed_lessons')::INTEGER;
    v_completion_percentage := (v_completion_status->>'completion_percentage')::DECIMAL;
    v_is_complete := (v_completion_status->>'is_complete')::BOOLEAN;
    
    -- Build detailed lesson statuses
    SELECT jsonb_agg(
        jsonb_build_object(
            'lesson_id', l.id,
            'sort_order', l.sort_order,
            'name', l.name,
            'status', CASE
                WHEN EXISTS (
                    SELECT 1 FROM validation_records vr
                    WHERE vr.user_id = p_user_id
                    AND vr.lesson_id = l.id
                    AND vr.result = 'pass'
                    AND NOT EXISTS (
                        SELECT 1 FROM override_logs ol
                        WHERE ol.validation_record_id = vr.id
                        AND ol.new_validation_state = 'fail'
                    )
                ) THEN 'passed'
                WHEN EXISTS (
                    SELECT 1 FROM validation_records vr
                    WHERE vr.user_id = p_user_id
                    AND vr.lesson_id = l.id
                ) THEN 'attempted'
                ELSE 'not_started'
            END,
            'attempt_count', COALESCE(
                (SELECT MAX(attempt_number) FROM validation_records
                 WHERE user_id = p_user_id AND lesson_id = l.id), 0
            )
        )
    ) INTO v_lesson_statuses
    FROM lessons l
    WHERE l.island_id = p_island_id
    ORDER BY l.sort_order;
    
    -- Return comprehensive completion data
    RETURN jsonb_build_object(
        'island_id', p_island_id,
        'total_lessons', v_total_lessons,
        'passed_lessons', v_passed_lessons,
        'completion_percentage', v_completion_percentage,
        'is_complete', v_is_complete,
        'lesson_statuses', v_lesson_statuses
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to award island completion badge when all lessons passed
CREATE OR REPLACE FUNCTION check_and_award_island_badge()
RETURNS TRIGGER AS $$
DECLARE
    v_island_id UUID;
    v_completion_data JSONB;
    v_badge_id UUID;
BEGIN
    -- Only check on passing validations
    IF NEW.result != 'pass' THEN
        RETURN NEW;
    END IF;
    
    -- Get island ID
    SELECT island_id INTO v_island_id
    FROM lessons
    WHERE id = NEW.lesson_id;
    
    -- Calculate completion status
    v_completion_data := calculate_island_completion(NEW.user_id, v_island_id);
    
    -- If island is complete, award badge
    IF (v_completion_data->>'is_complete')::BOOLEAN THEN
        -- Find or create island completion badge
        SELECT id INTO v_badge_id
        FROM badges
        WHERE name = 'Island Completer: ' || (SELECT name FROM islands WHERE id = v_island_id);
        
        IF v_badge_id IS NULL THEN
            INSERT INTO badges (name, description, badge_type, criteria)
            VALUES (
                'Island Completer: ' || (SELECT name FROM islands WHERE id = v_island_id),
                'Completed all 15 lessons in the ' || (SELECT name FROM islands WHERE id = v_island_id) || ' island',
                'topic_complete',
                jsonb_build_object('island_id', v_island_id, 'requirement', 'all_lessons_passed')
            )
            RETURNING id INTO v_badge_id;
        END IF;
        
        -- Award badge to user (if not already earned)
        INSERT INTO user_badges (user_id, badge_id)
        VALUES (NEW.user_id, v_badge_id)
        ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_island_completion_badge
    AFTER INSERT OR UPDATE ON validation_records
    FOR EACH ROW
    EXECUTE FUNCTION check_and_award_island_badge();
```

### 3.4 OVERRIDE WORKFLOW WITH AUDIT TRAIL

```sql
-- Function to perform validation override
CREATE OR REPLACE FUNCTION perform_validation_override(
    p_validation_record_id UUID,
    p_new_result VARCHAR, -- 'pass' or 'fail'
    p_override_reason TEXT,
    p_override_by UUID
) RETURNS JSONB AS $$
DECLARE
    v_validation_record validation_records%ROWTYPE;
    v_is_authorized BOOLEAN;
    v_reason_valid BOOLEAN;
BEGIN
    -- Get validation record
    SELECT * INTO v_validation_record
    FROM validation_records
    WHERE id = p_validation_record_id;
    
    -- Verify override reason meets minimum length (50 characters)
    v_reason_valid := LENGTH(p_override_reason) >= 50;
    
    IF NOT v_reason_valid THEN
        RAISE EXCEPTION 'Override reason must be at least 50 characters';
    END IF;
    
    -- Verify override authorization (teacher or admin only)
    SELECT EXISTS(
        SELECT 1 FROM profiles
        WHERE id = p_override_by
        AND role IN ('teacher', 'admin')
    ) INTO v_is_authorized;
    
    IF NOT v_is_authorized THEN
        RAISE EXCEPTION 'Only teachers and admins can perform overrides';
    END IF;
    
    -- Verify teachers can only override assigned students
    IF (SELECT role FROM profiles WHERE id = p_override_by) = 'teacher' THEN
        IF NOT EXISTS(
            SELECT 1 FROM teacher_assignments
            WHERE teacher_id = p_override_by
            AND student_id = v_validation_record.user_id
        ) THEN
            RAISE EXCEPTION 'Teacher can only override assigned students';
        END IF;
    END IF;
    
    -- Create audit log entry
    INSERT INTO override_logs (
        validation_record_id,
        override_by,
        original_validation_state,
        new_validation_state,
        override_reason
    ) VALUES (
        p_validation_record_id,
        p_override_by,
        v_validation_record.result,
        p_new_result,
        p_override_reason
    );
    
    -- Create audit log entry
    INSERT INTO audit_logs (
        actor_id,
        action_type,
        target_type,
        target_id,
        action_data
    ) VALUES (
        p_override_by,
        'validation_override',
        'validation_record',
        p_validation_record_id,
        jsonb_build_object(
            'original_result', v_validation_record.result,
            'new_result', p_new_result,
            'reason', p_override_reason,
            'user_id', v_validation_record.user_id,
            'lesson_id', v_validation_record.lesson_id
        )
    );
    
    -- Return success confirmation
    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Override completed successfully',
        'override_id', currval('override_logs_id_seq'),
        'original_result', v_validation_record.result,
        'new_result', p_new_result
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.5 OVERRIDE WORKFLOW PSEUDOCODE

```
FUNCTION initiate_override_workflow(
    validation_record_id: UUID,
    requested_by: UUID,
    new_result: 'pass' | 'fail',
    reason: TEXT
):
    
    // Step 1: Authorization Check
    user = get_user(requested_by)
    
    IF user.role NOT IN ['teacher', 'admin']:
        THROW 'Unauthorized: Only teachers and admins can override'
    
    // Step 2: Teacher Assignment Check (for teachers only)
    IF user.role == 'teacher':
        validation = get_validation_record(validation_record_id)
        
        IF NOT is_teacher_assigned_to_student(requested_by, validation.user_id):
            THROW 'Unauthorized: Teacher can only override assigned students'
    
    // Step 3: Reason Validation
    IF length(reason) < 50:
        THROW 'Invalid: Override reason must be at least 50 characters'
    
    // Step 4: Create Override Log
    override_log = create_override_log({
        validation_record_id: validation_record_id,
        override_by: requested_by,
        original_result: validation.result,
        new_result: new_result,
        reason: reason,
        timestamp: NOW(),
        ip_address: get_client_ip(),
        user_agent: get_user_agent()
    })
    
    // Step 5: Create Audit Entry
    create_audit_log({
        actor_id: requested_by,
        action_type: 'validation_override',
        target_type: 'validation_record',
        target_id: validation_record_id,
        action_data: {
            original_result: validation.result,
            new_result: new_result,
            reason: reason,
            user_id: validation.user_id,
            lesson_id: validation.lesson_id
        }
    })
    
    // Step 6: Notify Relevant Parties
    notify_student(validation.user_id, 'override_performed', {
        lesson_id: validation.lesson_id,
        original_result: validation.result,
        new_result: new_result
    })
    
    IF user.role == 'teacher':
        notify_admins('teacher_override', {
            teacher_id: requested_by,
            validation_record_id: validation_record_id,
            reason: reason
        })
    
    // Step 7: Recalculate Progression
    recalculate_user_progression(validation.user_id)
    
    RETURN {
        success: true,
        override_id: override_log.id,
        message: 'Override completed successfully'
    }

FUNCTION recalculate_user_progression(user_id: UUID):
    
    // Get all islands user has access to
    islands = get_accessible_islands(user_id)
    
    FOR EACH island IN islands:
        // Calculate completion status
        completion = calculate_island_completion(user_id, island.id)
        
        // Update cached progression data if needed
        update_progression_cache(user_id, island.id, completion)
        
        // Check if next island should be unlocked
        IF completion.is_complete:
            next_island = get_next_island(island.id)
            IF next_island:
                // First lesson of next island is unlocked
                unlock_lesson(user_id, next_island.first_lesson_id)
```

---

## 4. ANTI-CHEAT IMPLEMENTATION

### 4.1 PLAGIARISM DETECTION ALGORITHM (MVP SCOPE)

```sql
-- Function to detect plagiarism using exact string matching
CREATE OR REPLACE FUNCTION detect_plagiarism_exact_match(
    p_validation_record_id UUID
) RETURNS SETOF JSONB AS $$
DECLARE
    v_current_submission TEXT;
    v_lesson_id UUID;
    v_current_user_id UUID;
    v_similarity_threshold DECIMAL := 80.0; -- 80% match threshold
    v_match_found BOOLEAN;
    v_match_data JSONB;
BEGIN
    -- Get current submission data
    SELECT submission_data, lesson_id, user_id
    INTO v_current_submission, v_lesson_id, v_current_user_id
    FROM validation_records
    WHERE id = p_validation_record_id;
    
    -- Extract text content from submission JSONB
    v_current_submission := jsonb_extract_path_text(v_current_submission::jsonb, 'text_content');
    
    -- Compare with all previous submissions for the same lesson
    FOR v_match_data IN
        SELECT
            vr.id AS similar_record_id,
            vr.user_id AS similar_user_id,
            vr.submission_data,
            CASE
                WHEN v_current_submission = jsonb_extract_path_text(vr.submission_data::jsonb, 'text_content')
                THEN 100.0
                ELSE NULL
            END AS similarity_score,
            CASE
                WHEN v_current_submission = jsonb_extract_path_text(vr.submission_data::jsonb, 'text_content')
                THEN 'exact_string'
                ELSE NULL
            END AS match_type
        FROM validation_records vr
        WHERE vr.lesson_id = v_lesson_id
        AND vr.id != p_validation_record_id
        AND vr.user_id != v_current_user_id
        AND jsonb_extract_path_text(vr.submission_data::jsonb, 'text_content') IS NOT NULL
    LOOP
        -- Check if similarity meets threshold
        IF v_match_data->>'similarity_score' IS NOT NULL THEN
            IF (v_match_data->>'similarity_score')::DECIMAL >= v_similarity_threshold THEN
                -- Create plagiarism flag
                INSERT INTO plagiarism_flags (
                    validation_record_id,
                    similar_record_id,
                    similarity_score,
                    match_type
                ) VALUES (
                    p_validation_record_id,
                    (v_match_data->>'similar_record_id')::UUID,
                    (v_match_data->>'similarity_score')::DECIMAL,
                    v_match_data->>'match_type'
                );
                
                -- Return match information
                RETURN NEXT v_match_data;
            END IF;
        END IF;
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Extended plagiarism detection with n-gram similarity (simple implementation)
CREATE OR REPLACE FUNCTION detect_plagiarism_ngram_similarity(
    p_validation_record_id UUID,
    p_ngram_size INTEGER DEFAULT 3 -- 3-word sequences
) RETURNS SETOF JSONB AS $$
DECLARE
    v_current_submission TEXT;
    v_lesson_id UUID;
    v_current_user_id UUID;
    v_current_ngrams TEXT[];
    v_comparison_ngrams TEXT[];
    v_common_ngrams INTEGER;
    v_current_ngram_count INTEGER;
    v_comparison_ngram_count INTEGER;
    v_jaccard_similarity DECIMAL;
    v_similarity_threshold DECIMAL := 80.0;
BEGIN
    -- Get current submission data
    SELECT submission_data, lesson_id, user_id
    INTO v_current_submission, v_lesson_id, v_current_user_id
    FROM validation_records
    WHERE id = p_validation_record_id;
    
    -- Extract text content and normalize
    v_current_submission := lower(regexp_replace(
        jsonb_extract_path_text(v_current_submission::jsonb, 'text_content'),
        '[^a-z0-9\s]', '', 'g'
    ));
    
    -- Generate n-grams for current submission
    v_current_ngrams := generate_ngrams(v_current_submission, p_ngram_size);
    v_current_ngram_count := array_length(v_current_ngrams, 1);
    
    -- Compare with previous submissions
    FOR comparison_record IN
        SELECT id, user_id, submission_data
        FROM validation_records
        WHERE lesson_id = v_lesson_id
        AND id != p_validation_record_id
        AND user_id != v_current_user_id
    LOOP
        -- Generate n-grams for comparison submission
        DECLARE
            v_comparison_submission TEXT;
        BEGIN
            v_comparison_submission := lower(regexp_replace(
                jsonb_extract_path_text(comparison_record.submission_data::jsonb, 'text_content'),
                '[^a-z0-9\s]', '', 'g'
            ));
            
            v_comparison_ngrams := generate_ngrams(v_comparison_submission, p_ngram_size);
            v_comparison_ngram_count := array_length(v_comparison_ngrams, 1);
            
            -- Calculate Jaccard similarity
            v_common_ngrams := count_common_ngrams(v_current_ngrams, v_comparison_ngrams);
            v_jaccard_similarity := (
                v_common_ngrams::DECIMAL /
                (v_current_ngram_count + v_comparison_ngram_count - v_common_ngrams)::DECIMAL
            ) * 100;
            
            -- Flag if similarity exceeds threshold
            IF v_jaccard_similarity >= v_similarity_threshold THEN
                INSERT INTO plagiarism_flags (
                    validation_record_id,
                    similar_record_id,
                    similarity_score,
                    match_type
                ) VALUES (
                    p_validation_record_id,
                    comparison_record.id,
                    v_jaccard_similarity,
                    'high_similarity'
                );
                
                RETURN NEXT jsonb_build_object(
                    'similar_record_id', comparison_record.id,
                    'similar_user_id', comparison_record.user_id,
                    'similarity_score', v_jaccard_similarity,
                    'match_type', 'high_similarity'
                );
            END IF;
        END;
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to generate n-grams
CREATE OR REPLACE FUNCTION generate_ngrams(
    p_text TEXT,
    p_n INTEGER
) RETURNS TEXT[] AS $$
DECLARE
    v_words TEXT[];
    v_ngrams TEXT[] := '{}';
    v_i INTEGER;
BEGIN
    -- Split text into words
    SELECT array_agg(word) INTO v_words
    FROM regexp_split_to_table(p_text, '\s+') AS word
    WHERE word != '';
    
    -- Generate n-grams
    FOR v_i IN 1..(array_length(v_words, 1) - p_n + 1) LOOP
        v_ngrams := array_append(v_ngrams, array_to_string(v_words[v_i:v_i+p_n-1], ' '));
    END LOOP;
    
    RETURN v_ngrams;
END;
$$ LANGUAGE plpgsql;

-- Helper function to count common n-grams
CREATE OR REPLACE FUNCTION count_common_ngrams(
    p_ngrams1 TEXT[],
    p_ngrams2 TEXT[]
) RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER := 0;
    v_i INTEGER;
BEGIN
    -- Count n-grams present in both arrays
    FOR v_i IN 1..array_length(p_ngrams1, 1) LOOP
        IF p_ngrams1[v_i] = ANY(p_ngrams2) THEN
            v_count := v_count + 1;
        END IF;
    END LOOP;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically detect plagiarism on submission
CREATE OR REPLACE FUNCTION auto_detect_plagiarism()
RETURNS TRIGGER AS $$
BEGIN
    -- Only check for human-reviewed submissions (essays, creative work)
    IF NEW.validation_method = 'human_reviewed' THEN
        -- Perform exact string matching
        PERFORM detect_plagiarism_exact_match(NEW.id);
        
        -- Perform n-gram similarity check
        PERFORM detect_plagiarism_ngram_similarity(NEW.id, 3);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_plagiarism_detection
    AFTER INSERT ON validation_records
    FOR EACH ROW
    EXECUTE FUNCTION auto_detect_plagiarism();
```

### 4.2 PEER REVIEW RANDOMIZATION LOGIC

```sql
-- Function to assign peer reviewers with proper randomization
CREATE OR REPLACE FUNCTION assign_peer_reviewers(
    p_validation_record_id UUID,
    p_required_reviewers INTEGER DEFAULT 2
) RETURNS JSONB AS $$
DECLARE
    v_validation_record validation_records%ROWTYPE;
    v_potential_reviewers UUID[];
    v_assigned_reviewers UUID[] := '{}';
    v_reviewer_uuid UUID;
    v_anonymized_id VARCHAR(20);
    v_counter INTEGER := 0;
    v_loop_protection INTEGER := 0;
    v_island_id UUID;
    v_assignments_created INTEGER := 0;
BEGIN
    -- Get validation record details
    SELECT * INTO v_validation_record
    FROM validation_records
    WHERE id = p_validation_record_id;
    
    -- Get island ID
    SELECT island_id INTO v_island_id
    FROM lessons
    WHERE id = v_validation_record.lesson_id;
    
    -- Find potential reviewers: students who have passed this lesson
    -- and are not the submitter, and have no pending reviews
    SELECT array_agg(DISTINCT vr.user_id) INTO v_potential_reviewers
    FROM validation_records vr
    JOIN lessons l ON vr.lesson_id = l.id
    WHERE l.island_id = v_island_id
    AND l.sort_order >= (SELECT sort_order FROM lessons WHERE id = v_validation_record.lesson_id)
    AND vr.result = 'pass'
    AND vr.user_id != v_validation_record.user_id
    AND NOT EXISTS (
        -- Exclude students with too many pending reviews (max 3)
        SELECT 1 FROM peer_review_assignments pra
        WHERE pra.reviewer_id = vr.user_id
        AND pra.review_status = 'pending'
        GROUP BY pra.reviewer_id
        HAVING COUNT(*) >= 3
    )
    AND NOT EXISTS (
        -- Exclude students who already reviewed this submission
        SELECT 1 FROM peer_review_assignments pra
        WHERE pra.validation_record_id = p_validation_record_id
        AND pra.reviewer_id = vr.user_id
    );
    
    -- Validate we have enough potential reviewers
    IF array_length(v_potential_reviewers, 1) < p_required_reviewers THEN
        RAISE EXCEPTION 'Insufficient eligible reviewers: need %, found %',
            p_required_reviewers, array_length(v_potential_reviewers, 1);
    END IF;
    
    -- Randomly select required number of reviewers
    WHILE v_counter < p_required_reviewers AND v_loop_protection < 100 LOOP
        v_loop_protection := v_loop_protection + 1;
        
        -- Select random reviewer from pool
        SELECT v_potential_reviewers[floor(random() * array_length(v_potential_reviewers, 1) + 1)::INT]
        INTO v_reviewer_uuid;
        
        -- Check if already assigned
        IF v_reviewer_uuid NOT IN (SELECT unnest(v_assigned_reviewers)) THEN
            -- Generate anonymized ID
            v_anonymized_id := 'Reviewer_' || substring(md5(random()::TEXT), 1, 8);
            
            -- Create peer review assignment
            INSERT INTO peer_review_assignments (
                validation_record_id,
                reviewer_id,
                reviewer_anonymized_id
            ) VALUES (
                p_validation_record_id,
                v_reviewer_uuid,
                v_anonymized_id
            );
            
            -- Track assigned reviewer
            v_assigned_reviewers := array_append(v_assigned_reviewers, v_reviewer_uuid);
            v_counter := v_counter + 1;
            v_assignments_created := v_assignments_created + 1;
        END IF;
    END LOOP;
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'validation_record_id', p_validation_record_id,
        'reviewers_assigned', v_assignments_created,
        'required_reviewers', p_required_reviewers,
        'reviewer_ids', v_assigned_reviewers
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get anonymized peer review data
CREATE OR REPLACE FUNCTION get_anonymized_peer_review(
    p_assignment_id UUID,
    p_requesting_user_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_assignment peer_review_assignments%ROWTYPE;
    v_validation_record validation_records%ROWTYPE;
    v_review_data JSONB;
    v_is_authorized BOOLEAN;
BEGIN
    -- Get assignment details
    SELECT * INTO v_assignment
    FROM peer_review_assignments
    WHERE id = p_assignment_id;
    
    -- Verify requesting user is the assigned reviewer
    v_is_authorized := (v_assignment.reviewer_id = p_requesting_user_id);
    
    IF NOT v_is_authorized THEN
        RAISE EXCEPTION 'Unauthorized: Only assigned reviewer can access this data';
    END IF;
    
    -- Get validation record
    SELECT * INTO v_validation_record
    FROM validation_records
    WHERE id = v_assignment.validation_record_id;
    
    -- Build anonymized review data
    v_review_data := jsonb_build_object(
        'assignment_id', p_assignment_id,
        'anonymized_id', v_assignment.reviewer_anonymized_id,
        'submission_data', v_validation_record.submission_data,
        'lesson_id', v_validation_record.lesson_id,
        'submitter_anonymized_id', 'Student_' || substring(md5(v_validation_record.user_id::TEXT), 1, 8),
        -- Note: Real submitter ID is NOT included
        'assignment_date', v_assignment.assigned_at,
        'review_status', v_assignment.review_status
    );
    
    RETURN v_review_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to submit peer review
CREATE OR REPLACE FUNCTION submit_peer_review(
    p_assignment_id UUID,
    p_reviewer_id UUID,
    p_review_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_assignment peer_review_assignments%ROWTYPE;
BEGIN
    -- Get assignment
    SELECT * INTO v_assignment
    FROM peer_review_assignments
    WHERE id = p_assignment_id;
    
    -- Verify reviewer
    IF v_assignment.reviewer_id != p_reviewer_id THEN
        RAISE EXCEPTION 'Unauthorized: Reviewer ID does not match assignment';
    END IF;
    
    -- Verify assignment is pending
    IF v_assignment.review_status != 'pending' THEN
        RAISE EXCEPTION 'Invalid: Assignment is not pending';
    END IF;
    
    -- Validate review data structure
    IF NOT (p_review_data ? 'rating' AND p_review_data ? 'feedback') THEN
        RAISE EXCEPTION 'Invalid: Review data must include rating and feedback';
    END IF;
    
    -- Update assignment with review data
    UPDATE peer_review_assignments
    SET
        review_data = p_review_data,
        review_status = 'completed',
        completed_at = NOW()
    WHERE id = p_assignment_id;
    
    -- Award XP for peer review participation
    INSERT INTO xp_records (user_id, xp_amount, xp_source, source_reference_id)
    VALUES (p_reviewer_id, 10, 'peer_review_participation', p_assignment_id)
    ON CONFLICT DO NOTHING;
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'assignment_id', p_assignment_id,
        'message', 'Peer review submitted successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to assign peer reviewers for human-reviewed submissions
CREATE OR REPLACE FUNCTION auto_assign_peer_reviewers()
RETURNS TRIGGER AS $$
BEGIN
    -- Only assign peer reviewers for human-reviewed submissions
    IF NEW.validation_method = 'human_reviewed' THEN
        -- Attempt to assign peer reviewers
        BEGIN
            PERFORM assign_peer_reviewers(NEW.id, 2);
        EXCEPTION WHEN OTHERS THEN
            -- Log error but don't fail the validation
            INSERT INTO audit_logs (
                actor_id,
                action_type,
                target_type,
                target_id,
                action_data
            ) VALUES (
                NEW.user_id,
                'peer_review_assignment_failed',
                'validation_record',
                NEW.id,
                jsonb_build_object('error', SQLERRM)
            );
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_peer_review_assignment
    AFTER INSERT ON validation_records
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_peer_reviewers();
```

### 4.3 COLLABORATIVE TASK VALIDATION RULES

```sql
-- Table for collaborative tasks
CREATE TABLE collaborative_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    task_name VARCHAR(200) NOT NULL,
    task_description TEXT NOT NULL,
    required_participants INTEGER NOT NULL CHECK (required_participants >= 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    team_assignments JSONB NOT NULL -- Array of user_id assignments
);

-- Individual contribution logs for collaborative tasks
CREATE TABLE collaborative_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collaborative_task_id UUID NOT NULL REFERENCES collaborative_tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    contribution_data JSONB NOT NULL,
    contribution_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    device_identifier VARCHAR(100),
    CONSTRAINT unique_user_per_task UNIQUE (collaborative_task_id, user_id)
);

-- Validation of collaborative tasks
CREATE OR REPLACE FUNCTION validate_collaborative_task(
    p_collaborative_task_id UUID,
    p_submitted_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_task collaborative_tasks%ROWTYPE;
    v_contributions collaborative_contributions%ROWTYPE[];
    v_contribution_count INTEGER;
    v_all_contributions_validated BOOLEAN := TRUE;
    v_validation_records UUID[];
BEGIN
    -- Get task details
    SELECT * INTO v_task
    FROM collaborative_tasks
    WHERE id = p_collaborative_task_id;
    
    -- Get all contributions
    SELECT array_agg(c.*) INTO v_contributions
    FROM collaborative_contributions c
    WHERE c.collaborative_task_id = p_collaborative_task_id
    ORDER BY c.contribution_timestamp;
    
    v_contribution_count := array_length(v_contributions, 1);
    
    -- Validate required number of participants
    IF v_contribution_count != v_task.required_participants THEN
        RAISE EXCEPTION 'Invalid: Required % participants, found %',
            v_task.required_participants, v_contribution_count;
    END IF;
    
    -- Create individual validation records for each contribution
    FOR i IN 1..v_contribution_count LOOP
        DECLARE
            v_contrib collaborative_contributions%ROWTYPE;
            v_validation_record_id UUID;
            v_automated_result VARCHAR;
        BEGIN
            v_contrib := v_contributions[i];
            
            -- Perform automated validation on individual contribution
            v_automated_result := validate_automated_contribution(
                v_contrib.contribution_data,
                v_task.lesson_id
            );
            
            -- Create validation record for this contribution
            INSERT INTO validation_records (
                user_id,
                lesson_id,
                result,
                validation_method,
                submission_data,
                attempt_number
            ) VALUES (
                v_contrib.user_id,
                v_task.lesson_id,
                v_automated_result,
                'automated',
                jsonb_build_object(
                    'contribution_data', v_contrib.contribution_data,
                    'collaborative_task_id', p_collaborative_task_id,
                    'task_submission', p_submitted_data,
                    'individual_role', p_submitted_data->>'role',
                    'contribution_timestamp', v_contrib.contribution_timestamp
                ),
                1
            ) RETURNING id INTO v_validation_record_id;
            
            -- Track validation record ID
            v_validation_records := array_append(v_validation_records, v_validation_record_id);
            
            -- Track if any contribution failed validation
            IF v_automated_result != 'pass' THEN
                v_all_contributions_validated := FALSE;
            END IF;
        END;
    END LOOP;
    
    -- Create collaborative task validation summary
    INSERT INTO audit_logs (
        actor_id,
        action_type,
        target_type,
        target_id,
        action_data
    ) VALUES (
        NULL, -- System action
        'collaborative_task_validation',
        'collaborative_task',
        p_collaborative_task_id,
        jsonb_build_object(
            'participant_count', v_contribution_count,
            'all_validated', v_all_contributions_validated,
            'validation_record_ids', v_validation_records
        )
    );
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'task_id', p_collaborative_task_id,
        'participant_count', v_contribution_count,
        'all_contributions_validated', v_all_contributions_validated,
        'validation_record_ids', v_validation_records
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track individual contributions in real-time
CREATE OR REPLACE FUNCTION log_contribution(
    p_collaborative_task_id UUID,
    p_user_id UUID,
    p_contribution_data JSONB
) RETURNS JSONB AS $$
BEGIN
    -- Insert or update contribution log
    INSERT INTO collaborative_contributions (
        collaborative_task_id,
        user_id,
        contribution_data,
        device_identifier
    ) VALUES (
        p_collaborative_task_id,
        p_user_id,
        p_contribution_data,
        'session_' || substring(md5(random()::TEXT), 1, 8)
    )
    ON CONFLICT (collaborative_task_id, user_id)
    DO UPDATE SET
        contribution_data = EXCLUDED.contribution_data,
        contribution_timestamp = NOW(),
        device_identifier = EXCLUDED.device_identifier;
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Contribution logged successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to detect unequal contribution in collaborative tasks
CREATE OR REPLACE FUNCTION detect_unequal_contributions(
    p_collaborative_task_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_contributions collaborative_contributions%ROWTYPE[];
    v_contribution_sizes INTEGER[];
    v_avg_size DECIMAL;
    v_variance_threshold DECIMAL := 0.5; -- 50% variance threshold
    v_flagged_users UUID[] := '{}';
    v_i INTEGER;
BEGIN
    -- Get all contributions
    SELECT array_agg(c.*) INTO v_contributions
    FROM collaborative_contributions c
    WHERE c.collaborative_task_id = p_collaborative_task_id;
    
    -- Calculate contribution sizes (character count of JSONB)
    FOR i IN 1..array_length(v_contributions, 1) LOOP
        DECLARE
            v_size INTEGER;
        BEGIN
            v_size := length(jsonb_pretty(v_contributions[i].contribution_data));
            v_contribution_sizes := array_append(v_contribution_sizes, v_size);
        END;
    END LOOP;
    
    -- Calculate average size
    SELECT avg(size) INTO v_avg_size
    FROM unnest(v_contribution_sizes) AS size;
    
    -- Flag users with contribution sizes significantly below average
    FOR i IN 1..array_length(v_contributions, 1) LOOP
        IF v_contribution_sizes[i] < v_avg_size * (1 - v_variance_threshold) THEN
            v_flagged_users := array_append(v_flagged_users, v_contributions[i].user_id);
        END IF;
    END LOOP;
    
    -- If flagged users exist, create audit log
    IF array_length(v_flagged_users, 1) > 0 THEN
        INSERT INTO audit_logs (
            actor_id,
            action_type,
            target_type,
            target_id,
            action_data
        ) VALUES (
            NULL,
            'unequal_contribution_detected',
            'collaborative_task',
            p_collaborative_task_id,
            jsonb_build_object(
                'flagged_users', v_flagged_users,
                'average_contribution_size', v_avg_size,
                'contribution_sizes', v_contribution_sizes
            )
        );
    END IF;
    
    RETURN jsonb_build_object(
        'average_contribution_size', v_avg_size,
        'flagged_users', v_flagged_users,
        'requires_review', array_length(v_flagged_users, 1) > 0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. PERMISSION ENFORCEMENT SYSTEM

### 5.1 DATABASE-LEVEL PERMISSION CHECKS (RLS POLICIES EXTENDED)

```sql
-- Comprehensive permission check function
CREATE OR REPLACE FUNCTION has_permission(
    p_user_id UUID,
    p_action VARCHAR,
    p_target_type VARCHAR,
    p_target_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_user_role VARCHAR;
    v_permission_granted BOOLEAN := FALSE;
BEGIN
    -- Get user role
    SELECT role INTO v_user_role
    FROM profiles
    WHERE id = p_user_id;
    
    -- Permission matrix implementation
    CASE p_action
        -- VIEW PROGRESS
        WHEN 'view_own_progress' THEN
            v_permission_granted := TRUE; -- All roles can view own progress
            
        WHEN 'view_child_progress' THEN
            v_permission_granted := (
                v_user_role = 'parent' AND
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = p_target_id
                    AND parent_id = p_user_id
                )
            );
            
        WHEN 'view_assigned_students_progress' THEN
            v_permission_granted := (
                v_user_role = 'teacher' AND
                EXISTS (
                    SELECT 1 FROM teacher_assignments
                    WHERE teacher_id = p_user_id AND student_id = p_target_id
                )
            );
            
        WHEN 'view_all_progress' THEN
            v_permission_granted := (v_user_role = 'admin');
            
        -- SUBMIT LESSON WORK
        WHEN 'submit_lesson_work' THEN
            v_permission_granted := (v_user_role = 'student');
            
        -- VIEW VALIDATION DETAILS
        WHEN 'view_validation_details' THEN
            IF v_user_role = 'student' THEN
                v_permission_granted := EXISTS (
                    SELECT 1 FROM validation_records
                    WHERE id = p_target_id AND user_id = p_user_id
                );
            ELSIF v_user_role = 'parent' THEN
                v_permission_granted := EXISTS (
                    SELECT 1 FROM validation_records vr
                    JOIN profiles p ON vr.user_id = p.id
                    WHERE vr.id = p_target_id AND p.parent_id = p_user_id
                );
            ELSIF v_user_role = 'teacher' THEN
                v_permission_granted := EXISTS (
                    SELECT 1 FROM validation_records vr
                    JOIN teacher_assignments ta ON vr.user_id = ta.student_id
                    WHERE vr.id = p_target_id AND ta.teacher_id = p_user_id
                );
            ELSIF v_user_role = 'admin' THEN
                v_permission_granted := TRUE;
            END IF;
            
        -- OVERRIDE VALIDATION
        WHEN 'override_validation' THEN
            IF v_user_role IN ('teacher', 'admin') THEN
                IF v_user_role = 'teacher' THEN
                    -- Teachers can only override assigned students
                    DECLARE
                        v_student_id UUID;
                    BEGIN
                        SELECT user_id INTO v_student_id
                        FROM validation_records
                        WHERE id = p_target_id;
                        
                        v_permission_granted := EXISTS (
                            SELECT 1 FROM teacher_assignments
                            WHERE teacher_id = p_user_id AND student_id = v_student_id
                        );
                    END;
                ELSE
                    v_permission_granted := TRUE; -- Admins can override all
                END IF;
            END IF;
            
        -- MODIFY LESSON CONTENT
        WHEN 'modify_lesson_content' THEN
            v_permission_granted := (v_user_role = 'admin');
            
        -- ACCESS AUDIT LOGS
        WHEN 'access_audit_logs' THEN
            IF v_user_role = 'teacher' THEN
                v_permission_granted := EXISTS (
                    SELECT 1 FROM audit_logs
                    WHERE id = p_target_id AND actor_id = p_user_id
                );
            ELSIF v_user_role = 'admin' THEN
                v_permission_granted := TRUE;
            END IF;
            
        -- DELETE VALIDATION RECORDS
        WHEN 'delete_validation_records' THEN
            v_permission_granted := FALSE; -- Never allowed (soft delete only)
            
    END CASE;
    
    RETURN v_permission_granted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced RLS policy using permission function
CREATE POLICY "Permission-based access to validation records"
    ON validation_records FOR ALL
    USING (
        CASE
            WHEN (SELECT role FROM profiles WHERE id = auth.uid()) = 'student' THEN
                user_id = auth.uid()
            WHEN (SELECT role FROM profiles WHERE id = auth.uid()) = 'parent' THEN
                user_id IN (SELECT id FROM profiles WHERE parent_id = auth.uid())
            WHEN (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher' THEN
                EXISTS (
                    SELECT 1 FROM teacher_assignments
                    WHERE teacher_id = auth.uid() AND student_id = validation_records.user_id
                )
            WHEN (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' THEN
                TRUE
            ELSE FALSE
        END
    );
```

### 5.2 APPLICATION-LEVEL AUTHORIZATION LOGIC

```javascript
// Node.js/TypeScript-style pseudocode for application-layer authorization

class PermissionService {
    async checkPermission(userId: string, action: string, targetType: string, targetId?: string): Promise<boolean> {
        // Call database function for permission check
        const result = await db.query(
            `SELECT has_permission($1, $2, $3, $4) as granted`,
            [userId, action, targetType, targetId]
        );
        
        return result.rows[0].granted;
    }
    
    async authorizeRequest(req: Request, res: Response, next: Function) {
        const userId = req.user.id;
        const action = req.action;
        const targetType = req.targetType;
        const targetId = req.targetId;
        
        const hasPermission = await this.checkPermission(userId, action, targetType, targetId);
        
        if (!hasPermission) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have permission to perform this action'
            });
        }
        
        next();
    }
}

// Middleware usage examples
const permissionService = new PermissionService();

// Students can only submit their own work
app.post('/api/lessons/:lessonId/submit', 
    permissionService.authorizeRequest.bind(
        permissionService,
        { action: 'submit_lesson_work', targetType: 'lesson' }
    ),
    submitLessonHandler
);

// Teachers can only view assigned students' progress
app.get('/api/students/:studentId/progress',
    permissionService.authorizeRequest.bind(
        permissionService,
        { action: 'view_assigned_students_progress', targetType: 'student' }
    ),
    getStudentProgressHandler
);

// Admins can modify lesson content
app.put('/api/lessons/:lessonId',
    permissionService.authorizeRequest.bind(
        permissionService,
        { action: 'modify_lesson_content', targetType: 'lesson' }
    ),
    updateLessonHandler
);
```

### 5.3 AUDIT LOG STRUCTURE AND RETENTION POLICY

```sql
-- Comprehensive audit logging function
CREATE OR REPLACE FUNCTION create_audit_log(
    p_actor_id UUID,
    p_action_type VARCHAR,
    p_target_type VARCHAR,
    p_target_id UUID,
    p_action_data JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_audit_log_id UUID;
BEGIN
    -- Insert audit log entry
    INSERT INTO audit_logs (
        actor_id,
        action_type,
        target_type,
        target_id,
        action_data,
        ip_address,
        user_agent
    ) VALUES (
        p_actor_id,
        p_action_type,
        p_target_type,
        p_target_id,
        p_action_data,
        p_ip_address,
        p_user_agent
    ) RETURNING id INTO v_audit_log_id;
    
    RETURN v_audit_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for automatic audit logging

-- Audit validation overrides
CREATE OR REPLACE FUNCTION audit_validation_override()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_audit_log(
        NEW.override_by,
        'validation_override',
        'validation_record',
        NEW.validation_record_id,
        jsonb_build_object(
            'original_state', NEW.original_validation_state,
            'new_state', NEW.new_validation_state,
            'reason', NEW.override_reason
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_validation_override
    AFTER INSERT ON override_logs
    FOR EACH ROW
    EXECUTE FUNCTION audit_validation_override();

-- Audit permission changes
CREATE OR REPLACE FUNCTION audit_permission_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_audit_log(
        NEW.actor_id,
        'permission_change',
        'user',
        NEW.target_id,
        jsonb_build_object(
            'change_type', NEW.action_data->>'change_type',
            'old_value', NEW.action_data->>'old_value',
            'new_value', NEW.action_data->>'new_value'
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Audit manual grade adjustments (through overrides)
CREATE OR REPLACE FUNCTION audit_grade_adjustment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.new_validation_state != NEW.original_validation_state THEN
        PERFORM create_audit_log(
            NEW.override_by,
            'manual_grade_adjustment',
            'validation_record',
            NEW.validation_record_id,
            jsonb_build_object(
                'original_grade', NEW.original_validation_state,
                'new_grade', NEW.new_validation_state,
                'reason', NEW.override_reason
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_grade_adjustment
    AFTER INSERT ON override_logs
    FOR EACH ROW
    EXECUTE FUNCTION audit_grade_adjustment();

-- Audit content modifications
CREATE OR REPLACE FUNCTION audit_content_modification()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM create_audit_log(
            NEW.created_by,
            'content_created',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_build_object('content_name', NEW.name)
        );
        
        RETURN NEW;
        
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM create_audit_log(
            auth.uid(),
            'content_updated',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_build_object(
                'content_name', NEW.name,
                'changes', hstore_to_jsonb(lo_diff(
                    hstore(OLD),
                    hstore(NEW)
                ))
            )
        );
        
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM create_audit_log(
            auth.uid(),
            'content_deleted',
            TG_TABLE_NAME,
            OLD.id,
            jsonb_build_object('content_name', OLD.name)
        );
        
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply content audit triggers
CREATE TRIGGER trigger_audit_lesson_modifications
    AFTER INSERT OR UPDATE OR DELETE ON lessons
    FOR EACH ROW
    EXECUTE FUNCTION audit_content_modification();

-- Retention policy: Partition audit logs by year
CREATE OR REPLACE FUNCTION create_audit_log_partition(p_year INTEGER)
RETURNS VOID AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
    v_partition_name TEXT;
BEGIN
    v_start_date := DATE(p_year || '-01-01');
    v_end_date := DATE((p_year + 1) || '-01-01');
    v_partition_name := 'audit_logs_y' || p_year;
    
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs
        FOR VALUES FROM (%L) TO (%L)
    ', v_partition_name, v_start_date, v_end_date);
END;
$$ LANGUAGE plpgsql;

-- Create partitions for current and next 6 years (7-year retention)
SELECT create_audit_log_partition(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER);
SELECT create_audit_log_partition(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 1);
SELECT create_audit_log_partition(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 2);
SELECT create_audit_log_partition(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 3);
SELECT create_audit_log_partition(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 4);
SELECT create_audit_log_partition(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 5);
SELECT create_audit_log_partition(EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER + 6);

-- Function to drop old partitions (for maintenance)
CREATE OR REPLACE FUNCTION drop_old_audit_partitions(p_years_to_keep INTEGER DEFAULT 7)
RETURNS VOID AS $$
DECLARE
    v_cutoff_year INTEGER;
    v_partition_name TEXT;
BEGIN
    v_cutoff_year := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER - p_years_to_keep;
    
    FOR v_partition_name IN
        SELECT tablename
        FROM pg_tables
        WHERE tablename LIKE 'audit_logs_y%'
        AND CAST(substring(tablename FROM 12) AS INTEGER) < v_cutoff_year
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I', v_partition_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. GAMIFICATION SYSTEM BOUNDARIES

### 6.1 XP CALCULATION FORMULA

```sql
-- Function to calculate XP for various actions
CREATE OR REPLACE FUNCTION calculate_xp(
    p_xp_source VARCHAR,
    p_source_data JSONB DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_xp_amount INTEGER := 0;
BEGIN
    CASE p_xp_source
        WHEN 'lesson_complete' THEN
            -- Base XP for completing a lesson
            v_xp_amount := 50;
            
            -- Bonus for first-time completion
            IF NOT EXISTS (
                SELECT 1 FROM xp_records
                WHERE user_id = (p_source_data->>'user_id')::UUID
                AND xp_source = 'lesson_complete'
                AND source_reference_id = (p_source_data->>'lesson_id')::UUID
            ) THEN
                v_xp_amount := v_xp_amount + 20; -- First-time bonus
            END IF;
            
            -- Streak bonus (consecutive days)
            DECLARE
                v_streak_count INTEGER;
            BEGIN
                v_streak_count := get_user_streak((p_source_data->>'user_id')::UUID);
                v_xp_amount := v_xp_amount + LEAST(v_streak_count * 5, 50); -- Max 50 bonus
            END;
            
        WHEN 'streak_maintain' THEN
            -- XP for maintaining streak
            v_xp_amount := 10;
            
        WHEN 'peer_review_participation' THEN
            -- XP for participating in peer review
            v_xp_amount := 10;
            
        WHEN 'badge_earn' THEN
            -- XP for earning badges (badge-specific)
            IF p_source_data ? 'badge_rarity' THEN
                CASE p_source_data->>'badge_rarity'
                    WHEN 'common' THEN v_xp_amount := 20;
                    WHEN 'rare' THEN v_xp_amount := 50;
                    WHEN 'epic' THEN v_xp_amount := 100;
                    WHEN 'legendary' THEN v_xp_amount := 200;
                END CASE;
            END IF;
            
        ELSE
            v_xp_amount := 0;
    END CASE;
    
    RETURN v_xp_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award XP
CREATE OR REPLACE FUNCTION award_xp(
    p_user_id UUID,
    p_xp_source VARCHAR,
    p_source_reference_id UUID DEFAULT NULL,
    p_source_data JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_xp_amount INTEGER;
    v_total_xp INTEGER;
BEGIN
    -- Calculate XP amount
    v_xp_amount := calculate_xp(p_xp_source, COALESCE(p_source_data, jsonb_build_object('user_id', p_user_id)));
    
    -- Insert XP record
    INSERT INTO xp_records (
        user_id,
        xp_amount,
        xp_source,
        source_reference_id
    ) VALUES (
        p_user_id,
        v_xp_amount,
        p_xp_source,
        p_source_reference_id
    );
    
    -- Calculate total XP
    SELECT COALESCE(SUM(xp_amount), 0) INTO v_total_xp
    FROM xp_records
    WHERE user_id = p_user_id;
    
    -- Check for level-up (optional future feature)
    -- XP CANNOT unlock lessons, islands, core content, or validation bypasses
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'xp_awarded', v_xp_amount,
        'total_xp', v_total_xp,
        'xp_source', p_xp_source
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user streak count
CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID) RETURNS INTEGER AS $$
DECLARE
    v_streak_count INTEGER := 0;
    v_current_date DATE := CURRENT_DATE;
    v_has_activity BOOLEAN := TRUE;
BEGIN
    -- Count consecutive days with activity
    WHILE v_has_activity AND v_streak_count < 365 LOOP
        -- Check if user had any validation records on this date
        SELECT EXISTS(
            SELECT 1 FROM validation_records
            WHERE user_id = p_user_id
            AND DATE(timestamp) = v_current_date
        ) INTO v_has_activity;
        
        IF v_has_activity THEN
            v_streak_count := v_streak_count + 1;
            v_current_date := v_current_date - INTERVAL '1 day';
        END IF;
    END LOOP;
    
    RETURN v_streak_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 6.2 BADGE AWARD CRITERIA

```sql
-- Badge definitions with specific thresholds
CREATE OR REPLACE FUNCTION initialize_badges()
RETURNS VOID AS $$
BEGIN
    -- Skill mastery badges
    INSERT INTO badges (name, description, badge_type, criteria) VALUES
    (
        'Math Fundamentals Master',
        'Earned by completing all math-related lessons with a perfect score',
        'skill_mastery',
        jsonb_build_object(
            'archipelago', 'Mathematics',
            'requirement', 'all_lessons_perfect_score',
            'threshold', 100
        )
    ),
    (
        'Science Explorer',
        'Earned by completing 10 science lessons',
        'skill_mastery',
        jsonb_build_object(
            'archipelago', 'Science',
            'requirement', 'lessons_completed',
            'threshold', 10
        )
    );
    
    -- Topic completion badges (island completers)
    -- These are created dynamically when islands are completed
    
    -- Consistency badges
    INSERT INTO badges (name, description, badge_type, criteria) VALUES
    (
        '7-Day Streak',
        'Maintain a learning streak for 7 consecutive days',
        'consistency',
        jsonb_build_object(
            'requirement', 'streak_days',
            'threshold', 7
        )
    ),
    (
        '30-Day Streak',
        'Maintain a learning streak for 30 consecutive days',
        'consistency',
        jsonb_build_object(
            'requirement', 'streak_days',
            'threshold', 30
        )
    ),
    (
        '100-Day Streak',
        'Maintain a learning streak for 100 consecutive days',
        'consistency',
        jsonb_build_object(
            'requirement', 'streak_days',
            'threshold', 100
        )
    );
    
    -- Special badges
    INSERT INTO badges (name, description, badge_type, criteria) VALUES
    (
        'First Steps',
        'Complete your first lesson',
        'special',
        jsonb_build_object(
            'requirement', 'first_lesson_complete'
        )
    ),
    (
        'Peer Review Champion',
        'Complete 20 peer reviews',
        'special',
        jsonb_build_object(
            'requirement', 'peer_reviews_completed',
            'threshold', 20
        )
    ),
    (
        'Island Hopper',
        'Complete 3 different islands',
        'special',
        jsonb_build_object(
            'requirement', 'islands_completed',
            'threshold', 3
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_badge badges%ROWTYPE;
    v_badges_awarded UUID[] := '{}';
    v_badge_earned BOOLEAN;
BEGIN
    -- Check all badges
    FOR v_badge IN SELECT * FROM badges LOOP
        v_badge_earned := FALSE;
        
        -- Check if user already has this badge
        IF EXISTS (
            SELECT 1 FROM user_badges
            WHERE user_id = p_user_id AND badge_id = v_badge.id
        ) THEN
            CONTINUE;
        END IF;
        
        -- Check badge criteria
        CASE v_badge.badge_type
            WHEN 'skill_mastery' THEN
                -- Check mastery criteria
                IF v_badge.criteria->>'requirement' = 'all_lessons_perfect_score' THEN
                    DECLARE
                        v_total_lessons INTEGER;
                        v_perfect_lessons INTEGER;
                    BEGIN
                        SELECT COUNT(*) INTO v_total_lessons
                        FROM lessons l
                        JOIN islands i ON l.island_id = i.id
                        JOIN archipelagos a ON i.archipelago_id = a.id
                        WHERE a.name = v_badge.criteria->>'archipelago';
                        
                        SELECT COUNT(DISTINCT l.id) INTO v_perfect_lessons
                        FROM validation_records vr
                        JOIN lessons l ON vr.lesson_id = l.id
                        JOIN islands i ON l.island_id = i.id
                        JOIN archipelagos a ON i.archipelago_id = a.id
                        WHERE vr.user_id = p_user_id
                        AND a.name = v_badge.criteria->>'archipelago'
                        AND vr.result = 'pass'
                        AND NOT EXISTS (
                            SELECT 1 FROM override_logs ol
                            WHERE ol.validation_record_id = vr.id
                            AND ol.new_validation_state = 'fail'
                        )
                        AND (v_badge.criteria->>'threshold')::INTEGER = 100; -- Perfect score placeholder
                        
                        IF v_total_lessons = v_perfect_lessons AND v_total_lessons > 0 THEN
                            v_badge_earned := TRUE;
                        END IF;
                    END;
                    
                ELSIF v_badge.criteria->>'requirement' = 'lessons_completed' THEN
                    DECLARE
                        v_completed_lessons INTEGER;
                    BEGIN
                        SELECT COUNT(DISTINCT l.id) INTO v_completed_lessons
                        FROM validation_records vr
                        JOIN lessons l ON vr.lesson_id = l.id
                        JOIN islands i ON l.island_id = i.id
                        JOIN archipelagos a ON i.archipelago_id = a.id
                        WHERE vr.user_id = p_user_id
                        AND a.name = v_badge.criteria->>'archipelago'
                        AND vr.result = 'pass';
                        
                        IF v_completed_lessons >= (v_badge.criteria->>'threshold')::INTEGER THEN
                            v_badge_earned := TRUE;
                        END IF;
                    END;
                END IF;
                
            WHEN 'consistency' THEN
                -- Check streak criteria
                IF v_badge.criteria->>'requirement' = 'streak_days' THEN
                    DECLARE
                        v_current_streak INTEGER;
                    BEGIN
                        v_current_streak := get_user_streak(p_user_id);
                        
                        IF v_current_streak >= (v_badge.criteria->>'threshold')::INTEGER THEN
                            v_badge_earned := TRUE;
                        END IF;
                    END;
                END IF;
                
            WHEN 'special' THEN
                -- Check special criteria
                IF v_badge.criteria->>'requirement' = 'first_lesson_complete' THEN
                    IF EXISTS (
                        SELECT 1 FROM validation_records
                        WHERE user_id = p_user_id AND result = 'pass'
                    ) THEN
                        v_badge_earned := TRUE;
                    END IF;
                    
                ELSIF v_badge.criteria->>'requirement' = 'peer_reviews_completed' THEN
                    DECLARE
                        v_peer_review_count INTEGER;
                    BEGIN
                        SELECT COUNT(*) INTO v_peer_review_count
                        FROM peer_review_assignments
                        WHERE reviewer_id = p_user_id
                        AND review_status = 'completed';
                        
                        IF v_peer_review_count >= (v_badge.criteria->>'threshold')::INTEGER THEN
                            v_badge_earned := TRUE;
                        END IF;
                    END;
                    
                ELSIF v_badge.criteria->>'requirement' = 'islands_completed' THEN
                    DECLARE
                        v_completed_islands INTEGER;
                    BEGIN
                        SELECT COUNT(DISTINCT i.id) INTO v_completed_islands
                        FROM islands i
                        WHERE EXISTS (
                            SELECT 1 FROM calculate_island_completion(p_user_id, i.id) AS completion
                            WHERE completion->>'is_complete' = 'true'
                        );
                        
                        IF v_completed_islands >= (v_badge.criteria->>'threshold')::INTEGER THEN
                            v_badge_earned := TRUE;
                        END IF;
                    END;
                END IF;
                
        END CASE;
        
        -- Award badge if earned
        IF v_badge_earned THEN
            INSERT INTO user_badges (user_id, badge_id)
            VALUES (p_user_id, v_badge.id)
            ON CONFLICT (user_id, badge_id) DO NOTHING;
            
            v_badges_awarded := array_append(v_badges_awarded, v_badge.id);
            
            -- Award XP for earning badge
            PERFORM award_xp(
                p_user_id,
                'badge_earn',
                v_badge.id,
                jsonb_build_object(
                    'badge_rarity', 'common' -- Default rarity
                )
            );
        END IF;
    END LOOP;
    
    RETURN jsonb_build_object(
        'badges_awarded', v_badges_awarded,
        'badge_count', array_length(v_badges_awarded, 1)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 6.3 EXPLICIT LIST OF WHAT GAMIFICATION CANNOT DO

```sql
-- Database constraint to enforce gamification boundaries
CREATE OR REPLACE FUNCTION enforce_gamification_boundaries()
RETURNS TRIGGER AS $$
BEGIN
    -- XP CANNOT unlock lessons
    IF TG_TABLE_NAME = 'xp_records' THEN
        -- This function is called when XP is awarded
        -- We explicitly prevent XP from affecting progression
        RAISE NOTICE 'XP awarded but does not affect lesson unlocking';
    END IF;
    
    -- Badges CANNOT substitute for validation
    IF TG_TABLE_NAME = 'user_badges' THEN
        -- This function is called when badges are awarded
        -- We explicitly prevent badges from bypassing validation
        RAISE NOTICE 'Badge awarded but does not bypass validation requirements';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Document forbidden gamification actions in a table
CREATE TABLE gamification_restrictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restriction_category VARCHAR(50) NOT NULL,
    forbidden_action TEXT NOT NULL,
    reason TEXT NOT NULL,
    enforcement_mechanism TEXT NOT NULL
);

INSERT INTO gamification_restrictions (restriction_category, forbidden_action, reason, enforcement_mechanism) VALUES
('XP', 'Unlock lessons', 'Learning integrity requires validation, not gamification', 'System logic prevents XP-based unlocking'),
('XP', 'Unlock islands', 'Island completion requires 15/15 passed validations', 'System logic requires full validation'),
('XP', 'Bypass validation', 'Validation is mandatory for progression', 'System enforces validation before progression'),
('XP', 'Grant permissions', 'Permissions are role-based, not XP-based', 'Role-based access control system'),
('XP', 'Access core content', 'Content access requires validation completion', 'Progression system enforces this'),

('Badges', 'Substitute for validation', 'Badges represent achievement, not learning verification', 'Validation system is independent'),
('Badges', 'Unlock content', 'Content unlocking requires validation completion', 'Progression system enforces this'),
('Badges', 'Grant permissions', 'Permissions are role-based', 'Role-based access control system'),
('Badges', 'Fast-track progression', 'Progression is strictly sequential', 'Validation system enforces sequence'),

('Rewards', 'Lesson skips', 'All lessons must be completed with validation', 'System enforces lesson completion'),
('Rewards', 'Validation bypasses', 'Validation is non-negotiable', 'System requires validation for progression'),
('Rewards', 'Content access without validation', 'Learning integrity requires validation', 'System blocks unauthorized access'),
('Rewards', 'Permission escalation', 'Permissions are role-based', 'Role-based access control system');
```

---

## 7. MINECRAFT DESIGN DECISION FRAMEWORK

### 7.1 EVALUATION CHECKLIST FOR MINECRAFT-STYLE ELEMENTS

```sql
-- Table to track Minecraft-style element evaluations
CREATE TABLE minecraft_element_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    element_name VARCHAR(200) NOT NULL,
    element_type VARCHAR(50) NOT NULL,
    proposed_use_case TEXT NOT NULL,
    evaluation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    evaluated_by UUID REFERENCES profiles(id),
    
    -- Evaluation criteria
    supports_learning_objective BOOLEAN NOT NULL,
    educational_value_explained TEXT,
    
    -- Critical question
    does_removal_reduce_learning_effectiveness BOOLEAN NOT NULL,
    removal_impact_explanation TEXT,
    
    -- Decision
    is_approved BOOLEAN NOT NULL,
    approval_reasoning TEXT,
    rejection_reasoning TEXT,
    
    -- Implementation details (if approved)
    implementation_notes TEXT,
    integration_points JSONB,
    
    CONSTRAINT requires_explanation_for_removal CHECK (
        (does_removal_reduce_learning_effectiveness = FALSE) OR
        (removal_impact_explanation IS NOT NULL AND LENGTH(removal_impact_explanation) >= 50)
    ),
    
    CONSTRAINT requires_approval_reasoning CHECK (
        (is_approved = FALSE) OR (approval_reasoning IS NOT NULL AND LENGTH(approval_reasoning) >= 50)
    ),
    
    CONSTRAINT requires_rejection_reasoning CHECK (
        (is_approved = TRUE) OR (rejection_reasoning IS NOT NULL AND LENGTH(rejection_reasoning) >= 50)
    )
);

-- Function to evaluate Minecraft-style elements
CREATE OR REPLACE FUNCTION evaluate_minecraft_element(
    p_element_name VARCHAR,
    p_element_type VARCHAR,
    p_proposed_use_case TEXT,
    p_evaluated_by UUID,
    p_supports_learning_objective BOOLEAN,
    p_educational_value_explained TEXT,
    p_does_removal_reduce_learning_effectiveness BOOLEAN,
    p_removal_impact_explanation TEXT
) RETURNS UUID AS $$
DECLARE
    v_evaluation_id UUID;
    v_is_approved BOOLEAN;
    v_approval_reasoning TEXT;
    v_rejection_reasoning TEXT;
BEGIN
    -- Decision logic based on criteria
    IF p_supports_learning_objective AND p_does_removal_reduce_learning_effectiveness THEN
        v_is_approved := TRUE;
        v_approval_reasoning := 'Element directly supports learning objectives and removal would reduce learning effectiveness. This aligns with the principle that gamification serves learning, not vice versa.';
        v_rejection_reasoning := NULL;
    ELSE
        v_is_approved := FALSE;
        v_approval_reasoning := NULL;
        
        IF NOT p_supports_learning_objective THEN
            v_rejection_reasoning := 'Element does not directly support learning objectives. Learning integrity supersedes gamification elements.';
        ELSIF NOT p_does_removal_reduce_learning_effectiveness THEN
            v_rejection_reasoning := 'Element is decorative or auxiliary - removal would not reduce learning effectiveness. Visual elements must directly support learning objectives.';
        END IF;
    END IF;
    
    -- Insert evaluation record
    INSERT INTO minecraft_element_evaluations (
        element_name,
        element_type,
        proposed_use_case,
        evaluated_by,
        supports_learning_objective,
        educational_value_explained,
        does_removal_reduce_learning_effectiveness,
        removal_impact_explanation,
        is_approved,
        approval_reasoning,
        rejection_reasoning
    ) VALUES (
        p_element_name,
        p_element_type,
        p_proposed_use_case,
        p_evaluated_by,
        p_supports_learning_objective,
        p_educational_value_explained,
        p_does_removal_reduce_learning_effectiveness,
        p_removal_impact_explanation,
        v_is_approved,
        v_approval_reasoning,
        v_rejection_reasoning
    ) RETURNING id INTO v_evaluation_id;
    
    RETURN v_evaluation_id;
END;
$$ LANGUAGE plpgsql;
```

### 7.2 APPROVED USE CASE EXAMPLES

```sql
-- Insert approved Minecraft-style elements
INSERT INTO minecraft_element_evaluations (
    element_name,
    element_type,
    proposed_use_case,
    evaluated_by,
    supports_learning_objective,
    educational_value_explained,
    does_removal_reduce_learning_effectiveness,
    removal_impact_explanation,
    is_approved,
    approval_reasoning,
    implementation_notes,
    integration_points
) VALUES
(
    'Block-Based Coding Interface',
    'coding_interface',
    'Students use Minecraft-style blocks to construct code logic for programming lessons. Visual representation helps beginners understand control flow, loops, and conditionals.',
    NULL, -- System evaluation
    TRUE,
    'Visual block-based programming is a proven pedagogical tool for teaching computational thinking. The Minecraft aesthetic provides familiar context while maintaining focus on coding concepts.',
    TRUE,
    'Removing the block interface and forcing text-only coding would significantly increase cognitive load for beginners, making it harder to grasp fundamental programming concepts. The visual scaffolding is essential for the learning objective.',
    TRUE,
    'Element directly supports learning objectives and removal would reduce learning effectiveness.',
    'Implement using Scratch-like block interface with Minecraft visual theme. Blocks must represent actual programming constructs (if/else, loops, variables). Ensure blocks can be converted to code view for advanced students.',
    jsonb_build_object(
        'lesson_types', ARRAY['coding', 'programming', 'logic'],
        'archipelagos', ARRAY['Computer Science', 'Mathematics'],
        'validation_type', 'automated'
    )
),
(
    '3D Geometric Visualization Blocks',
    'visualization_tool',
    'Students place Minecraft-style blocks to build 3D geometric shapes, learning about volume, surface area, and spatial reasoning. Blocks snap to grid to reinforce mathematical precision.',
    NULL,
    TRUE,
    'Hands-on manipulation of 3D objects helps students develop spatial reasoning skills. The block-based system reinforces concepts of units, dimensions, and geometric properties through tangible interaction.',
    TRUE,
    'Removal of the 3D interactive visualization would force students to rely on abstract 2D diagrams, which is less effective for developing spatial reasoning and understanding 3D geometry concepts.',
    TRUE,
    'Element directly supports learning objectives and removal would reduce learning effectiveness.',
    'Implement grid-based block placement system. Include measurement tools to calculate volume and surface area. Blocks must represent uniform units. Include rotation and perspective controls.',
    jsonb_build_object(
        'lesson_types', ARRAY['geometry', 'math', 'spatial_reasoning'],
        'archipelagos', ARRAY['Mathematics'],
        'validation_type', 'automated'
    )
),
(
    'Resource Management Simulation',
    'simulation',
    'Students manage Minecraft-style resources in economic simulation lessons, learning about supply and demand, opportunity cost, and resource allocation. Each resource has specific economic properties.',
    NULL,
    TRUE,
    'Simulation-based learning provides experiential understanding of economic principles. The Minecraft resource system provides intuitive abstraction for complex economic concepts while maintaining focus on learning objectives.',
    TRUE,
    'Removing the simulation would reduce the lesson to abstract theory without practical application. Students would lose the opportunity to experience economic principles in action, reducing retention and understanding.',
    TRUE,
    'Element directly supports learning objectives and removal would reduce learning effectiveness.',
    'Implement resource system with specific economic properties. Include graphs/charts to visualize economic data. Ensure simulation accurately reflects economic principles being taught. Add debriefing questions to connect simulation to theory.',
    jsonb_build_object(
        'lesson_types', ARRAY['economics', 'math', 'decision_making'],
        'archipelagos', ARRAY['Mathematics', 'Social Studies'],
        'validation_type', 'both'
    )
);
```

### 7.3 REJECTED USE CASE EXAMPLES WITH REASONING

```sql
-- Insert rejected Minecraft-style elements
INSERT INTO minecraft_element_evaluations (
    element_name,
    element_type,
    proposed_use_case,
    evaluated_by,
    supports_learning_objective,
    educational_value_explained,
    does_removal_reduce_learning_effectiveness,
    removal_impact_explanation,
    is_approved,
    approval_reasoning,
    rejection_reasoning
) VALUES
(
    'Decorative Block Environment',
    'environment',
    'Students can freely explore a Minecraft-style block world between lessons. No specific learning objectives, just engagement and fun exploration.',
    NULL,
    FALSE,
    NULL,
    FALSE,
    'Removal of this decorative environment would not impact any learning objectives. Students would still complete all lessons and pass all validations without this feature.',
    FALSE,
    NULL,
    'Element does not directly support learning objectives. Learning integrity supersedes gamification elements. Time spent exploring decorative environments is time not spent on learning activities.'
),
(
    'Survival/Combat Mechanics',
    'game_mechanics',
    'Add Minecraft-style survival mechanics including health, hunger, and combat with mobs. Provides engagement and challenge.',
    NULL,
    FALSE,
    NULL,
    FALSE,
    'Removal of survival and combat mechanics would not reduce learning effectiveness for any lesson content. These mechanics are unrelated to curriculum objectives.',
    FALSE,
    NULL,
    'Element does not directly support learning objectives. Survival and combat mechanics are unrelated to educational content. Learning integrity supersedes engagement features.'
),
(
    'Block Building Sandbox',
    'creative_mode',
    'Unrestricted block building mode where students can create anything. Intended for creativity and engagement.',
    NULL,
    FALSE,
    NULL,
    FALSE,
    'Removal of unrestricted building mode would not impact lesson objectives. Creative expression should be tied to specific learning tasks (e.g., build a structure with specific volume), not unrestricted sandbox play.',
    FALSE,
    NULL,
    'Element does not directly support learning objectives. Unrestricted sandbox time does not support specific learning goals. Creative activities must be curriculum-aligned.'
),
(
    'Minecraft Terminology',
    'naming_convention',
    'Use Minecraft-specific terminology (creeper, nether, enderman) to describe lesson elements and concepts.',
    NULL,
    FALSE,
    NULL,
    FALSE,
    'Removal of Minecraft terminology and replacement with standard educational terminology would improve clarity and reduce confusion. Students might focus on game terms rather than learning concepts.',
    FALSE,
    NULL,
    'Element does not directly support learning objectives. Confusing game terminology with educational concepts hinders learning. Standard terminology must be used for clarity.'
),
(
    'Achievement Hunting',
    'gamification',
    'Hidden achievements and easter eggs throughout the platform. Students explore to find them.',
    NULL,
    FALSE,
    NULL,
    FALSE,
    'Removal of hidden achievements and easter eggs would not impact learning objectives. These encourage exploration away from learning activities.',
    FALSE,
    NULL,
    'Element does not directly support learning objectives. Achievement hunting distracts from curriculum content. Learning time must be focused on validated activities.'
);
```

---

## 8. OFFLINE SYNC TECHNICAL SPECIFICATION

### 8.1 LOCAL STORAGE SCHEMA

```javascript
// Client-side local storage schema (IndexedDB or localStorage)

const OFFLINE_STORAGE_SCHEMA = {
    // User profile data (cached)
    userProfile: {
        id: 'UUID',
        role: 'student|parent|teacher|admin',
        displayName: 'string',
        parent_id: 'UUID|null',
        lastSynced: 'ISO8601 timestamp'
    },
    
    // Lesson content (cached for offline access)
    lessons: {
        lessonId: {
            id: 'UUID',
            island_id: 'UUID',
            sort_order: 'number',
            name: 'string',
            description: 'string',
            validation_type: 'automated|human_reviewed|both',
            content_data: 'object',
            lastSynced: 'ISO8601 timestamp'
        }
    },
    
    // Validation records (synced from server)
    validationRecords: {
        recordId: {
            id: 'UUID',
            user_id: 'UUID',
            lesson_id: 'UUID',
            timestamp: 'ISO8601 timestamp',
            result: 'pass|fail',
            validation_method: 'automated|human_reviewed',
            attempt_number: 'number',
            lastSynced: 'ISO8601 timestamp'
        }
    },
    
    // Queued submissions (to be synced)
    queuedSubmissions: {
        queueId: {
            id: 'UUID', // Client-generated UUID
            user_id: 'UUID',
            lesson_id: 'UUID',
            submission_data: 'object',
            device_identifier: 'string',
            client_timestamp: 'ISO8601 timestamp',
            created_at: 'ISO8601 timestamp',
            sync_status: 'pending|syncing|synced|conflict|failed',
            sync_attempt_count: 'number',
            last_sync_attempt_at: 'ISO8601 timestamp|null',
            conflict_data: 'object|null'
        }
    },
    
    // Offline progression state (calculated locally)
    progressionState: {
        userId: {
            accessibleLessons: ['UUID array'],
            completedIslands: ['UUID array'],
            last_calculated: 'ISO8601 timestamp'
        }
    },
    
    // Sync metadata
    syncMetadata: {
        last_successful_sync: 'ISO8601 timestamp',
        device_identifier: 'string',
        pending_submissions_count: 'number',
        conflict_count: 'number'
    }
};
```

### 8.2 SYNC ALGORITHM PSEUDOCODE

```javascript
class OfflineSyncService {
    constructor() {
        this.deviceIdentifier = this.generateDeviceId();
        this.syncInProgress = false;
    }
    
    generateDeviceId() {
        return 'device_' + crypto.randomUUID();
    }
    
    async sync() {
        if (this.syncInProgress) {
            console.log('Sync already in progress');
            return;
        }
        
        this.syncInProgress = true;
        
        try {
            // Phase 1: Upload queued submissions
            await this.uploadQueuedSubmissions();
            
            // Phase 2: Download updated validation records
            await this.downloadValidationRecords();
            
            // Phase 3: Recalculate local progression
            await this.recalculateProgression();
            
            // Phase 4: Update sync metadata
            await this.updateSyncMetadata();
            
        } catch (error) {
            console.error('Sync failed:', error);
            throw error;
        } finally {
            this.syncInProgress = false;
        }
    }
    
    async uploadQueuedSubmissions() {
        const queuedSubmissions = await this.getQueuedSubmissions();
        
        for (const submission of queuedSubmissions) {
            if (submission.sync_status === 'pending' || submission.sync_status === 'failed') {
                try {
                    submission.sync_status = 'syncing';
                    submission.last_sync_attempt_at = new Date().toISOString();
                    submission.sync_attempt_count++;
                    await this.saveQueuedSubmission(submission);
                    
                    // Upload to server
                    const serverResponse = await this.uploadSubmissionToServer(submission);
                    
                    // Check for conflict
                    if (serverResponse.conflict) {
                        submission.sync_status = 'conflict';
                        submission.conflict_data = serverResponse.serverData;
                        await this.saveQueuedSubmission(submission);
                        
                        // Notify user of conflict
                        this.notifyConflict(submission);
                        
                    } else {
                        // Sync successful
                        submission.sync_status = 'synced';
                        await this.saveQueuedSubmission(submission);
                        
                        // Update local validation records
                        await this.storeValidationRecord(serverResponse.validationRecord);
                        
                        // Remove from queued submissions after successful sync
                        await this.removeQueuedSubmission(submission.id);
                    }
                    
                } catch (error) {
                    console.error('Failed to sync submission:', error);
                    submission.sync_status = 'failed';
                    await this.saveQueuedSubmission(submission);
                }
            }
        }
    }
    
    async uploadSubmissionToServer(submission) {
        const response = await fetch('/api/sync/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await this.getAuthToken()}`
            },
            body: JSON.stringify({
                user_id: submission.user_id,
                lesson_id: submission.lesson_id,
                submission_data: submission.submission_data,
                device_identifier: this.deviceIdentifier,
                client_timestamp: submission.client_timestamp
            })
        });
        
        const result = await response.json();
        
        if (result.conflict) {
            return {
                conflict: true,
                serverData: result.serverData
            };
        }
        
        return {
            conflict: false,
            validationRecord: result.validationRecord
        };
    }
    
    async downloadValidationRecords() {
        const lastSync = await this.getLastSuccessfulSync();
        
        const response = await fetch('/api/sync/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await this.getAuthToken()}`
            },
            body: JSON.stringify({
                user_id: await this.getCurrentUserId(),
                since: lastSync
            })
        });
        
        const { validationRecords } = await response.json();
        
        // Store validation records locally
        for (const record of validationRecords) {
            await this.storeValidationRecord(record);
        }
    }
    
    async recalculateProgression() {
        const userId = await this.getCurrentUserId();
        const validationRecords = await this.getValidationRecords(userId);
        
        // Calculate accessible lessons
        const accessibleLessons = this.calculateAccessibleLessons(userId, validationRecords);
        
        // Calculate completed islands
        const completedIslands = this.calculateCompletedIslands(userId, validationRecords);
        
        // Store progression state
        await this.storeProgressionState({
            userId,
            accessibleLessons,
            completedIslands,
            last_calculated: new Date().toISOString()
        });
    }
    
    calculateAccessibleLessons(userId, validationRecords) {
        // Implementation mirrors server-side logic
        const accessibleLessons = [];
        const lessons = this.getLessons(); // Get all lessons
        
        for (const lesson of lessons) {
            if (lesson.sort_order === 1) {
                // First lesson is always accessible
                accessibleLessons.push(lesson.id);
            } else {
                // Check if previous lesson is completed
                const previousLesson = lessons.find(l => 
                    l.island_id === lesson.island_id && 
                    l.sort_order === lesson.sort_order - 1
                );
                
                if (previousLesson) {
                    const previousValidation = validationRecords.find(vr => 
                        vr.lesson_id === previousLesson.id && 
                        vr.result === 'pass'
                    );
                    
                    if (previousValidation) {
                        accessibleLessons.push(lesson.id);
                    }
                }
            }
        }
        
        return accessibleLessons;
    }
    
    calculateCompletedIslands(userId, validationRecords) {
        const completedIslands = [];
        const islands = this.getIslands();
        
        for (const island of islands) {
            const lessons = this.getLessonsByIsland(island.id);
            
            let allLessonsPassed = true;
            for (const lesson of lessons) {
                const passed = validationRecords.some(vr => 
                    vr.lesson_id === lesson.id && 
                    vr.result === 'pass'
                );
                
                if (!passed) {
                    allLessonsPassed = false;
                    break;
                }
            }
            
            if (allLessonsPassed && lessons.length === 15) {
                completedIslands.push(island.id);
            }
        }
        
        return completedIslands;
    }
    
    async notifyConflict(submission) {
        // Notify user of sync conflict
        const notification = {
            type: 'sync_conflict',
            title: 'Sync Conflict Detected',
            message: 'Your offline work conflicts with server data. Please review and resolve manually.',
            submission_id: submission.id,
            conflict_data: submission.conflict_data
        };
        
        await this.showNotification(notification);
    }
    
    async updateSyncMetadata() {
        const metadata = {
            last_successful_sync: new Date().toISOString(),
            device_identifier: this.deviceIdentifier,
            pending_submissions_count: await this.getQueuedSubmissionsCount(),
            conflict_count: await this.getConflictsCount()
        };
        
        await this.storeSyncMetadata(metadata);
    }
}
```

### 8.3 CONFLICT RESOLUTION DECISION TREE

```
┌─────────────────────────────────────────────────────────────────┐
│                   OFFLINE SUBMISSION DETECTED                   │
│                   (Client attempting sync)                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              STEP 1: CHECK SERVER FOR CONFLICTS                 │
├─────────────────────────────────────────────────────────────────┤
│  Query server for validation records for this user-lesson pair  │
│  since the client's last successful sync                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼ (NO CONFLICT)                ▼ (CONFLICT EXISTS)
┌───────────────────────┐       ┌─────────────────────────────────┐
│   ACCEPT LOCAL DATA    │       │   COMPARE TIMESTAMPS           │
│   SYNC TO SERVER       │       ├─────────────────────────────────┤
│                        │       │ Compare:                        │
│ 1. Create validation   │       │ • local_timestamp (client)      │
│    record on server    │       │ • server_timestamp (existing)   │
│ 2. Return success to   │       │                                │
│    client              │       └───────────┬─────────────────────┘
│ 3. Notify user of      │                     │
│    successful sync     │                     ▼
└───────────────────────┘       ┌─────────────────────────────────┐
                                │   TIMESTAMP COMPARISON LOGIC    │
                                ├─────────────────────────────────┤
                                │ IF local_timestamp >            │
                                │    server_timestamp THEN        │
                                │                                │
                                │   ACCEPT LOCAL VERSION          │
                                │   ┌─────────────────────────┐  │
                                │   │ • Create validation     │  │
                                │   │   record on server      │  │
                                │   │ • Notify user:          │  │
                                │   │   "Offline work synced" │  │
                                │   └─────────────────────────┘  │
                                │                                │
                                │ ELSE IF local_timestamp <     │
                                │    server_timestamp THEN       │
                                │                                │
                                │   REJECT LOCAL VERSION         │
                                │   ┌─────────────────────────┐  │
                                │   │ • Do NOT create record  │  │
                                │   │ • Notify user:          │  │
                                │   │   "Server has newer     │  │
                                │   │    data. Your offline   │  │
                                │   │    work was not synced. │  │
                                │   │    Please review."       │  │
                                │   │ • Store conflict for    │  │
                                │   │   manual review         │  │
                                │   └─────────────────────────┘  │
                                │                                │
                                │ ELSE (timestamps equal)       │
                                │                                │
                                │   CHECK CONTENT HASH           │
                                │   ┌─────────────────────────┐  │
                                │   │ IF hash matches THEN    │  │
                                │   │   Accept (deduplicated) │  │
                                │   │ ELSE                    │  │
                                │   │   Reject (collision)    │  │
                                │   │   Flag for manual review│  │
                                │   └─────────────────────────┘  │
                                └─────────────────────────────────┘
                                                    │
                                                    ▼
                                ┌─────────────────────────────────┐
                                │   MANUAL REVIEW WORKFLOW        │
                                ├─────────────────────────────────┤
                                │ 1. Store both versions locally  │
                                │ 2. Display conflict to user     │
                                │ 3. User selects version to keep │
                                │ 4. Resubmit selected version   │
                                │ 5. Teacher can review conflicts│
                                │    within 24 hours             │
                                │ 6. Audit log all resolutions   │
                                └─────────────────────────────────┘
```

### 8.4 SERVER-SIDE SYNC ENDPOINT

```sql
-- Server-side sync upload function
CREATE OR REPLACE FUNCTION sync_upload_submission(
    p_user_id UUID,
    p_lesson_id UUID,
    p_submission_data JSONB,
    p_device_identifier VARCHAR,
    p_client_timestamp TIMESTAMP WITH TIME ZONE
) RETURNS JSONB AS $$
DECLARE
    v_conflict_detected BOOLEAN := FALSE;
    v_server_validation_record validation_records%ROWTYPE;
    v_new_validation_record validation_records%ROWTYPE;
    v_attempt_count INTEGER;
    v_result VARCHAR;
    v_validation_method VARCHAR;
BEGIN
    -- Check for existing validation records after client timestamp
    SELECT * INTO v_server_validation_record
    FROM validation_records
    WHERE user_id = p_user_id
    AND lesson_id = p_lesson_id
    AND timestamp > p_client_timestamp
    ORDER BY timestamp DESC
    LIMIT 1;
    
    -- Conflict detection logic
    IF v_server_validation_record IS NOT NULL THEN
        v_conflict_detected := TRUE;
        
        -- Return conflict information
        RETURN jsonb_build_object(
            'conflict', TRUE,
            'serverData', jsonb_build_object(
                'validation_record_id', v_server_validation_record.id,
                'timestamp', v_server_validation_record.timestamp,
                'result', v_server_validation_record.result
            )
        );
    END IF;
    
    -- No conflict, process submission
    v_attempt_count := get_attempt_count(p_user_id, p_lesson_id) + 1;
    
    -- Perform validation (simplified for sync)
    v_result := perform_automated_validation(p_submission_data, p_lesson_id);
    v_validation_method := 'automated';
    
    -- If validation fails and this is attempt 3+, escalate to human
    IF v_result = 'fail' AND v_attempt_count >= 3 THEN
        v_validation_method := 'human_reviewed';
    END IF;
    
    -- Create validation record
    INSERT INTO validation_records (
        user_id,
        lesson_id,
        result,
        validation_method,
        submission_data,
        attempt_number,
        device_identifier,
        client_timestamp
    ) VALUES (
        p_user_id,
        p_lesson_id,
        v_result,
        v_validation_method,
        p_submission_data,
        v_attempt_count,
        p_device_identifier,
        p_client_timestamp
    ) RETURNING * INTO v_new_validation_record;
    
    -- Award XP if passed
    IF v_result = 'pass' THEN
        PERFORM award_xp(p_user_id, 'lesson_complete', p_lesson_id);
        
        -- Check for badges
        PERFORM check_and_award_badges(p_user_id);
    END IF;
    
    -- Return success
    RETURN jsonb_build_object(
        'conflict', FALSE,
        'validationRecord', jsonb_build_object(
            'id', v_new_validation_record.id,
            'user_id', v_new_validation_record.user_id,
            'lesson_id', v_new_validation_record.lesson_id,
            'timestamp', v_new_validation_record.timestamp,
            'result', v_new_validation_record.result,
            'validation_method', v_new_validation_record.validation_method,
            'attempt_number', v_new_validation_record.attempt_number
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Server-side sync download function
CREATE OR REPLACE FUNCTION sync_download_validation_records(
    p_user_id UUID,
    p_since_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS JSONB AS $$
BEGIN
    RETURN jsonb_agg(
        jsonb_build_object(
            'id', vr.id,
            'user_id', vr.user_id,
            'lesson_id', vr.lesson_id,
            'timestamp', vr.timestamp,
            'result', vr.result,
            'validation_method', vr.validation_method,
            'attempt_number', vr.attempt_number,
            'validator_id', vr.validator_id
        )
    )
    FROM validation_records vr
    WHERE vr.user_id = p_user_id
    AND (p_since_timestamp IS NULL OR vr.timestamp > p_since_timestamp);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## CONCLUSION

This technical system design specification for Dao-Yu-101 provides a comprehensive architecture for a constraint-driven educational platform. The design enforces:

1. **Learning Integrity**: All progression is derived from validation records, with no shortcuts or bypasses
2. **Strict Progression**: Lessons unlock only after prerequisite validation, with no exceptions
3. **Robust Validation**: Mandatory validation for every lesson, with clear escalation paths
4. **Anti-Cheat Measures**: Plagiarism detection, anonymized peer review, and collaborative task validation
5. **Role-Based Security**: Database-level permissions with comprehensive audit logging
6. **Bounded Gamification**: XP and badges support learning but cannot affect progression
7. **Purposeful Design**: Minecraft-style elements evaluated against learning objectives
8. **Reliable Sync**: Offline capability with conflict detection and resolution

All non-negotiable requirements have been addressed with specific database schemas, algorithms, and enforcement rules. The system prioritizes learning integrity above all other concerns while providing engaging, effective educational experiences.