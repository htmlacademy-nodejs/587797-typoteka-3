-- Получить список всех категорий (идентификатор, наименование категории);
SELECT category_id, name FROM categories;

-- Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);
SELECT c.category_id, c.name
FROM categories AS c
JOIN posts_categories AS pc
ON c.category_id = pc.category_id
GROUP BY c.category_id;

-- Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);
SELECT c.category_id, c.name, COUNT(pc.*) AS posts_count
FROM categories AS c
LEFT JOIN posts_categories AS pc
ON c.category_id = pc.category_id
GROUP BY c.category_id;

-- Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;
SELECT p.post_id, p.title, p.announce, p.published_at, u.name, u.surname, u.email,
(SELECT COUNT(*) FROM posts_comments WHERE post_id = p.post_id) AS commentsCount,
(SELECT string_agg(c.name, ', ') FROM categories AS c JOIN posts_categories AS pc ON c.category_id = pc.category_id WHERE pc.post_id = p.post_id) AS categories
FROM posts AS p
JOIN users AS u
ON p.author_id = u.user_id
ORDER BY p.published_at DESC;

-- Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
SELECT p.post_id, p.title, p.announce, p.published_at, p.picture, u.name, u.surname, u.email,
(SELECT COUNT(*) FROM posts_comments WHERE post_id = p.post_id) AS commentsCount,
(SELECT string_agg(c.name, ', ') FROM categories AS c JOIN posts_categories AS pc ON c.category_id = pc.category_id WHERE pc.post_id = p.post_id) AS categories
FROM posts AS p
JOIN users AS u
ON p.author_id = u.user_id
WHERE p.post_id = 561465857;

-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария);
SELECT pc.comment_id, pc.post_id, u.name, u.surname, pc.text
FROM posts_comments AS pc
JOIN users AS u
ON pc.author_id = u.user_id
ORDER BY pc.created_at DESC
LIMIT 5;

-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии;
SELECT pc.comment_id, pc.post_id, u.name, u.surname, pc.text
FROM posts_comments AS pc
JOIN users AS u
ON pc.author_id = u.user_id
WHERE pc.post_id = 561465857
ORDER BY pc.created_at DESC;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE posts SET title = 'Как я встретил Новый год' WHERE post_id = 561465857;
