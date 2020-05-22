CREATE OR REPLACE FUNCTION pseudo_encrypt(VALUE int) returns int AS $$
DECLARE
l1 int;
l2 int;
r1 int;
r2 int;
i int:=0;
BEGIN
 l1:= (VALUE >> 16) & 65535;
 r1:= VALUE & 65535;
 WHILE i < 3 LOOP
   l2 := r1;
   r2 := l1 # ((((1366 * r1 + 150889) % 714025) / 714025.0) * 32767)::int;
   l1 := l2;
   r1 := r2;
   i := i + 1;
 END LOOP;
 RETURN ((r1 << 16) + l1);
END;
$$ LANGUAGE plpgsql strict immutable;

DROP TABLE IF EXISTS public.posts_categories CASCADE;
DROP TABLE IF EXISTS public.posts_comments CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

DROP SEQUENCE IF EXISTS users_sequence;
DROP SEQUENCE IF EXISTS categories_sequence;
DROP SEQUENCE IF EXISTS posts_sequence;

CREATE SEQUENCE users_sequence;
CREATE TABLE public.users (
    user_id    bigint       NOT NULL PRIMARY KEY DEFAULT pseudo_encrypt(nextval('users_sequence')::int),
    email      VARCHAR(256) NOT NULL UNIQUE,
    password   VARCHAR(256) NOT NULL,
    name       VARCHAR(256) NOT NULL,
    surname    VARCHAR(256) NOT NULL,
    avatar     VARCHAR(256) NOT NULL,
    created_at timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE categories_sequence;
CREATE TABLE public.categories (
    category_id bigint       NOT NULL PRIMARY KEY DEFAULT pseudo_encrypt(nextval('categories_sequence')::int),
    name        VARCHAR(256) NOT NULL,
    created_at  timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE posts_sequence;
CREATE TABLE public.posts (
    post_id      bigint        NOT NULL PRIMARY KEY DEFAULT pseudo_encrypt(nextval('posts_sequence')::int),
    title        VARCHAR(256)  NOT NULL,
    announce     VARCHAR(1000) NOT NULL,
    text         text              NULL,
    picture      VARCHAR(256)  NOT NULL,
    published_at timestamp     NOT NULL,
    created_at   timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP
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

-- INSERT INTO users(email, password, name, surname, avatar)
--   VALUES('email1@email.com', 'ad21d2a', 'name1', 'surname1', 'avatar1');

-- INSERT INTO categories(name) VALUES ('books'), ('sport'), ('cars');

-- INSERT INTO posts(title, announce, text, picture, published_at)
--   VALUES('title1', 'announce1', 'text1', 'picture1', '2020-01-02 01:02:03');

-- INSERT INTO posts_categories VALUES(1, 1);
