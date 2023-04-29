-- Active: 1678799220321@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL
    );

INSERT INTO
    users (id, name, email, password, role)
VALUES (
        "u001",
        "Fulano",
        "fulano@email.com",
        "$2a$12$Hqc0jtBQIC7b8PfTmkFlAuoUuS5oTpR86FTpAFpTWlUV0GEmceMau",
        "NORMAL"
    ), (
        "u002",
        "Beltrana",
        "beltrana@email.com",
        "$2a$12$VlNIIeDwm8ix92G42Iu9iOfgLYLmM9Mqa74iWSFNjqiXwkZor1Lh2",
        "NORMAL"
    ), (
        "u003",
        "Midori",
        "midori@email.com",
        "$2a$12$FaTcNb/ncDUyVU/YSRg0N.pVGit8EeLj7qu0Octjaz57dNrsEecM2",
        "ADMIN"
    );

-- u001 senha:fulano123 , u002 senha: beltrana00, u003 senha: midori123

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT(0) NOT NULL,
        dislikes INTEGER DEFAULT(0) NOT NULL,
        created_at TEXT DEFAULT(DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
        Foreign Key (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

INSERT INTO
    posts(id, creator_id, content)
VALUES (
        "p001",
        "u001",
        "Primeiro post nessa rede!!"
    ), (
        "p002",
        "u001",
        "To gostando mesmo"
    ), (
        "p003",
        "u002",
        "me divertindo aqui"
    ), (
        "p004",
        "u003",
        "Muito bom o dia de hj!!"
    );

SELECT*FROM posts;

CREATE TABLE
    likes_dislikes(
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        Foreign Key (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        Foreign Key (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    comments(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT(0) NOT NULL,
        dislikes INTEGER DEFAULT(0) NOT NULL,
        created_at TEXT DEFAULT(DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
        Foreign Key (creator_id) REFERENCES users(id),
        Foreign Key (post_id) REFERENCES posts(id)
    );

INSERT INTO
    comments(
        id,
        creator_id,
        post_id,
        content
    )
VALUES (
        "c001",
        "u003",
        "p001",
        "Primeiro a comentar nessa rede!"
    ), (
        "c002",
        "u001",
        "p002",
        "To gostando tbm"
    );

CREATE TABLE
    likes_dislikes_comments(
        user_id TEXT NOT NULL,
        comment_id TEXT NOT NULL,
        like INTEGER NOT NULL,
        Foreign Key (user_id) REFERENCES users(id),
        Foreign Key (comment_id) REFERENCES comments(id)
    );

SELECT
    comments.id,
    comments.creator_id,
    comments.post_id,
    comments.content,
    comments.likes,
    comments.dislikes,
    comments.created_at,
    comments.updated_at
FROM comments
    INNER JOIN posts ON comments.post_id = posts.id
WHERE post_id = "p001";

SELECT
comments.id,
    comments.creator_id,
    comments.post_id,
    comments.content,
    comments.likes,
    comments.dislikes,
    comments.created_at,
    comments.updated_at,
    users.name AS creator_name
FROM comments
INNER JOIN users ON comments.creator_id = users.id
INNER JOIN posts ON comments.post_id = posts.id
WHERE comments.post_id = "p001";

INSERT INTO
    comments(
        id,
        creator_id,
        post_id,
        content
    )
VALUES (
        "c003",
        "u003",
        "p001",
        "SEGUNDO a comentar nessa rede!"
    ), (
        "c004",
        "u001",
        "p001",
        "To gostando tbm"
    );