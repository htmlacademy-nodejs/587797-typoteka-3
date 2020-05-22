DROP TABLE IF EXISTS public.posts_categories CASCADE;
DROP TABLE IF EXISTS public.posts_comments CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
    user_id    bigint                              NOT NULL PRIMARY KEY,
    email      character varying(256)              NOT NULL UNIQUE,
    password   character varying(256)              NOT NULL,
    name       character varying(256)              NOT NULL,
    surname    character varying(256)              NOT NULL,
    avatar     character varying(256)              NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.categories (
    category_id bigint                              NOT NULL PRIMARY KEY,
    name        character varying(256)              NOT NULL,
    created_at  timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.posts (
    post_id      bigint                              NOT NULL PRIMARY KEY,
    title        character varying(256)              NOT NULL,
    announce     character varying(1000)             NOT NULL,
    text         text                                NULL,
    picture      character varying(256)              NOT NULL,
    published_at timestamp                           NOT NULL,
    created_at   timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.posts_categories (
    post_id     bigint NOT NULL REFERENCES posts(post_id)          ON DELETE CASCADE,
    category_id bigint NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

CREATE TABLE public.posts_comments (
    comment_id bigint NOT NULL PRIMARY KEY,
    text       text   NOT NULL,
    post_id    bigint NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    author_id  bigint NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO users VALUES(1, 'email1@email.com', 'ad21d2a', 'name1', 'surname1', 'avatar1');
INSERT INTO categories VALUES (1, 'books'), (2, 'sport'), (3, 'cars');
INSERT INTO posts VALUES(1, 'title1', 'announce1', 'text1', 'picture1', '2020-01-02 01:02:03');
INSERT INTO posts_categories VALUES(1, 1);
