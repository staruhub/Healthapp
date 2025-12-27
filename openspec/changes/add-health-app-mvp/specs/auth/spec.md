# Authentication & Authorization Specification

## ADDED Requirements

### Requirement: User Registration
The system SHALL allow users to register with email and password credentials.

#### Scenario: Successful registration
- **WHEN** a user submits valid email and password (password ≥8 characters)
- **THEN** the system creates a new user account with bcrypt-hashed password (≥12 rounds)
- **AND** returns user_id and success message
- **AND** does not return the password or hash

#### Scenario: Duplicate email registration
- **WHEN** a user attempts to register with an already-registered email
- **THEN** the system returns 409 Conflict error
- **AND** provides message "Email already registered"

#### Scenario: Invalid password
- **WHEN** a user submits a password shorter than 8 characters
- **THEN** the system returns 422 Validation Error
- **AND** provides message indicating password requirements

### Requirement: User Login
The system SHALL authenticate users and issue JWT tokens upon successful login.

#### Scenario: Successful login
- **WHEN** a user submits valid email and password credentials
- **THEN** the system verifies password against bcrypt hash
- **AND** returns access_token (JWT, 30-minute expiry)
- **AND** returns refresh_token (JWT, 7-day expiry)
- **AND** returns token_type as "bearer"
- **AND** returns expires_in as 1800 (seconds)

#### Scenario: Invalid credentials
- **WHEN** a user submits incorrect email or password
- **THEN** the system returns 401 Unauthorized
- **AND** provides generic message "Invalid credentials" (no user enumeration)

#### Scenario: Inactive account
- **WHEN** a user with is_active=false attempts to login
- **THEN** the system returns 403 Forbidden
- **AND** provides message "Account is inactive"

### Requirement: Token Refresh
The system SHALL allow users to refresh expired access tokens using valid refresh tokens.

#### Scenario: Successful token refresh
- **WHEN** a user submits a valid, non-expired refresh_token
- **THEN** the system issues a new access_token (30-minute expiry)
- **AND** optionally issues a new refresh_token
- **AND** returns token_type and expires_in

#### Scenario: Expired refresh token
- **WHEN** a user submits an expired refresh_token
- **THEN** the system returns 401 Unauthorized
- **AND** provides message "Refresh token expired, please login again"

#### Scenario: Invalid refresh token
- **WHEN** a user submits an invalid or malformed refresh_token
- **THEN** the system returns 401 Unauthorized
- **AND** provides message "Invalid refresh token"

### Requirement: Protected Route Authorization
The system SHALL require valid access tokens for all business API endpoints.

#### Scenario: Valid token access
- **WHEN** a user includes a valid access_token in Authorization header (Bearer scheme)
- **THEN** the system extracts user_id from token claims
- **AND** allows access to the requested resource
- **AND** filters all data queries by the extracted user_id

#### Scenario: Missing token
- **WHEN** a user attempts to access a protected endpoint without Authorization header
- **THEN** the system returns 401 Unauthorized
- **AND** provides message "Not authenticated"

#### Scenario: Expired access token
- **WHEN** a user includes an expired access_token
- **THEN** the system returns 401 Unauthorized
- **AND** provides message "Token expired"
- **AND** client should attempt token refresh

#### Scenario: Invalid token signature
- **WHEN** a user includes a token with invalid signature
- **THEN** the system returns 401 Unauthorized
- **AND** provides message "Invalid token"

### Requirement: User Data Isolation
The system SHALL enforce strict data isolation between users.

#### Scenario: User accesses own data
- **WHEN** an authenticated user requests their own data
- **THEN** the system returns only records where user_id matches the token's user_id
- **AND** includes all matching records

#### Scenario: User attempts cross-user access
- **WHEN** an authenticated user attempts to access another user's data (e.g., via URL manipulation)
- **THEN** the system returns 403 Forbidden or empty result set
- **AND** logs the unauthorized access attempt

#### Scenario: Query without user_id filter
- **WHEN** a database query is executed without user_id filtering
- **THEN** the system raises an error or warning (development/testing)
- **AND** prevents the query from executing (production)

### Requirement: Password Security
The system SHALL securely store and handle user passwords.

#### Scenario: Password storage
- **WHEN** a user registers or changes password
- **THEN** the system hashes the password using bcrypt with ≥12 salt rounds
- **AND** stores only the hash, never the plaintext password
- **AND** the hash is stored in the hashed_password column

#### Scenario: Password verification
- **WHEN** a user attempts to login
- **THEN** the system compares submitted password against stored hash using bcrypt.verify
- **AND** does not log or expose the plaintext password
- **AND** uses constant-time comparison to prevent timing attacks

### Requirement: User Profile Onboarding
The system SHALL guide new users through profile setup on first login.

#### Scenario: First-time user login
- **WHEN** a user logs in for the first time (profile not completed)
- **THEN** the frontend redirects to /onboarding page
- **AND** prompts user to complete profile (goal_type, height, weight, activity_level)

#### Scenario: Profile completion check
- **WHEN** the system checks if a user has completed onboarding
- **THEN** it verifies that profiles table has a record with required fields (goal_type, height_cm, start_weight_kg)
- **AND** returns profile_completed: true/false in user info endpoint

#### Scenario: Returning user login
- **WHEN** a user with completed profile logs in
- **THEN** the frontend redirects to main application (/log or /dashboard)
- **AND** does not show onboarding flow

