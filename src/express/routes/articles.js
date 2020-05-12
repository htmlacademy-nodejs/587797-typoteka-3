'use strict';

const fs = require(`fs`);
const axios = require(`axios`);
const path = require(`path`);
const {getLogger} = require(`../libs/logger`);
const logger = getLogger();
const multer = require(`multer`);
const mime = require(`mime/lite`);

const InvalidFormException = require(`../exceptions/invalid-form`);

const {
  BASE_API_URL,
  HttpCode
} = require(`../../constants`);

const {
  ARTICLES_PICTURES_DIR,
  TMP_DIR
} = require(`../constants`);

const upload = multer({
  dest: TMP_DIR
});

const {Router} = require(`express`);

const articlesRouter = new Router();

articlesRouter
  .get(`/add`, (req, res) => {
    res.render(`articles/new-post`, {
      title: `post-page`,
      user: {
        role: `author`
      },
      article: {}
    });
  })
  .post(`/add`, upload.single(`picture`), async (req, res, next) => {
    let newFilePath = null;
    const requiredFields = [`title`, `announce`, `fullText`];

    try {
      logger.debug({message: `Got body`, content: req.body});
      logger.debug({message: `Got file`, content: req.file});

      const keysFromForm = Object.keys(req.body);

      const areAllRequiredFieldsExist = requiredFields.every((requiredField) => keysFromForm.includes(requiredField));

      if (!areAllRequiredFieldsExist) {
        throw new InvalidFormException(`Not all required fields are presented. Fields from form: ${keysFromForm.toString()}.
        Required fields: ${requiredFields.toString()}`);
      }

      const {
        mimetype: mimeType,
        size,
        path: filePath,
        originalname: originalName,
        filename: generatedName
      } = req.file;

      if (size === 0 || ![`image/jpeg`, `image/png`, `image/webp`].includes(mimeType)) {
        throw new InvalidFormException(`Empty file or bad mime type. Size ${size}, mimetype: ${mimeType}`);
      }

      const newFileName = `${generatedName}.${mime.getExtension(mimeType)}`;
      newFilePath = path.resolve(ARTICLES_PICTURES_DIR, newFileName);

      await fs.promises.rename(filePath, newFilePath);
      logger.info(`File successfully renamed. Original filename: ${originalName}, generated filename: ${newFileName}`);

      logger.info(`Form is valid. Send post request to record data`);

      const postResponse = await axios
        .post(`${BASE_API_URL}/api/offers`, Object.assign({}, req.body, {avatar: newFileName}));

      logger.info(`Response status is ${postResponse.status}`);

      if (postResponse.status === HttpCode.SUCCESS_POST) {
        res.redirect(`/my`);
      } else {
        next(new Error(`Invalid response status code: ${postResponse.status}`));
      }
    } catch (caughtError) {
      next(caughtError);
    }
  });
articlesRouter.get(`/category/:id`, (req, res) => {
  res.render(`articles/articles-by-category`, {
    activeCategory: 3,
    categories: [
      {
        id: 1,
        title: `Автомобили`,
        count: 88
      },
      {
        id: 2,
        title: `Удаленная работа`,
        count: 13
      },
      {
        id: 3,
        title: `Бизнес`,
        count: 13
      },
      {
        id: 4,
        title: `Путешествия`,
        count: 13
      },
      {
        id: 5,
        title: `Дизайн и обустройство`,
        count: 13
      },
      {
        id: 6,
        title: `Производство игрушек`,
        count: 22
      },
      {
        id: 7,
        title: `UX & UI`,
        count: 22
      }
    ]
  });
});
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const response = await axios.get(`${BASE_API_URL}/articles/${req.params.id}`);
  res.render(`articles/edit-post`, {
    title: `post-page`,
    user: {},
    comments: [],
    article: response.data
  });
});
articlesRouter.get(`/:id`, (req, res) => {
  res.render(`articles/post`, {
    title: `post-page`,
    user: {},
    comments: [],
    post: {
      image: `1`
    }
  });
});

module.exports = articlesRouter;
